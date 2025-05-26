import { defineProtocolDeclaration } from "../protocol-definition/protocol.js";
import { configuration } from "./states/configuration.js";
import { handshake } from "./states/handshake.js";
import { login } from "./states/login.js";
import { play } from "./states/play.js";
import { status } from "./states/status.js";
import type { ClientPacketMap, ServerPacketMap } from "./types.js";

const declaration = defineProtocolDeclaration<ServerPacketMap, ClientPacketMap>(
  {
    version: 770,
    states: {
      0: handshake,
      1: status,
      2: login,
      3: configuration,
      4: play,
    },
  },
);

export default declaration;
