import type { Packet } from "../../index.js";
import type { ProtocolStateDeclaration } from "../../protocol-definition/protocol.js";
import {
  object,
  string,
  ushort,
  varint,
} from "../../protocol-definition/types.js";

export const handshake = {
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
          serverAddress: string(),
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
