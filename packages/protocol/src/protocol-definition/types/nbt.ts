import { writeFile } from "fs/promises";
import { start } from "repl";
import { parseNBT, serializeNBT } from "@cobblestonejs/nbt";

import { defineProtocolType } from "../protocol-type.js";

export const nbt = defineProtocolType<any>(() => ({
  write: async (buffer, value) => {
    const nbtBuffer = serializeNBT(value, { network: true });
    buffer.writeBytes(nbtBuffer);
    console.log("writing nbt of length", nbtBuffer.length, buffer.length);
  },
  read: async (buffer) => {
    const nbtBuffer = buffer.buffer.subarray(buffer.position);
    console.log(nbtBuffer);
    await writeFile("test.nbt", nbtBuffer);
    const { tags, endCursor: size } = await parseNBT(nbtBuffer, {
      network: true,
    });
    console.log("Reading NBT of length", size);
    buffer.position += size;
    return tags;
  },
  typegen: () => ({
    type: "NBTTag",
    imports: ['import { type NBTTag } from "@cobblestonejs/nbt"'],
  }),
}));
