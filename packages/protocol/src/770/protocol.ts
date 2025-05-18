import { CustomBuffer } from "../custom_buffer.js";
import type { Packet, Protocol } from "../index.js";
import { defineTypeMappings } from "../type_mappings.js";
import type { ProtocolStateDeclaration } from "../types.js";
import type { ClientPacketMap, ServerPacketMap } from "./types.js";

const TypeMappings = defineTypeMappings({
  byte: {
    type: "number",
    read: (buffer: CustomBuffer) => buffer.readByte(),
    write: (buffer: CustomBuffer, value: number) => buffer.writeByte(value),
  },
  unsigned_byte: {
    type: "number",
    read: (buffer: CustomBuffer) => buffer.readUnsignedByte(),
    write: (buffer: CustomBuffer, value: number) =>
      buffer.writeUnsignedByte(value),
  },
  boolean: {
    type: "boolean",
    read: (buffer: CustomBuffer) => buffer.readBoolean(),
    write: (buffer: CustomBuffer, value: boolean) => buffer.writeBoolean(value),
  },
  short: {
    type: "number",
    read: (buffer: CustomBuffer) => buffer.readShort(),
    write: (buffer: CustomBuffer, value: number) => buffer.writeShort(value),
  },
  unsigned_short: {
    type: "number",
    read: (buffer: CustomBuffer) => buffer.readUnsignedShort(),
    write: (buffer: CustomBuffer, value: number) =>
      buffer.writeUnsignedShort(value),
  },
  long: {
    type: "bigint",
    read: (buffer: CustomBuffer) => buffer.readLong(),
    write: (buffer: CustomBuffer, value: bigint) => buffer.writeLong(value),
  },
  varint: {
    type: "number",
    read: (buffer: CustomBuffer) => buffer.readVarInt(),
    write: (buffer: CustomBuffer, value: number) => buffer.writeVarInt(value),
  },
  varlong: {
    type: "bigint",
    read: (buffer: CustomBuffer) => buffer.readVarLong(),
    write: (buffer: CustomBuffer, value: bigint) => buffer.writeVarLong(value),
  },
  string: {
    type: "string",
    read: (buffer: CustomBuffer) => buffer.readString(),
    write: (buffer: CustomBuffer, value: string) => buffer.writeString(value),
  },
});

const handshaking: ProtocolStateDeclaration<typeof TypeMappings> = {
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

const status: ProtocolStateDeclaration<typeof TypeMappings> = {
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

const protocol: Protocol<
  typeof TypeMappings,
  ServerPacketMap,
  ClientPacketMap
> = {
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
