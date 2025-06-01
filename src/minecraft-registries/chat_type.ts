import type { NBTCompoundTag } from "../../packages/nbt/src/tags.js";

export default {
  chat: {
    type: "compound",
    name: "",
    value: [
      {
        type: "compound",
        name: "chat",
        value: [
          {
            type: "list",
            name: "parameters",
            value: [
              { type: "string", name: "", value: "sender" },
              { type: "string", name: "", value: "content" },
            ],
          },
          { type: "string", name: "translation_key", value: "chat.type.text" },
        ],
      },
      {
        type: "compound",
        name: "narration",
        value: [
          {
            type: "list",
            name: "parameters",
            value: [
              { type: "string", name: "", value: "sender" },
              { type: "string", name: "", value: "content" },
            ],
          },
          {
            type: "string",
            name: "translation_key",
            value: "chat.type.text.narrate",
          },
        ],
      },
    ],
  },
  emote_command: {
    type: "compound",
    name: "",
    value: [
      {
        type: "compound",
        name: "chat",
        value: [
          {
            type: "list",
            name: "parameters",
            value: [
              { type: "string", name: "", value: "sender" },
              { type: "string", name: "", value: "content" },
            ],
          },
          { type: "string", name: "translation_key", value: "chat.type.emote" },
        ],
      },
      {
        type: "compound",
        name: "narration",
        value: [
          {
            type: "list",
            name: "parameters",
            value: [
              { type: "string", name: "", value: "sender" },
              { type: "string", name: "", value: "content" },
            ],
          },
          { type: "string", name: "translation_key", value: "chat.type.emote" },
        ],
      },
    ],
  },
  msg_command_incoming: {
    type: "compound",
    name: "",
    value: [
      {
        type: "compound",
        name: "chat",
        value: [
          {
            type: "list",
            name: "parameters",
            value: [
              { type: "string", name: "", value: "sender" },
              { type: "string", name: "", value: "content" },
            ],
          },
          {
            type: "compound",
            name: "style",
            value: [
              { type: "string", name: "color", value: "gray" },
              { type: "byte", name: "italic", value: 1 },
            ],
          },
          {
            type: "string",
            name: "translation_key",
            value: "commands.message.display.incoming",
          },
        ],
      },
      {
        type: "compound",
        name: "narration",
        value: [
          {
            type: "list",
            name: "parameters",
            value: [
              { type: "string", name: "", value: "sender" },
              { type: "string", name: "", value: "content" },
            ],
          },
          {
            type: "string",
            name: "translation_key",
            value: "chat.type.text.narrate",
          },
        ],
      },
    ],
  },
  msg_command_outgoing: {
    type: "compound",
    name: "",
    value: [
      {
        type: "compound",
        name: "chat",
        value: [
          {
            type: "list",
            name: "parameters",
            value: [
              { type: "string", name: "", value: "target" },
              { type: "string", name: "", value: "content" },
            ],
          },
          {
            type: "compound",
            name: "style",
            value: [
              { type: "string", name: "color", value: "gray" },
              { type: "byte", name: "italic", value: 1 },
            ],
          },
          {
            type: "string",
            name: "translation_key",
            value: "commands.message.display.outgoing",
          },
        ],
      },
      {
        type: "compound",
        name: "narration",
        value: [
          {
            type: "list",
            name: "parameters",
            value: [
              { type: "string", name: "", value: "sender" },
              { type: "string", name: "", value: "content" },
            ],
          },
          {
            type: "string",
            name: "translation_key",
            value: "chat.type.text.narrate",
          },
        ],
      },
    ],
  },
  say_command: {
    type: "compound",
    name: "",
    value: [
      {
        type: "compound",
        name: "chat",
        value: [
          {
            type: "list",
            name: "parameters",
            value: [
              { type: "string", name: "", value: "sender" },
              { type: "string", name: "", value: "content" },
            ],
          },
          {
            type: "string",
            name: "translation_key",
            value: "chat.type.announcement",
          },
        ],
      },
      {
        type: "compound",
        name: "narration",
        value: [
          {
            type: "list",
            name: "parameters",
            value: [
              { type: "string", name: "", value: "sender" },
              { type: "string", name: "", value: "content" },
            ],
          },
          {
            type: "string",
            name: "translation_key",
            value: "chat.type.text.narrate",
          },
        ],
      },
    ],
  },
  team_msg_command_incoming: {
    type: "compound",
    name: "",
    value: [
      {
        type: "compound",
        name: "chat",
        value: [
          {
            type: "list",
            name: "parameters",
            value: [
              { type: "string", name: "", value: "target" },
              { type: "string", name: "", value: "sender" },
              { type: "string", name: "", value: "content" },
            ],
          },
          {
            type: "string",
            name: "translation_key",
            value: "chat.type.team.text",
          },
        ],
      },
      {
        type: "compound",
        name: "narration",
        value: [
          {
            type: "list",
            name: "parameters",
            value: [
              { type: "string", name: "", value: "sender" },
              { type: "string", name: "", value: "content" },
            ],
          },
          {
            type: "string",
            name: "translation_key",
            value: "chat.type.text.narrate",
          },
        ],
      },
    ],
  },
  team_msg_command_outgoing: {
    type: "compound",
    name: "",
    value: [
      {
        type: "compound",
        name: "chat",
        value: [
          {
            type: "list",
            name: "parameters",
            value: [
              { type: "string", name: "", value: "target" },
              { type: "string", name: "", value: "sender" },
              { type: "string", name: "", value: "content" },
            ],
          },
          {
            type: "string",
            name: "translation_key",
            value: "chat.type.team.sent",
          },
        ],
      },
      {
        type: "compound",
        name: "narration",
        value: [
          {
            type: "list",
            name: "parameters",
            value: [
              { type: "string", name: "", value: "sender" },
              { type: "string", name: "", value: "content" },
            ],
          },
          {
            type: "string",
            name: "translation_key",
            value: "chat.type.text.narrate",
          },
        ],
      },
    ],
  },
} as Record<string, NBTCompoundTag>;
