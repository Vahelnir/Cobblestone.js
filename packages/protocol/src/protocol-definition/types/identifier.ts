import { defineProtocolType } from "../protocol-type.js";

export const identifier = defineProtocolType<string>(() => ({
  write: async (buffer, value) => buffer.writeString(value),
  read: async (buffer) => buffer.readString(),
  typegen: () => ({
    type: "Identifier",
    declarations: ["type Identifier = string"],
  }),
}));
