import { defineProtocolType } from "../protocol-type.js";

export const identifier = defineProtocolType<string>(() => ({
  write: async (buffer, value) => {
    buffer.writeString(value);
  },
  read: async (buffer) => {
    const identifier = buffer.readString();
    return identifier;
  },
  typegen: () => ({
    type: "Identifier",
    declarations: ["type Identifier = string"],
  }),
}));
