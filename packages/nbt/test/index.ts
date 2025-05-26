import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { parseNBT } from "../src/index.js";

const helloWorld = await readFile(resolve("./test/hello_world.nbt"));
const bigtest = await readFile(resolve("./test/bigtest.nbt"));
const server = await readFile(resolve("./test/servers.dat"));
const level = await readFile(resolve("./test/level.dat"));

const tags = await parseNBT(level);
console.log("Parsed NBT data successfully.");
console.log(tags);
