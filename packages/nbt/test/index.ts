import { deepStrictEqual } from "node:assert";
import { readFile, writeFile } from "node:fs/promises";
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

it("should read level_buzze.dat", async () => {
  const file = await readFile("test/level_buzze.dat");
  await parseNBT(file);
});
