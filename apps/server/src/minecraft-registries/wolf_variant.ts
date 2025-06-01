import type { NBTCompoundTag } from "../../packages/nbt/src/tags.js";

export default {
  ashen: {
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
                  { type: "string", name: "type", value: "minecraft:biome" },
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
  black: {
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
            value: "minecraft:entity/wolf/wolf_black_angry",
          },
          {
            type: "string",
            name: "tame",
            value: "minecraft:entity/wolf/wolf_black_tame",
          },
          {
            type: "string",
            name: "wild",
            value: "minecraft:entity/wolf/wolf_black",
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
                  { type: "string", name: "type", value: "minecraft:biome" },
                  {
                    type: "string",
                    name: "biomes",
                    value: "minecraft:old_growth_pine_taiga",
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
  chestnut: {
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
            value: "minecraft:entity/wolf/wolf_chestnut_angry",
          },
          {
            type: "string",
            name: "tame",
            value: "minecraft:entity/wolf/wolf_chestnut_tame",
          },
          {
            type: "string",
            name: "wild",
            value: "minecraft:entity/wolf/wolf_chestnut",
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
                  { type: "string", name: "type", value: "minecraft:biome" },
                  {
                    type: "string",
                    name: "biomes",
                    value: "minecraft:old_growth_spruce_taiga",
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
  pale: {
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
            value: "minecraft:entity/wolf/wolf_angry",
          },
          {
            type: "string",
            name: "tame",
            value: "minecraft:entity/wolf/wolf_tame",
          },
          { type: "string", name: "wild", value: "minecraft:entity/wolf/wolf" },
        ],
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
  rusty: {
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
            value: "minecraft:entity/wolf/wolf_rusty_angry",
          },
          {
            type: "string",
            name: "tame",
            value: "minecraft:entity/wolf/wolf_rusty_tame",
          },
          {
            type: "string",
            name: "wild",
            value: "minecraft:entity/wolf/wolf_rusty",
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
                  { type: "string", name: "type", value: "minecraft:biome" },
                  {
                    type: "string",
                    name: "biomes",
                    value: "#minecraft:is_jungle",
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
  snowy: {
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
            value: "minecraft:entity/wolf/wolf_snowy_angry",
          },
          {
            type: "string",
            name: "tame",
            value: "minecraft:entity/wolf/wolf_snowy_tame",
          },
          {
            type: "string",
            name: "wild",
            value: "minecraft:entity/wolf/wolf_snowy",
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
                  { type: "string", name: "type", value: "minecraft:biome" },
                  { type: "string", name: "biomes", value: "minecraft:grove" },
                ],
              },
              { type: "int", name: "priority", value: 1 },
            ],
          },
        ],
      },
    ],
  },
  spotted: {
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
            value: "minecraft:entity/wolf/wolf_spotted_angry",
          },
          {
            type: "string",
            name: "tame",
            value: "minecraft:entity/wolf/wolf_spotted_tame",
          },
          {
            type: "string",
            name: "wild",
            value: "minecraft:entity/wolf/wolf_spotted",
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
                  { type: "string", name: "type", value: "minecraft:biome" },
                  {
                    type: "string",
                    name: "biomes",
                    value: "#minecraft:is_savanna",
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
  striped: {
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
            value: "minecraft:entity/wolf/wolf_striped_angry",
          },
          {
            type: "string",
            name: "tame",
            value: "minecraft:entity/wolf/wolf_striped_tame",
          },
          {
            type: "string",
            name: "wild",
            value: "minecraft:entity/wolf/wolf_striped",
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
                  { type: "string", name: "type", value: "minecraft:biome" },
                  {
                    type: "string",
                    name: "biomes",
                    value: "#minecraft:is_badlands",
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
  woods: {
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
            value: "minecraft:entity/wolf/wolf_woods_angry",
          },
          {
            type: "string",
            name: "tame",
            value: "minecraft:entity/wolf/wolf_woods_tame",
          },
          {
            type: "string",
            name: "wild",
            value: "minecraft:entity/wolf/wolf_woods",
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
                  { type: "string", name: "type", value: "minecraft:biome" },
                  { type: "string", name: "biomes", value: "minecraft:forest" },
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
