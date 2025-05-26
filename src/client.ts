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
                { type: "byte", name: "has_skylight", value: 1 },
                { type: "byte", name: "has_ceiling", value: 0 },
                { type: "byte", name: "ultrawarm", value: 0 },
                { type: "byte", name: "natural", value: 1 },
                { type: "double", name: "coordinate_scale", value: 1 },
                { type: "byte", name: "bed_works", value: 1 },
                { type: "byte", name: "respawn_anchor_works", value: 0 },
                { type: "int", name: "min_y", value: -64 },
                { type: "int", name: "height", value: 384 },
                { type: "int", name: "logical_height", value: 384 },
                {
                  type: "string",
                  name: "infiniburn",
                  value: "#minecraft:infiniburn_overworld",
                },
                {
                  type: "string",
                  name: "effects",
                  value: "minecraft:overworld",
                },
                { type: "float", name: "ambient_light", value: 0 },
                { type: "byte", name: "piglin_safe", value: 0 },
                { type: "byte", name: "has_raids", value: 1 },
                {
                  type: "compound",
                  name: "monster_spawn_light_level",
                  value: [
                    {
                      type: "string",
                      name: "type",
                      value: "minecraft:uniform",
                    },
                    { type: "int", name: "min_inclusive", value: 0 },
                    { type: "int", name: "max_inclusive", value: 7 },
                  ],
                },
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
      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:cat_variant",
        entries: [
          {
            id: "minecraft:all_black",
            data: {
              type: "compound",
              name: "",
              value: [
                {
                  type: "string",
                  name: "asset_id",
                  value: "minecraft:entity/cat/all_black",
                },
                {
                  type: "list",
                  name: "spawn_conditions",
                  value: [
                    {
                      type: "compound",
                      value: [
                        {
                          type: "compound",
                          name: "condition",
                          value: [
                            {
                              type: "string",
                              name: "type",
                              value: "minecraft:structure",
                            },
                            {
                              type: "string",
                              name: "structures",
                              value: "#minecraft:cats_spawn_as_black",
                            },
                          ],
                        },
                        { type: "int", name: "priority", value: 1 },
                      ],
                    }, // Explicitly cast  to satisfy NBTCompoundTag
                    {
                      type: "compound",
                      value: [
                        {
                          type: "compound",
                          name: "condition",
                          value: [
                            {
                              type: "string",
                              name: "type",
                              value: "minecraft:moon_brightness",
                            },
                            {
                              type: "compound",
                              name: "range",
                              value: [
                                { type: "float", name: "min", value: 0.9 },
                              ],
                            },
                          ],
                        },
                        { type: "int", name: "priority", value: 0 },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      });
      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:chicken_variant",
        entries: [
          {
            id: "minecraft:cold",
            data: {
              type: "compound",
              name: "",
              value: [
                {
                  type: "string",
                  name: "asset_id",
                  value: "minecraft:entity/chicken/cold_chicken",
                },
                { type: "string", name: "model", value: "cold" },
                {
                  type: "list",
                  name: "spawn_conditions",
                  value: [
                    {
                      type: "compound",
                      value: [
                        {
                          type: "compound",
                          name: "condition",
                          value: [
                            {
                              type: "string",
                              name: "type",
                              value: "minecraft:biome",
                            },
                            {
                              type: "string",
                              name: "biomes",
                              value:
                                "#minecraft:spawns_cold_variant_farm_animals",
                            },
                          ],
                        },
                        { type: "int", name: "priority", value: 1 },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      });
      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:cow_variant",
        entries: [
          {
            id: "minecraft:cold",
            data: {
              type: "compound",
              name: "",
              value: [
                {
                  type: "string",
                  name: "asset_id",
                  value: "minecraft:entity/cow/cold_cow",
                },
                { type: "string", name: "model", value: "cold" },
                {
                  type: "list",
                  name: "spawn_conditions",
                  value: [
                    {
                      type: "compound",
                      value: [
                        {
                          type: "compound",
                          name: "condition",
                          value: [
                            {
                              type: "string",
                              name: "type",
                              value: "minecraft:biome",
                            },
                            {
                              type: "string",
                              name: "biomes",
                              value:
                                "#minecraft:spawns_cold_variant_farm_animals",
                            },
                          ],
                        },
                        { type: "int", name: "priority", value: 1 },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      });
      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:frog_variant",
        entries: [
          {
            id: "minecraft:cold",
            data: {
              type: "compound",
              name: "",
              value: [
                {
                  type: "string",
                  name: "asset_id",
                  value: "minecraft:entity/frog/cold_frog",
                },
                {
                  type: "list",
                  name: "spawn_conditions",
                  value: [
                    {
                      type: "compound",
                      value: [
                        {
                          type: "compound",
                          name: "condition",
                          value: [
                            {
                              type: "string",
                              name: "type",
                              value: "minecraft:biome",
                            },
                            {
                              type: "string",
                              name: "biomes",
                              value: "#minecraft:spawns_cold_variant_frogs",
                            },
                          ],
                        },
                        { type: "int", name: "priority", value: 1 },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      });
      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:painting_variant",
        entries: [
          {
            id: "minecraft:alban",
            data: {
              type: "compound",
              name: "",
              value: [
                { type: "string", name: "asset_id", value: "minecraft:alban" },
                {
                  type: "compound",
                  name: "author",
                  value: [
                    { type: "string", name: "color", value: "gray" },
                    {
                      type: "string",
                      name: "translate",
                      value: "painting.minecraft.alban.author",
                    },
                  ],
                },
                { type: "int", name: "height", value: 1 },
                {
                  type: "compound",
                  name: "title",
                  value: [
                    { type: "string", name: "color", value: "yellow" },
                    {
                      type: "string",
                      name: "translate",
                      value: "painting.minecraft.alban.title",
                    },
                  ],
                },
                { type: "int", name: "width", value: 1 },
              ],
            },
          },
        ],
      });
      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:pig_variant",
        entries: [
          {
            id: "minecraft:cold",
            data: {
              type: "compound",
              name: "",
              value: [
                {
                  type: "string",
                  name: "asset_id",
                  value: "minecraft:entity/pig/cold_pig",
                },
                { type: "string", name: "model", value: "cold" },
                {
                  type: "list",
                  name: "spawn_conditions",
                  value: [
                    {
                      type: "compound",
                      value: [
                        {
                          type: "compound",
                          name: "condition",
                          value: [
                            {
                              type: "string",
                              name: "type",
                              value: "minecraft:biome",
                            },
                            {
                              type: "string",
                              name: "biomes",
                              value:
                                "#minecraft:spawns_cold_variant_farm_animals",
                            },
                          ],
                        },
                        { type: "int", name: "priority", value: 1 },
                      ],
                    },
                  ],
                },
              ],
            },
          },
        ],
      });
      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:wolf_sound_variant",
        entries: [
          {
            id: "minecraft:angry",
            data: {
              type: "compound",
              name: "",
              value: [
                {
                  type: "string",
                  name: "ambient_sound",
                  value: "minecraft:entity.wolf_angry.ambient",
                },
                {
                  type: "string",
                  name: "death_sound",
                  value: "minecraft:entity.wolf_angry.death",
                },
                {
                  type: "string",
                  name: "growl_sound",
                  value: "minecraft:entity.wolf_angry.growl",
                },
                {
                  type: "string",
                  name: "hurt_sound",
                  value: "minecraft:entity.wolf_angry.hurt",
                },
                {
                  type: "string",
                  name: "pant_sound",
                  value: "minecraft:entity.wolf_angry.pant",
                },
                {
                  type: "string",
                  name: "whine_sound",
                  value: "minecraft:entity.wolf_angry.whine",
                },
              ],
            },
          },
        ],
      });
      await this.protocolClient.send("configuration:registry_data", {
        registryId: "minecraft:wolf_variant",
        entries: [
          {
            id: "minecraft:ashen",
            data: {
              type: "compound",
              name: "",
              value: [
                {
                  type: "compound",
                  name: "assets",
                  value: [
                    {
                      type: "string",
                      name: "angry",
                      value: "minecraft:entity/wolf/wolf_ashen_angry",
                    },
                    {
                      type: "string",
                      name: "tame",
                      value: "minecraft:entity/wolf/wolf_ashen_tame",
                    },
                    {
                      type: "string",
                      name: "wild",
                      value: "minecraft:entity/wolf/wolf_ashen",
                    },
                  ],
                },
                {
                  type: "list",
                  name: "spawn_conditions",
                  value: [
                    {
                      type: "compound",
                      value: [
                        {
                          type: "compound",
                          name: "condition",
                          value: [
                            {
                              type: "string",
                              name: "type",
                              value: "minecraft:biome",
                            },
                            {
                              type: "string",
                              name: "biomes",
                              value: "minecraft:snowy_taiga",
                            },
                          ],
                        },
                        { type: "int", name: "priority", value: 1 },
                      ],
                    },
                  ],
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
        hasDeathLocation: false,
        deathPosition: undefined,
        portalCooldown: 1,
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
