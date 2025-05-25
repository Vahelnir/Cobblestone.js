import type { Packet } from "../index.js";
import {
  defineProtocolDeclaration,
  type ProtocolStateDeclaration,
} from "../protocol-definition/protocol.js";
import {
  json,
  long,
  object,
  string,
  ushort,
  varint,
} from "../protocol-definition/types.js";
import type { ClientPacketMap, ServerPacketMap } from "./types.js";

const handshake = {
  id: 0x00,
  name: "handshaking",
  packets: {
    clientbound: {},
    serverbound: {
      0x00: {
        id: 0x00,
        name: "handshake",
        schema: object({
          protocolVersion: varint(),
          serverAddress: string({ length: 255 }),
          serverPort: ushort(),
          nextState: varint(),
        }),
        beforeEvent(
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
} satisfies ProtocolStateDeclaration;

const status = {
  id: 0x01,
  name: "status",
  packets: {
    clientbound: {
      0x00: {
        id: 0x00,
        name: "status_response",
        schema: object({
          jsonResponse: json({
            type: "object",
            properties: {
              version: {
                type: "object",
                properties: {
                  name: "string",
                  protocol: "number",
                },
              },
              players: {
                type: "object",
                properties: {
                  max: "number",
                  online: "number",
                },
              },
              description: {
                type: "object",
                properties: {
                  text: "string",
                },
              },
            },
          }),
        }),
      },
      0x01: {
        id: 0x01,
        name: "pong_response",
        schema: object({
          timestamp: long(),
        }),
      },
    },
    serverbound: {
      0x00: {
        id: 0x00,
        name: "status_request",
        schema: object({}),
      },
      0x01: {
        id: 0x01,
        name: "ping_request",
        schema: object({
          timestamp: long(),
        }),
      },
    },
  },
} satisfies ProtocolStateDeclaration;

const declaration = defineProtocolDeclaration<ServerPacketMap, ClientPacketMap>(
  {
    version: 770,
    states: {
      0: handshake,
      1: status,
    },
  },
);

export default declaration;
