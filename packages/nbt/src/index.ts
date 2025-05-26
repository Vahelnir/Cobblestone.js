import { parse, writeTag } from "./parsing.js";
import { type NBTTag } from "./tags.js";

export async function parseNBT(buffer: Buffer): Promise<NBTTag> {
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

  return parse({
    buffer,
    cursor: 0,
  });
}

export function serializeNBT(tag: NBTTag): Buffer {
  return writeTag(tag);
}

export * from "./tags.js";
export * from "./compression.js";
