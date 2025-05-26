import { deepStrictEqual } from "node:assert";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import {
  compressGzip,
  parseNBT,
  serializeNBT,
  uncompressGzip,
} from "../src/index.js";

const helloWorld = await readFile(resolve("./test/hello_world.nbt"));
const bigtest = await readFile(resolve("./test/bigtest.nbt"));
const server = await readFile(resolve("./test/servers.dat"));
const level = await readFile(resolve("./test/level.dat"));

const originalBuffer = bigtest;
const tags = await parseNBT(originalBuffer);
console.log("Parsed NBT data successfully.");
console.log("Serializing parsed data...");
const serialized = await serializeNBT(tags);
const serializedCompressed = await compressGzip(serialized);

const finalTags = await parseNBT(serializedCompressed);
console.log("Serialized NBT data successfully.");

deepStrictEqual(finalTags, tags);
