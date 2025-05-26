import { writeFile } from "fs/promises";
import { parseNBT, writeNBT } from "@cobblestonejs/nbt";

import { defineProtocolType } from "../protocol-type.js";

export const nbt = defineProtocolType<any>(() => ({
  write: async (buffer, value) => {
    const nbtBuffer = writeNBT(value, { network: true });
    buffer.writeBytes(nbtBuffer);
  },
  read: async (buffer) => {
    const nbtBuffer = buffer.buffer.subarray(buffer.position);
    const { tags, endCursor: size } = await parseNBT(nbtBuffer, {
      network: true,
    });

    buffer.position += size;
    return tags;
  },
  typegen: () => ({
    type: "NBTTag",
    imports: ['import { type NBTTag } from "@cobblestonejs/nbt"'],
  }),
}));
