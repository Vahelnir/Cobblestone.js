import { parse, writeUncompressed } from "prismarine-nbt";

import { defineProtocolType } from "../protocol-type.js";

export const nbt = defineProtocolType<any>(() => ({
  write: async (buffer, value) => {
    const nbtBuffer = writeUncompressed(value);
    buffer.writeShort(nbtBuffer.byteLength);
    buffer.writeBytes(nbtBuffer);
  },
  read: async (buffer) => {
    const length = buffer.readVarInt();
    const nbtBuffer = buffer.readBytes(length);
    const { parsed } = await parse(nbtBuffer);
    return parsed;
  },
  typegen: () => ({
    type: "NBT",
    declarations: ["type NBT = any"],
  }),
}));
