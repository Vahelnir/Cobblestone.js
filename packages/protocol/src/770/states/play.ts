import type { ProtocolStateDeclaration } from "../../protocol-definition/protocol.js";
import {
  boolean,
  byte,
  identifier,
  int,
  long,
  object,
  optional,
  position,
  prefixedArray,
  ubyte,
  varint,
} from "../../protocol-definition/types.js";

export const play = {
  id: 0x04,
  name: "play",
  packets: {
    clientbound: {
      0x2b: {
        id: 0x2b,
        name: "login",
        schema: object({
          entityId: int(),
          isHardcore: boolean(),
          dimensionNames: prefixedArray({ type: identifier() }),
          maxPlayers: varint(),
          viewDistance: varint(),
          simulationDistance: varint(),
          reducedDebugInfo: boolean(),
          enableRespawnScreen: boolean(),
          doLimitedCrafting: boolean(),
          dimensionType: varint(),
          dimensionName: identifier(),
          hashedSeed: long(),
          gameMode: ubyte(),
          previousGameMode: byte(),
          isDebug: boolean(),
          isFlat: boolean(),
          deathPosition: optional({
            type: object({ dimensionName: identifier(), location: position() }),
          }),
          portalCooldown: varint(),
          seaLevel: varint(),
          enforcesSecureChat: boolean(),
        }),
      },
    },
    serverbound: {},
  },
} satisfies ProtocolStateDeclaration;
