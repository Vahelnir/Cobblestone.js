import type { ProtocolStateDeclaration } from "../../protocol-definition/protocol.js";
import {
  boolean,
  byte,
  byteArray,
  double,
  float,
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
import { chunkData } from "../../protocol-definition/types/chunk-data.js";
import { lightData } from "../../protocol-definition/types/light-data.js";

export const play = {
  id: 0x04,
  name: "play",
  packets: {
    clientbound: {
      0x27: {
        id: 0x27,
        name: "level_chunk_with_light",
        schema: object({
          x: int(),
          z: int(),
          data: chunkData(),
          light: lightData(),
        }),
      },
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
      0x41: {
        id: 0x41,
        name: "player_position",
        schema: object({
          teleportId: varint(),
          x: double(),
          y: double(),
          z: double(),
          velocityX: double(),
          velocityY: double(),
          velocityZ: double(),
          yaw: float(),
          pitch: float(),
          flags: int(), // TeleportFlags
        }),
      },
    },
    serverbound: {
      0x00: {
        id: 0x00,
        name: "accept_teleportation",
        schema: object({
          teleportId: varint(),
        }),
      },
      0x0b: {
        id: 0x0b,
        name: "client_tick_end",
        schema: object({}),
      },
      0x14: {
        id: 0x14,
        name: "custom_payload",
        schema: object({
          channel: identifier(),
          data: byteArray({}),
        }),
      },
      0x1c: {
        id: 0x1c,
        name: "move_player_pos",
        schema: object({
          x: double(),
          feetY: double(),
          z: double(),
          flags: byte(),
        }),
      },
      0x1d: {
        id: 0x1d,
        name: "move_player_pos_rot",
        schema: object({
          x: double(),
          feetY: double(),
          z: double(),
          yaw: float(),
          pitch: float(),
          flags: byte(),
        }),
      },
    },
  },
} satisfies ProtocolStateDeclaration;
