import { CustomBuffer } from "../custom_buffer.js";
import type { Packet, Protocol } from "../index.js";
import { defineTypeMappings } from "../type_mappings.js";
import type { ProtocolStateDeclaration } from "../types.js";
import type { ClientPacketMap, ServerPacketMap } from "./types.js";

const TypeMappings = defineTypeMappings({
  byte: {
    type: "number",
    read: (buffer) => buffer.readByte(),
    write: (buffer, value) => buffer.writeByte(value),
  },
  unsigned_byte: {
    type: "number",
    read: (buffer) => buffer.readUnsignedByte(),
    write: (buffer, value) => buffer.writeUnsignedByte(value),
  },
  boolean: {
    type: "boolean",
    read: (buffer) => buffer.readBoolean(),
    write: (buffer, value) => buffer.writeBoolean(value),
  },
  short: {
    type: "number",
    read: (buffer) => buffer.readShort(),
    write: (buffer, value) => buffer.writeShort(value),
  },
  unsigned_short: {
    type: "number",
    read: (buffer) => buffer.readUnsignedShort(),
    write: (buffer, value) => buffer.writeUnsignedShort(value),
  },
  long: {
    type: "bigint",
    read: (buffer) => buffer.readLong(),
    write: (buffer, value) => buffer.writeLong(value),
  },
  varint: {
    type: "number",
    read: (buffer) => buffer.readVarInt(),
    write: (buffer, value) => buffer.writeVarInt(value),
  },
  varlong: {
    type: "bigint",
    read: (buffer) => buffer.readVarLong(),
    write: (buffer, value) => buffer.writeVarLong(value),
  },
  string: {
    type: "string",
    read: (buffer) => buffer.readString(),
    write: (buffer, value) => buffer.writeString(value),
  },
});

type AllowedTypes = keyof typeof TypeMappings;

const handshaking: ProtocolStateDeclaration<AllowedTypes> = {
  id: 0x00,
  name: "handshaking",
  packets: {
    clientbound: {},
    serverbound: {
      0x00: {
        id: 0x00,
        name: "handshake",
        schema: [
          { name: "protocolVersion", type: "varint" },
          { name: "serverAddress", type: "string", length: 255 },
          { name: "serverPort", type: "unsigned_short" },
          { name: "nextState", type: "varint" },
        ],
        handle(
          state,
          packet: Packet<{
            protocolVersion: number;
            serverAddress: string;
            serverPort: number;
            nextState: number;
          }>,
        ) {
          state.protocolState = packet.data.nextState;
          state.version = packet.data.protocolVersion;
          console.log(
            "Protocol version:",
            packet.data.protocolVersion,
            state.protocolState,
          );
        },
      },
    },
  },
};

const status: ProtocolStateDeclaration<AllowedTypes> = {
  id: 0x01,
  name: "status",
  packets: {
    clientbound: {
      0x00: {
        id: 0x00,
        name: "status_response",
        schema: [{ name: "jsonResponse", type: "string" }],
      },
      0x01: {
        id: 0x01,
        name: "pong_response",
        schema: [{ name: "timestamp", type: "long" }],
      },
    },
    serverbound: {
      0x00: {
        id: 0x00,
        name: "status_request",
        schema: [],
      },
      0x01: {
        id: 0x01,
        name: "ping_request",
        schema: [{ name: "timestamp", type: "long" }],
      },
    },
  },
};

const protocol: Protocol<ServerPacketMap, ClientPacketMap> = {
  version: 770,
  types: TypeMappings,
  states: {
    0: handshaking,
    1: status,
  },
  __serverPackets: {} as ServerPacketMap,
  __clientPackets: {} as ClientPacketMap,
};

export default protocol;
