import { CustomBuffer } from "../../buffer/src/custom-buffer.js";

type NamelessNBTTag = Omit<NBTTag, "name">;

type NBTTag =
  | {
      type: "end";
    }
  | { type: "byte"; name: string; value: number }
  | { type: "short"; name: string; value: number }
  | { type: "int"; name: string; value: number }
  | { type: "long"; name: string; value: bigint }
  | { type: "float"; name: string; value: number }
  | { type: "double"; name: string; value: number }
  | { type: "byte_array"; name: string; value: Buffer }
  | { type: "string"; name: string; value: string }
  | { type: "list"; name: string; value: NamelessNBTTag[] }
  | { type: "compound"; name: string; value: NBTTag[] }
  | { type: "int_array"; name: string; value: number[] }
  | { type: "long_array"; name: string; value: bigint[] };

type ParsingState = {
  buffer: Buffer;
  cursor: number;
};

const TYPES: Partial<
  Record<
    number,
    {
      type: string;
      read: (state: ParsingState, options: { nameless: boolean }) => NBTTag;
    }
  >
> = {
  0: {
    type: "end",
    read(state) {
      return { type: "end" };
    },
  },
  1: {
    type: "byte",
    read(state, { nameless }) {
      const name = nameless ? "" : readString(state);
      const value = state.buffer.readInt8(state.cursor);
      state.cursor += 1;

      return {
        type: "byte",
        name,
        value,
      };
    },
  },
  2: {
    type: "short",
    read(state, { nameless }) {
      const name = nameless ? "" : readString(state);
      const value = state.buffer.readInt16BE(state.cursor);
      state.cursor += 2;

      return {
        type: "short",
        name,
        value,
      };
    },
  },
  3: {
    type: "int",
    read(state, { nameless }) {
      const name = nameless ? "" : readString(state);
      const value = state.buffer.readInt32BE(state.cursor);
      state.cursor += 4;
      return {
        type: "int",
        name,
        value,
      };
    },
  },
  4: {
    type: "long",
    read(state, { nameless }) {
      const name = nameless ? "" : readString(state);
      const value = BigInt(
        state.buffer.readBigInt64BE(state.cursor).toString(10),
      );
      state.cursor += 8;
      return { type: "long", name, value };
    },
  },
  5: {
    type: "float",
    read(state, { nameless }) {
      const name = nameless ? "" : readString(state);
      const value = state.buffer.readFloatBE(state.cursor);
      state.cursor += 4;
      return { type: "float", name, value };
    },
  },
  6: {
    type: "double",
    read(state, { nameless }) {
      const name = nameless ? "" : readString(state);
      const value = state.buffer.readDoubleBE(state.cursor);
      state.cursor += 8;
      return { type: "double", name, value };
    },
  },
  7: {
    type: "byte_array",
    read(state, { nameless }) {
      const name = nameless ? "" : readString(state);
      const length = state.buffer.readInt32BE(state.cursor);
      state.cursor += 4;

      const value = state.buffer.subarray(state.cursor, state.cursor + length);
      state.cursor += length;
      return {
        type: "byte_array",
        name,
        value,
      };
    },
  },
  8: {
    type: "string",
    read(state, { nameless }) {
      const name = nameless ? "" : readString(state);
      const value = readString(state);
      return {
        type: "string",
        name,
        value,
      };
    },
  },
  9: {
    type: "list",
    read(state) {
      const name = readString(state);

      const tagTypeId = state.buffer.readInt8(state.cursor);
      state.cursor += 1;
      const tagType = TYPES[tagTypeId];
      if (!tagType) {
        throw new Error(`Unknown NBT list type ID: ${tagTypeId}`);
      }

      const length = state.buffer.readInt32BE(state.cursor);
      state.cursor += 4;

      const tags: NamelessNBTTag[] = [];
      for (let i = 0; i < length; i++) {
        const tag = tagType.read(state, { nameless: true });
        tags.push(tag);
      }
      return { type: "list", name, value: tags };
    },
  },
  10: {
    type: "compound",
    read(state, { nameless }) {
      const name = nameless ? "" : readString(state);
      const tags: NBTTag[] = [];
      while (state.cursor < state.buffer.length) {
        const tag = parse(state);
        if (tag.type === "end") {
          break; // End of NBT data
        }

        tags.push(tag);
      }
      return { type: "compound", name, value: tags };
    },
  },
  11: {
    type: "int_array",
    read(state, { nameless }) {
      const name = nameless ? "" : readString(state);
      const length = state.buffer.readInt32BE(state.cursor);
      state.cursor += 4;

      const value: number[] = [];
      for (let i = 0; i < length; i++) {
        value.push(state.buffer.readInt32BE(state.cursor));
        state.cursor += 4;
      }
      return { type: "int_array", name, value };
    },
  },
  12: {
    type: "long_array",
    read(state, { nameless }) {
      const name = nameless ? "" : readString(state);
      const length = state.buffer.readInt32BE(state.cursor);
      state.cursor += 4;

      const value: bigint[] = [];
      for (let i = 0; i < length; i++) {
        value.push(state.buffer.readBigInt64BE(state.cursor));
        state.cursor += 8;
      }
      return { type: "long_array", name, value };
    },
  },
};

function readString(state: ParsingState): string {
  const nameLength = state.buffer.readUInt16BE(state.cursor);
  state.cursor += 2;

  const nameBuffer = state.buffer.subarray(
    state.cursor,
    state.cursor + nameLength,
  );
  state.cursor += nameLength;
  const name = nameBuffer.toString("utf-8");

  return name;
}

function parse(state: ParsingState): NBTTag {
  const typeId = state.buffer.readInt8(state.cursor);
  state.cursor += 1;

  const type = TYPES[typeId];
  if (!type) {
    throw new Error(`Unknown NBT type ID: ${typeId}`);
  }
  const tag = type.read(state, { nameless: false });
  return tag;
}

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
