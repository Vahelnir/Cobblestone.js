import type { ProtocolStateDeclaration } from "../../protocol-definition/protocol.js";
import {
  boolean,
  byte,
  byteArray,
  identifier,
  jsonTextComponent,
  object,
  optional,
  prefixedArray,
  prefixedByteArray,
  string,
  uuid,
  varint,
} from "../../protocol-definition/types.js";

export const login = {
  id: 0x02,
  name: "login",
  packets: {
    clientbound: {
      0x00: {
        id: 0x00,
        name: "login_disconnect",
        // JSON Text Component
        schema: object({ reason: jsonTextComponent() }),
      },
      0x01: {
        id: 0x01,
        name: "hello",
        schema: object({
          serverId: string(),
          sharedSecret: prefixedByteArray(),
          verifyToken: prefixedByteArray(),
          shouldAuthenticate: boolean(),
        }),
      },
      0x02: {
        id: 0x02,
        name: "login_finished",
        schema: object({
          uuid: uuid(),
          username: string(),
          properties: prefixedArray({
            type: object({
              name: string(),
              value: string(),
              signature: string(),
            }),
            elementSize: 16,
          }),
        }),
      },
      0x03: {
        id: 0x03,
        name: "login_compression",
        schema: object({
          threshold: varint(),
        }),
      },
      0x04: {
        id: 0x04,
        name: "custom_query",
        schema: object({
          messageId: varint(),
          channel: identifier(),
          data: byteArray({}),
        }),
      },
      0x05: {
        id: 0x05,
        name: "cookie_request",
        schema: object({ key: identifier() }),
      },
    },
    serverbound: {
      0x00: {
        id: 0x00,
        name: "hello",
        schema: object({
          username: string(),
          uuid: uuid(),
        }),
      },
      0x01: {
        id: 0x01,
        name: "key",
        schema: object({
          sharedSecret: prefixedByteArray(),
          verifyToken: prefixedByteArray(),
        }),
      },
      0x02: {
        id: 0x02,
        name: "custom_query_answer",
        schema: object({
          messageId: varint(),
          data: optional({ type: byteArray({}) }),
        }),
      },
      0x03: {
        id: 0x03,
        name: "login_acknowledged",
        schema: object({}),
        beforeEvent(state, packet) {
          state.protocolState = 0x03;
          console.log("Login acknowledged, transitioning to next state.");
        },
      },
      0x04: {
        id: 0x04,
        name: "cookie_response",
        schema: object({
          key: identifier(),
          value: optional({
            type: prefixedArray({ type: byte(), elementSize: 1 }),
          }),
        }),
      },
    },
  },
} satisfies ProtocolStateDeclaration;
