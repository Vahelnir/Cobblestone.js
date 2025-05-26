import { deepStrictEqual } from "node:assert";
import { readFile } from "node:fs/promises";
import { it } from "node:test";

import { NBTTag, parseNBT } from "../src";

it("should pass hello_world.nbt", async () => {
  const nbtBuffer = await readFile("test/hello_world.nbt");

  const { tags } = await parseNBT(nbtBuffer);

  deepStrictEqual(tags, {
    type: "compound",
    name: "hello world",
    value: [{ type: "string", name: "name", value: "Bananrama" }],
  } satisfies NBTTag);
});
