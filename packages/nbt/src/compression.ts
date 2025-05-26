export function isGZIP(buffer: Buffer) {
  return buffer.readInt16BE(0) === 0x1f8b;
}

export async function uncompressGzip(buffer: Buffer): Promise<Buffer> {
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
  return Buffer.from(decompressed);
}

export async function compressGzip(buffer: Buffer): Promise<Buffer> {
  // compress nbt using CompressionStream
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(buffer));
      controller.close();
    },
  });
  const cs = new CompressionStream("gzip");
  const compressed = await new Response(readable.pipeThrough(cs)).arrayBuffer();
  return Buffer.from(compressed);
}
