export default {
  cold: {
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
                  { type: "string", name: "type", value: "minecraft:biome" },
                  {
                    type: "string",
                    name: "biomes",
                    value: "#minecraft:spawns_cold_variant_farm_animals",
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
        value: "minecraft:entity/chicken/temperate_chicken",
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
        value: "minecraft:entity/chicken/warm_chicken",
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
                    value: "#minecraft:spawns_warm_variant_farm_animals",
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
};
