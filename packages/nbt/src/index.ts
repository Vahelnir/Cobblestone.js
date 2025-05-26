import { isGzip, uncompressGzip } from "./compression.js";
import { parse, writeTag } from "./parsing.js";
import { type NBTCompoundTag, type NBTTag } from "./tags.js";

export async function parseNBT(
  buffer: Buffer,
  options: { network: boolean } = { network: false },
): Promise<{ tags: NBTTag; endCursor: number }> {
  if (isGzip(buffer)) {
    buffer = await uncompressGzip(buffer);
  }

  const state = {
    buffer,
    cursor: 0,
  };

  return {
    tags: parse(state, { nameless: options.network }),
    endCursor: state.cursor,
  };
}

export function writeNBT(
  tag: NBTTag,
  options: { network: boolean } = { network: false },
): Buffer {
  return writeTag(tag, {
    nameless: options.network,
  });
}

export * from "./tags.js";
export * from "./compression.js";
