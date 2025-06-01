import type { NBTCompoundTag } from "../../packages/nbt/src/tags.js";

export default {
  plains: {
    type: "compound",
    name: "",
    value: [
      {
        type: "list",
        name: "carvers",
        value: [
          { type: "string", name: "", value: "minecraft:cave" },
          {
            type: "string",
            name: "",
            value: "minecraft:cave_extra_underground",
          },
          { type: "string", name: "", value: "minecraft:canyon" },
        ],
      },
      { type: "float", name: "downfall", value: 0.4 },
      {
        type: "compound",
        name: "effects",
        value: [
          { type: "int", name: "fog_color", value: 12638463 },
          {
            type: "compound",
            name: "mood_sound",
            value: [
              { type: "int", name: "block_search_extent", value: 8 },
              { type: "int", name: "offset", value: 2 },
              {
                type: "string",
                name: "sound",
                value: "minecraft:ambient.cave",
              },
              { type: "int", name: "tick_delay", value: 6000 },
            ],
          },
          { type: "float", name: "music_volume", value: 1 },
          { type: "int", name: "sky_color", value: 7907327 },
          { type: "int", name: "water_color", value: 4159204 },
          { type: "int", name: "water_fog_color", value: 329011 },
        ],
      },
      {
        type: "list",
        name: "features",
        value: [
          { type: "list", name: "", value: [] },
          {
            type: "list",
            name: "",
            value: [
              {
                type: "string",
                name: "",
                value: "minecraft:lake_lava_underground",
              },
              {
                type: "string",
                name: "",
                value: "minecraft:lake_lava_surface",
              },
            ],
          },
          {
            type: "list",
            name: "",
            value: [
              { type: "string", name: "", value: "minecraft:amethyst_geode" },
            ],
          },
          {
            type: "list",
            name: "",
            value: [
              { type: "string", name: "", value: "minecraft:monster_room" },
              {
                type: "string",
                name: "",
                value: "minecraft:monster_room_deep",
              },
            ],
          },
          { type: "list", name: "", value: [] },
          { type: "list", name: "", value: [] },
          {
            type: "list",
            name: "",
            value: [
              { type: "string", name: "", value: "minecraft:ore_dirt" },
              { type: "string", name: "", value: "minecraft:ore_gravel" },
              {
                type: "string",
                name: "",
                value: "minecraft:ore_granite_upper",
              },
              {
                type: "string",
                name: "",
                value: "minecraft:ore_granite_lower",
              },
              {
                type: "string",
                name: "",
                value: "minecraft:ore_diorite_upper",
              },
              {
                type: "string",
                name: "",
                value: "minecraft:ore_diorite_lower",
              },
              {
                type: "string",
                name: "",
                value: "minecraft:ore_andesite_upper",
              },
              {
                type: "string",
                name: "",
                value: "minecraft:ore_andesite_lower",
              },
              { type: "string", name: "", value: "minecraft:ore_tuff" },
              { type: "string", name: "", value: "minecraft:ore_coal_upper" },
              { type: "string", name: "", value: "minecraft:ore_coal_lower" },
              { type: "string", name: "", value: "minecraft:ore_iron_upper" },
              { type: "string", name: "", value: "minecraft:ore_iron_middle" },
              { type: "string", name: "", value: "minecraft:ore_iron_small" },
              { type: "string", name: "", value: "minecraft:ore_gold" },
              { type: "string", name: "", value: "minecraft:ore_gold_lower" },
              { type: "string", name: "", value: "minecraft:ore_redstone" },
              {
                type: "string",
                name: "",
                value: "minecraft:ore_redstone_lower",
              },
              { type: "string", name: "", value: "minecraft:ore_diamond" },
              {
                type: "string",
                name: "",
                value: "minecraft:ore_diamond_medium",
              },
              {
                type: "string",
                name: "",
                value: "minecraft:ore_diamond_large",
              },
              {
                type: "string",
                name: "",
                value: "minecraft:ore_diamond_buried",
              },
              { type: "string", name: "", value: "minecraft:ore_lapis" },
              { type: "string", name: "", value: "minecraft:ore_lapis_buried" },
              { type: "string", name: "", value: "minecraft:ore_copper" },
              { type: "string", name: "", value: "minecraft:underwater_magma" },
              { type: "string", name: "", value: "minecraft:disk_sand" },
              { type: "string", name: "", value: "minecraft:disk_clay" },
              { type: "string", name: "", value: "minecraft:disk_gravel" },
            ],
          },
          { type: "list", name: "", value: [] },
          {
            type: "list",
            name: "",
            value: [
              { type: "string", name: "", value: "minecraft:spring_water" },
              { type: "string", name: "", value: "minecraft:spring_lava" },
            ],
          },
          {
            type: "list",
            name: "",
            value: [
              { type: "string", name: "", value: "minecraft:glow_lichen" },
              {
                type: "string",
                name: "",
                value: "minecraft:patch_tall_grass_2",
              },
              { type: "string", name: "", value: "minecraft:patch_bush" },
              { type: "string", name: "", value: "minecraft:trees_plains" },
              { type: "string", name: "", value: "minecraft:flower_plains" },
              {
                type: "string",
                name: "",
                value: "minecraft:patch_grass_plain",
              },
              {
                type: "string",
                name: "",
                value: "minecraft:brown_mushroom_normal",
              },
              {
                type: "string",
                name: "",
                value: "minecraft:red_mushroom_normal",
              },
              { type: "string", name: "", value: "minecraft:patch_pumpkin" },
              { type: "string", name: "", value: "minecraft:patch_sugar_cane" },
              {
                type: "string",
                name: "",
                value: "minecraft:patch_firefly_bush_near_water",
              },
            ],
          },
          {
            type: "list",
            name: "",
            value: [
              { type: "string", name: "", value: "minecraft:freeze_top_layer" },
            ],
          },
        ],
      },
      { type: "byte", name: "has_precipitation", value: 1 },
      { type: "compound", name: "spawn_costs", value: [] },
      {
        type: "compound",
        name: "spawners",
        value: [
          {
            type: "list",
            name: "ambient",
            value: [
              {
                type: "compound",
                name: "",
                value: [
                  { type: "string", name: "type", value: "minecraft:bat" },
                  { type: "int", name: "maxCount", value: 8 },
                  { type: "int", name: "minCount", value: 8 },
                  { type: "int", name: "weight", value: 10 },
                ],
              },
            ],
          },
          { type: "list", name: "axolotls", value: [] },
          {
            type: "list",
            name: "creature",
            value: [
              {
                type: "compound",
                name: "",
                value: [
                  { type: "string", name: "type", value: "minecraft:sheep" },
                  { type: "int", name: "maxCount", value: 4 },
                  { type: "int", name: "minCount", value: 4 },
                  { type: "int", name: "weight", value: 12 },
                ],
              },
              {
                type: "compound",
                name: "",
                value: [
                  { type: "string", name: "type", value: "minecraft:pig" },
                  { type: "int", name: "maxCount", value: 4 },
                  { type: "int", name: "minCount", value: 4 },
                  { type: "int", name: "weight", value: 10 },
                ],
              },
              {
                type: "compound",
                name: "",
                value: [
                  { type: "string", name: "type", value: "minecraft:chicken" },
                  { type: "int", name: "maxCount", value: 4 },
                  { type: "int", name: "minCount", value: 4 },
                  { type: "int", name: "weight", value: 10 },
                ],
              },
              {
                type: "compound",
                name: "",
                value: [
                  { type: "string", name: "type", value: "minecraft:cow" },
                  { type: "int", name: "maxCount", value: 4 },
                  { type: "int", name: "minCount", value: 4 },
                  { type: "int", name: "weight", value: 8 },
                ],
              },
              {
                type: "compound",
                name: "",
                value: [
                  { type: "string", name: "type", value: "minecraft:horse" },
                  { type: "int", name: "maxCount", value: 6 },
                  { type: "int", name: "minCount", value: 2 },
                  { type: "int", name: "weight", value: 5 },
                ],
              },
              {
                type: "compound",
                name: "",
                value: [
                  { type: "string", name: "type", value: "minecraft:donkey" },
                  { type: "int", name: "maxCount", value: 3 },
                  { type: "int", name: "minCount", value: 1 },
                  { type: "int", name: "weight", value: 1 },
                ],
              },
            ],
          },
          { type: "list", name: "misc", value: [] },
          {
            type: "list",
            name: "monster",
            value: [
              {
                type: "compound",
                name: "",
                value: [
                  { type: "string", name: "type", value: "minecraft:spider" },
                  { type: "int", name: "maxCount", value: 4 },
                  { type: "int", name: "minCount", value: 4 },
                  { type: "int", name: "weight", value: 100 },
                ],
              },
              {
                type: "compound",
                name: "",
                value: [
                  { type: "string", name: "type", value: "minecraft:zombie" },
                  { type: "int", name: "maxCount", value: 4 },
                  { type: "int", name: "minCount", value: 4 },
                  { type: "int", name: "weight", value: 95 },
                ],
              },
              {
                type: "compound",
                name: "",
                value: [
                  {
                    type: "string",
                    name: "type",
                    value: "minecraft:zombie_villager",
                  },
                  { type: "int", name: "maxCount", value: 1 },
                  { type: "int", name: "minCount", value: 1 },
                  { type: "int", name: "weight", value: 5 },
                ],
              },
              {
                type: "compound",
                name: "",
                value: [
                  { type: "string", name: "type", value: "minecraft:skeleton" },
                  { type: "int", name: "maxCount", value: 4 },
                  { type: "int", name: "minCount", value: 4 },
                  { type: "int", name: "weight", value: 100 },
                ],
              },
              {
                type: "compound",
                name: "",
                value: [
                  { type: "string", name: "type", value: "minecraft:creeper" },
                  { type: "int", name: "maxCount", value: 4 },
                  { type: "int", name: "minCount", value: 4 },
                  { type: "int", name: "weight", value: 100 },
                ],
              },
              {
                type: "compound",
                name: "",
                value: [
                  { type: "string", name: "type", value: "minecraft:slime" },
                  { type: "int", name: "maxCount", value: 4 },
                  { type: "int", name: "minCount", value: 4 },
                  { type: "int", name: "weight", value: 100 },
                ],
              },
              {
                type: "compound",
                name: "",
                value: [
                  { type: "string", name: "type", value: "minecraft:enderman" },
                  { type: "int", name: "maxCount", value: 4 },
                  { type: "int", name: "minCount", value: 1 },
                  { type: "int", name: "weight", value: 10 },
                ],
              },
              {
                type: "compound",
                name: "",
                value: [
                  { type: "string", name: "type", value: "minecraft:witch" },
                  { type: "int", name: "maxCount", value: 1 },
                  { type: "int", name: "minCount", value: 1 },
                  { type: "int", name: "weight", value: 5 },
                ],
              },
            ],
          },
          {
            type: "list",
            name: "underground_water_creature",
            value: [
              {
                type: "compound",
                name: "",
                value: [
                  {
                    type: "string",
                    name: "type",
                    value: "minecraft:glow_squid",
                  },
                  { type: "int", name: "maxCount", value: 6 },
                  { type: "int", name: "minCount", value: 4 },
                  { type: "int", name: "weight", value: 10 },
                ],
              },
            ],
          },
          { type: "list", name: "water_ambient", value: [] },
          { type: "list", name: "water_creature", value: [] },
        ],
      },
      { type: "float", name: "temperature", value: 0.8 },
    ],
  },
} as Record<string, NBTCompoundTag>;
