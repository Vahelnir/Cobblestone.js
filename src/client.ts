import { randomBytes } from "node:crypto";
import type { Socket } from "node:net";
import { createClient } from "@cobblestonejs/protocol";
import protocol770 from "@cobblestonejs/protocol/770";

import type { Connection } from "../packages/protocol/src/connection.js";
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
      // Send minimal registry data with only the overworld dimension type
      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:dimension_type",
        entries: [
          {
            id: "minecraft:overworld",
            data: {
              type: "compound",
              name: "",
              value: [
                { type: "int", name: "fixed_time", value: 0 },
                { type: "byte", name: "has_skylight", value: 1 },
                { type: "byte", name: "has_ceiling", value: 0 },
                { type: "byte", name: "ultrawarm", value: 0 },
                { type: "byte", name: "natural", value: 1 },
                { type: "double", name: "coordinate_scale", value: 0 },
                { type: "byte", name: "bed_works", value: 1 },
                { type: "byte", name: "respawn_anchor_works", value: 1 },
                { type: "int", name: "min_y", value: -64 },
                { type: "int", name: "height", value: 384 },
                { type: "int", name: "logical_height", value: 384 },
                {
                  type: "string",
                  name: "infiniburn",
                  value: "minecraft:infiniburn_overworld",
                },
                {
                  type: "string",
                  name: "effects",
                  value: "minecraft:overworld",
                },
                { type: "float", name: "ambient_light", value: 0 },
                { type: "byte", name: "piglin_safe", value: 1 },
                { type: "byte", name: "has_raids", value: 1 },
                { type: "int", name: "monster_spawn_light_level", value: 0 },
                {
                  type: "int",
                  name: "monster_spawn_block_light_limit",
                  value: 0,
                },
              ],
            },
          },
        ],
      });
      await this.protocolClient.send("configuration:finish_configuration", {});
    });

    this.protocolClient.on("configuration:finish_configuration", async () => {
      await this.protocolClient.send("play:login", {
        entityId: 0,
        isHardcore: false,
        dimensionNames: ["minecraft:overworld"],
        gameMode: 0,
        maxPlayers: 100,
        viewDistance: 10,
        simulationDistance: 10,
        reducedDebugInfo: false,
        enableRespawnScreen: true,
        doLimitedCrafting: false,
        dimensionType: 0,
        dimensionName: "minecraft:overworld",
        hashedSeed: BigInt(0),
        previousGameMode: 0,
        isDebug: false,
        isFlat: false,
        hasDeathLocation: false,
        deathDimensionName: undefined,
        deathLocation: undefined,
        portalCooldown: 0,
        seaLevel: 63,
        enforcesSecureChat: false,
      });
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
