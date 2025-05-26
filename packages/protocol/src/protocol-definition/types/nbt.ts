import { parseNBT, serializeNBT } from "@cobblestonejs/nbt";

import { defineProtocolType } from "../protocol-type.js";

export const nbt = defineProtocolType<any>(() => ({
  write: async (buffer, value) => {
    const nbtBuffer = serializeNBT(value);
    buffer.writeVarInt(nbtBuffer.length);
    buffer.writeBytes(nbtBuffer);
    console.log(nbtBuffer.length, buffer.length);
  },
  read: async (buffer) => {
    const length = buffer.readVarInt();
    console.log("Reading NBT of length", length);
    const nbtBuffer = buffer.readBytes(length);
    const tags = await parseNBT(nbtBuffer);
    return tags;
  },
  typegen: () => ({
    type: "NBTTag",
    imports: ['import { type NBTTag } from "@cobblestonejs/nbt"'],
  }),
}));
