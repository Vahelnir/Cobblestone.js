import type { ProtocolStateDeclaration } from "../../protocol-definition/protocol.js";
import {
  boolean,
  byte,
  byteArray,
  identifier,
  nbt,
  object,
  optional,
  prefixedArray,
  string,
  ubyte,
  varint,
} from "../../protocol-definition/types.js";

export const configuration = {
  id: 0x03,
  name: "configuration",
  packets: {
    clientbound: {
      0x03: {
        id: 0x03,
        name: "finish_configuration",
        schema: object({}),
      },
      0x07: {
        id: 0x07,
        name: "registry_data",
        schema: object({
          registryId: identifier(),
          entries: prefixedArray({
            type: object({ id: identifier(), data: optional({ type: nbt() }) }),
          }),
        }),
      },
    },
    serverbound: {
      0x00: {
        id: 0x00,
        name: "client_information",
        schema: object({
          locale: string(),
          viewDistance: byte(),
          chatMode: varint(),
          chatColors: boolean(),
          displayedSkinParts: ubyte(),
          mainHand: varint(), // TODO: handle enums
          enableTextFiltering: boolean(),
          allowServerListing: boolean(),
          particleStatus: varint(),
        }),
      },
      0x02: {
        id: 0x02,
        name: "custom_payload",
        schema: object({ channel: identifier(), data: byteArray({}) }),
      },
      0x03: {
        id: 0x03,
        name: "finish_configuration",
        schema: object({}),
        beforeEvent(state) {
          state.protocolState = 4;
          console.log("moving to play state");
        },
      },
    },
  },
} satisfies ProtocolStateDeclaration;
