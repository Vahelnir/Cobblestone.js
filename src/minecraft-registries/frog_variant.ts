import type { NBTCompoundTag } from "../../packages/nbt/src/tags.js";

export default {
  cold: {
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
                  { type: "string", name: "type", value: "minecraft:biome" },
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
  temperate: {
    type: "compound",
    name: "",
    value: [
      {
        type: "string",
        name: "asset_id",
        value: "minecraft:entity/frog/temperate_frog",
      },
      {
        type: "list",
        name: "spawn_conditions",
        value: [
          {
            type: "compound",
            value: [{ type: "int", name: "priority", value: 0 }],
          },
        ],
      },
    ],
  },
  warm: {
    type: "compound",
    name: "",
    value: [
      {
        type: "string",
        name: "asset_id",
        value: "minecraft:entity/frog/warm_frog",
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
                  { type: "string", name: "type", value: "minecraft:biome" },
                  {
                    type: "string",
                    name: "biomes",
                    value: "#minecraft:spawns_warm_variant_frogs",
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
} as Record<string, NBTCompoundTag>;
