import { randomBytes } from "node:crypto";
import type { Socket } from "node:net";
import { createClient } from "@cobblestonejs/protocol";
import protocol770 from "@cobblestonejs/protocol/770";

import type { Connection } from "../packages/protocol/src/connection.js";
import type {
  ChunkData,
  ChunkSection,
} from "../packages/protocol/src/protocol-definition/types/chunk-data.js";
import cat_variant from "./minecraft-registries/cat_variant.js";
import chicken_variant from "./minecraft-registries/chicken_variant.js";
import cow_variant from "./minecraft-registries/cow_variant.js";
import damage_type from "./minecraft-registries/damage_type.js";
import dimension_type from "./minecraft-registries/dimension_type.js";
import frog_variant from "./minecraft-registries/frog_variant.js";
import painting_variant from "./minecraft-registries/painting_variant.js";
import pig_variant from "./minecraft-registries/pig_variant.js";
import wolf_sound_variant from "./minecraft-registries/wolf_sound_variant.js";
import wolf_variant from "./minecraft-registries/wolf_variant.js";
import worldgenBiome from "./minecraft-registries/worldgen.biome.js";
import type { Server } from "./server.js";

export class Client {
  private protocolClient: Connection<typeof protocol770, "serverbound">;

  private username: string | undefined;
  private uuid: string | undefined;

  private verifyToken: Buffer | undefined;

  constructor(
    private server: Server,
    private socket: Socket,
  ) {
    this.protocolClient = createClient("serverbound", socket, protocol770);
    this.protocolClient.on("status:status_request", async () => {
      console.log("Received status request");
      await this.protocolClient.send("status:status_response", {
        jsonResponse: {
          version: {
            name: "1.21.5",
            protocol: 770,
          },
          players: {
            max: 100,
            online: 0,
          },
          description: {
            text: "Hello Rising!",
          },
        },
      });
    });

    this.protocolClient.on("status:ping_request", async (packet) => {
      // TODO: debug why the timestamp received is not a valid timestamp
      await this.protocolClient.send("status:pong_response", {
        timestamp: packet.data.timestamp,
      });
    });

    this.protocolClient.on("login:hello", async (packet) => {
      console.log(
        `this.protocolClient ${packet.data.username} connected with UUID ${packet.data.uuid}`,
      );
      this.username = packet.data.username;
      this.uuid = packet.data.uuid;
      const verifyToken = randomBytes(4);
      this.verifyToken = verifyToken;
      await this.protocolClient.send("login:hello", {
        serverId: "",
        sharedSecret: this.server.keys.public,
        verifyToken,
        shouldAuthenticate: false,
      });
    });

    this.protocolClient.on("login:key", async (packet) => {
      console.log("Received login:key", packet);
      try {
        const decryptedSharedSecret = this.server.nodeRsa.decrypt(
          packet.data.sharedSecret,
        );
        const decryptedVerifyToken = this.server.nodeRsa.decrypt(
          packet.data.verifyToken,
        );
        const expectedToken = this.verifyToken;
        if (!expectedToken || !decryptedVerifyToken.equals(expectedToken)) {
          await this.protocolClient.send("login:login_disconnect", {
            reason: JSON.stringify({
              text: "Invalid verify token",
            }),
          });

          this.disconnect();
          return;
        }
        // Proceed with login using decryptedSharedSecret
        console.log("Shared secret decrypted and verify token validated.");
        this.protocolClient.setSharedSecret(decryptedSharedSecret);
        await this.protocolClient.send("login:login_finished", {
          uuid: this.uuid!,
          username: this.username!,
          properties: [],
        });
      } catch (err) {
        await this.protocolClient.send("login:login_disconnect", {
          reason: JSON.stringify({
            text: "Failed to decrypt shared secret or verify token",
          }),
        });
        this.disconnect();
      }
    });

    this.protocolClient.on("configuration:client_information", async () => {
      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:cat_variant",
        entries: Object.entries(cat_variant).map(([id, data]) => ({
          id: "minecraft:" + id,
          data,
        })),
      });
      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:chicken_variant",
        entries: Object.entries(chicken_variant).map(([id, data]) => ({
          id: "minecraft:" + id,
          data,
        })),
      });

      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:cow_variant",
        entries: Object.entries(cow_variant).map(([id, data]) => ({
          id: "minecraft:" + id,
          data,
        })),
      });

      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:frog_variant",
        entries: Object.entries(frog_variant).map(([id, data]) => ({
          id: "minecraft:" + id,
          data,
        })),
      });

      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:pig_variant",
        entries: Object.entries(pig_variant).map(([id, data]) => ({
          id: "minecraft:" + id,
          data,
        })),
      });

      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:wolf_sound_variant",
        entries: Object.entries(wolf_sound_variant).map(([id, data]) => ({
          id: "minecraft:" + id,
          data,
        })),
      });

      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:wolf_variant",
        entries: Object.entries(wolf_variant).map(([id, data]) => ({
          id: "minecraft:" + id,
          data,
        })),
      });

      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:painting_variant",
        entries: Object.entries(painting_variant).map(([id, data]) => ({
          id: "minecraft:" + id,
          data,
        })),
      });

      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:dimension_type",
        entries: Object.entries(dimension_type).map(([id, data]) => ({
          id: "minecraft:" + id,
          data,
        })),
      });

      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:damage_type",
        entries: Object.entries(damage_type).map(([id, data]) => ({
          id: "minecraft:" + id,
          data,
        })),
      });

      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:worldgen/biome",
        entries: Object.entries(worldgenBiome).map(([id, data]) => ({
          id: "minecraft:" + id,
          data,
        })),
      });

      await this.protocolClient.send("configuration:finish_configuration", {});
    });

    this.protocolClient.on("configuration:finish_configuration", async () => {
      await this.protocolClient.send("play:login", {
        entityId: 0,
        isHardcore: false,
        dimensionNames: ["minecraft:overworld"],
        maxPlayers: 100,
        viewDistance: 10,
        simulationDistance: 10,
        reducedDebugInfo: false,
        enableRespawnScreen: true,
        doLimitedCrafting: false,
        dimensionType: 0,
        dimensionName: "minecraft:overworld",
        hashedSeed: 0n,
        gameMode: 0,
        previousGameMode: 0,
        isDebug: false,
        isFlat: false,
        deathPosition: undefined,
        portalCooldown: 1,
        seaLevel: 63,
        enforcesSecureChat: false,
      });
      let teleportId = 0;
      await this.protocolClient.send("play:player_position", {
        teleportId: teleportId++,
        x: 0,
        y: 64,
        z: 0,
        velocityX: 0,
        velocityY: 0,
        velocityZ: 0,
        yaw: 0,
        pitch: 0,
        flags: 0,
      });

      // await this.protocolClient.send("play:level_chunk_with_light", {
      //   x: 0,
      //   z: 0,
      //   data: {
      //     blockEntities: fakeChunk.blockEntities,
      //     data: fakeChunk.data,
      //     heightMaps: fakeChunk.heightMaps,
      //   },
      //   light: fakeChunk.light,
      // });
    });
  }

  public send(data: Buffer) {
    this.socket.write(data);
  }

  public disconnect() {
    this.socket.destroy();
    console.log("Client disconnected");
  }
}
