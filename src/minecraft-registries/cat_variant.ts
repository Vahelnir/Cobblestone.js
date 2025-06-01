import type { NBTCompoundTag } from "../../packages/nbt/src/tags.js";

export default {
  all_black: {
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
          },
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
                    value: [{ type: "float", name: "min", value: 0.9 }],
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
  black: {
    type: "compound",
    name: "",
    value: [
      { type: "string", name: "asset_id", value: "minecraft:entity/cat/black" },
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
  british_shorthair: {
    type: "compound",
    name: "",
    value: [
      {
        type: "string",
        name: "asset_id",
        value: "minecraft:entity/cat/british_shorthair",
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
  calico: {
    type: "compound",
    name: "",
    value: [
      {
        type: "string",
        name: "asset_id",
        value: "minecraft:entity/cat/calico",
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
  jellie: {
    type: "compound",
    name: "",
    value: [
      {
        type: "string",
        name: "asset_id",
        value: "minecraft:entity/cat/jellie",
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
  persian: {
    type: "compound",
    name: "",
    value: [
      {
        type: "string",
        name: "asset_id",
        value: "minecraft:entity/cat/persian",
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
  ragdoll: {
    type: "compound",
    name: "",
    value: [
      {
        type: "string",
        name: "asset_id",
        value: "minecraft:entity/cat/ragdoll",
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
  red: {
    type: "compound",
    name: "",
    value: [
      { type: "string", name: "asset_id", value: "minecraft:entity/cat/red" },
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
  siamese: {
    type: "compound",
    name: "",
    value: [
      {
        type: "string",
        name: "asset_id",
        value: "minecraft:entity/cat/siamese",
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
  tabby: {
    type: "compound",
    name: "",
    value: [
      { type: "string", name: "asset_id", value: "minecraft:entity/cat/tabby" },
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
  white: {
    type: "compound",
    name: "",
    value: [
      { type: "string", name: "asset_id", value: "minecraft:entity/cat/white" },
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
} as Record<string, NBTCompoundTag>;
