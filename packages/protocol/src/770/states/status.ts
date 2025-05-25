import type { ProtocolStateDeclaration } from "../../protocol-definition/protocol.js";
import { json, long, object } from "../../protocol-definition/types.js";

export const status = {
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
