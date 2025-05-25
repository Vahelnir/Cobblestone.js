import { defineProtocolType } from "../protocol-type.js";

export const jsonTextComponent = defineProtocolType<string>(() => ({
  write: async (buffer, value) => buffer.writeString(value),
  read: async (buffer) => buffer.readString(),
  typegen: () => ({
    type: "JSONTextComponent",
    declarations: ["type JSONTextComponent = string"],
  }),
}));
