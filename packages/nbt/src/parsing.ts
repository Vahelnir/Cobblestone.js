import type {
  NamelessNBTTag,
  NBTByteArrayTag,
  NBTByteTag,
  NBTCompoundTag,
  NBTDoubleTag,
  NBTFloatTag,
  NBTIntArrayTag,
  NBTIntTag,
  NBTListTag,
  NBTLongArrayTag,
  NBTLongTag,
  NBTShortTag,
  NBTStringTag,
  NBTTag,
} from "./tags.js";

type ParsingState = {
  buffer: Buffer;
  cursor: number;
};

const TYPES: Partial<
  Record<
    number,
    {
      type: NBTTag["type"];
      read: (state: ParsingState) => unknown;
      write: (tag: any) => Buffer;
    }
  >
> = {
  0: {
    type: "end",
    read() {},
    write: () => Buffer.alloc(0),
  },
  1: {
    type: "byte",
    read(state) {
      const value = state.buffer.readInt8(state.cursor);
      state.cursor += 1;
      return value;
    },
    write(tag: NBTByteTag) {
      const buf = Buffer.alloc(1);
      buf.writeInt8(tag.value, 0);
      return buf;
    },
  },
  2: {
    type: "short",
    read(state) {
      const value = state.buffer.readInt16BE(state.cursor);
      state.cursor += 2;
      return value;
    },
    write(tag: NBTShortTag) {
      const buf = Buffer.alloc(2);
      buf.writeInt16BE(tag.value, 0);
      return buf;
    },
  },
  3: {
    type: "int",
    read(state) {
      const value = state.buffer.readInt32BE(state.cursor);
      state.cursor += 4;
      return value;
    },
    write(tag: NBTIntTag) {
      const buf = Buffer.alloc(4);
      buf.writeInt32BE(tag.value, 0);
      return buf;
    },
  },
  4: {
    type: "long",
    read(state) {
      const value = BigInt(
        state.buffer.readBigInt64BE(state.cursor).toString(10),
      );
      state.cursor += 8;
      return value;
    },
    write(tag: NBTLongTag) {
      const buf = Buffer.alloc(8);
      buf.writeBigInt64BE(tag.value, 0);
      return buf;
    },
  },
  5: {
    type: "float",
    read(state) {
      const value = state.buffer.readFloatBE(state.cursor);
      state.cursor += 4;
      return value;
    },
    write(tag: NBTFloatTag) {
      const buf = Buffer.alloc(4);
      buf.writeFloatBE(tag.value, 0);
      return buf;
    },
  },
  6: {
    type: "double",
    read(state) {
      const value = state.buffer.readDoubleBE(state.cursor);
      state.cursor += 8;
      return value;
    },
    write(tag: NBTDoubleTag) {
      const buf = Buffer.alloc(8);
      buf.writeDoubleBE(tag.value, 0);
      return buf;
    },
  },
  7: {
    type: "byte_array",
    read(state) {
      const length = state.buffer.readInt32BE(state.cursor);
      state.cursor += 4;
      const value = state.buffer.subarray(state.cursor, state.cursor + length);
      state.cursor += length;
      return value;
    },
    write(tag: NBTByteArrayTag) {
      const value = tag.value;
      const lenBuf = Buffer.alloc(4);
      lenBuf.writeInt32BE(value.length, 0);
      return Buffer.concat([lenBuf, value]);
    },
  },
  8: {
    type: "string",
    read(state) {
      return readString(state);
    },
    write(tag: NBTStringTag) {
      return writeString(tag.value);
    },
  },
  9: {
    type: "list",
    read(state) {
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
        const tag = parse(state, {
          nameless: true,
          type: tagType,
        });
        tags.push(tag);
      }
      return tags;
    },
    write(tag: NBTListTag) {
      const out: Buffer[] = [];
      let elemTypeId = 0;
      if (tag.value.length > 0) {
        elemTypeId = getTypeId(tag.value[0].type);
      }
      out.push(Buffer.from([elemTypeId]));
      const lenBuf = Buffer.alloc(4);
      lenBuf.writeInt32BE(tag.value.length, 0);
      out.push(lenBuf);
      for (const elem of tag.value) {
        const elemTag = { ...elem, name: "" } as NBTTag;
        const writer = TYPES[elemTypeId]?.write;
        if (!writer) throw new Error(`No writer for type id ${elemTypeId}`);
        out.push(writer(elemTag));
      }
      return Buffer.concat(out);
    },
  },
  10: {
    type: "compound",
    read(state) {
      const tags: NBTTag[] = [];
      while (state.cursor < state.buffer.length) {
        const tag = parse(state);
        if (tag.type === "end") {
          break;
        }
        tags.push(tag);
      }
      return tags;
    },
    write(tag: NBTCompoundTag) {
      const compoundTag = tag;
      const out: Buffer[] = [];
      for (const child of compoundTag.value) {
        out.push(writeTag(child));
      }
      out.push(Buffer.from([0]));
      return Buffer.concat(out);
    },
  },
  11: {
    type: "int_array",
    read(state) {
      const length = state.buffer.readInt32BE(state.cursor);
      state.cursor += 4;
      const value: number[] = [];
      for (let i = 0; i < length; i++) {
        value.push(state.buffer.readInt32BE(state.cursor));
        state.cursor += 4;
      }
      return value;
    },
    write(tag: NBTIntArrayTag) {
      const arr = tag.value;
      const lenBuf = Buffer.alloc(4);
      lenBuf.writeInt32BE(arr.length, 0);
      const bufs = [lenBuf];
      for (const value of arr) {
        const buf = Buffer.alloc(4);
        buf.writeInt32BE(value, 0);
        bufs.push(buf);
      }
      return Buffer.concat(bufs);
    },
  },
  12: {
    type: "long_array",
    read(state) {
      const length = state.buffer.readInt32BE(state.cursor);
      state.cursor += 4;
      const value: bigint[] = [];
      for (let i = 0; i < length; i++) {
        value.push(state.buffer.readBigInt64BE(state.cursor));
        state.cursor += 8;
      }
      return value;
    },
    write(tag: NBTLongArrayTag) {
      const arr = tag.value as bigint[];
      const lenBuf = Buffer.alloc(4);
      lenBuf.writeInt32BE(arr.length, 0);
      const bufs = [lenBuf];
      for (const value of arr) {
        const buf = Buffer.alloc(8);
        buf.writeBigInt64BE(value, 0);
        bufs.push(buf);
      }
      return Buffer.concat(bufs);
    },
  },
};

// Helper to get type id from type name
function getTypeId(type: NBTTag["type"]): number {
  for (const [id, entry] of Object.entries(TYPES)) {
    if (entry && entry.type === type) return Number(id);
  }
  throw new Error(`Unknown NBT type: ${type}`);
}

// Write string helper
function writeString(str: string): Buffer {
  const strBuf = Buffer.from(str, "utf-8");
  const lenBuf = Buffer.alloc(2);
  lenBuf.writeUInt16BE(strBuf.length, 0);
  return Buffer.concat([lenBuf, strBuf]);
}

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

export function writeTag(
  tag: NBTTag,
  { nameless = false }: { nameless?: boolean; network?: boolean } = {},
): Buffer {
  if (tag.type === "end") {
    return Buffer.from([0]);
  }

  const typeId = getTypeId(tag.type);
  const out: Buffer[] = [];
  out.push(Buffer.from([typeId]));
  if (!nameless) {
    out.push(writeString(tag.name ?? ""));
  }

  const type = TYPES[typeId];
  if (!type) throw new Error(`No writer for type id ${typeId}`);
  if (type.type !== tag.type)
    throw new Error(`Type mismatch: expected ${type.type}, got ${tag.type}`);

  out.push(type.write(tag));
  return Buffer.concat(out);
}

export function parse(
  state: ParsingState,
  {
    nameless,
    type,
  }: { nameless?: boolean; type?: (typeof TYPES)[number] } = {},
): NBTTag {
  if (type === undefined) {
    const typeId = state.buffer.readInt8(state.cursor);
    state.cursor += 1;

    const extractedType = TYPES[typeId];
    if (!extractedType) {
      throw new Error(`Unknown NBT type ID: ${typeId}`);
    }

    type = extractedType;
  }

  if (type.type === "end") {
    return { type: "end" };
  }

  let name = "";
  if (!nameless) {
    name = readString(state);
  }

  // TODO: try to better type everything later
  const value = type.read(state) as any;
  return { value, type: type.type, name };
}
