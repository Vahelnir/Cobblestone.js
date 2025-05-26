import { defineProtocolType } from "../protocol-type.js";

export const identifier = defineProtocolType<string>(() => ({
  write: async (buffer, value) => {
    console.log("Writing identifier:", value);
    buffer.writeString(value);
  },
  read: async (buffer) => {
    const identifier = buffer.readString();
    console.log("Read identifier:", identifier);
    return identifier;
  },
  typegen: () => ({
    type: "Identifier",
    declarations: ["type Identifier = string"],
  }),
}));
