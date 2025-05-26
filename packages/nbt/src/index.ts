import { parse, writeTag } from "./parsing.js";
import { type NBTCompoundTag, type NBTTag } from "./tags.js";

export async function parseNBT(
  buffer: Buffer,
  options: { network: boolean } = { network: false },
): Promise<{ tags: NBTTag; endCursor: number }> {
  const header = buffer.readInt16BE(0);
  if (header === 0x1f8b) {
    // uncompress nbt using DecompressionStream
    const readable = new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(buffer));
        controller.close();
      },
    });
    const ds = new DecompressionStream("gzip");
    const decompressed = await new Response(
      readable.pipeThrough(ds),
    ).arrayBuffer();
    buffer = Buffer.from(decompressed);
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

export function serializeNBT(
  tag: NBTCompoundTag,
  options: { network: boolean } = { network: false },
): Buffer {
  console.log("Serializing NBT tag", tag.type);
  return writeTag(tag, {
    nameless: options.network,
  });
}

export * from "./tags.js";
export * from "./compression.js";
