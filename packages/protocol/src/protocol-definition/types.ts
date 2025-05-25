import { CustomBuffer } from "../custom-buffer.js";
import { defineProtocolType } from "./protocol-type.js";
import type { ProtocolType } from "./protocol.js";

export const byteArray = defineProtocolType<Buffer, { length?: number }>(
  ({ length }) => ({
    write: async (buffer, value) => buffer.writeBytes(value, length),
    read: async (buffer) => buffer.readBytes(length),
    typegen: () => ({
      type: "ByteArray",
      declarations: ["type ByteArray = Buffer"],
    }),
  }),
);

export const prefixedByteArray = defineProtocolType<Buffer>(() => ({
  write: async (buffer, value) => {
    buffer.writeVarInt(value.length);
    buffer.writeBytes(value);
  },
  read: async (buffer) => {
    const length = buffer.readVarInt();
    return buffer.readBytes(length);
  },
  typegen: () => ({
    type: "Buffer",
  }),
}));

export const byte = defineProtocolType<number>(() => ({
  write: async (buffer, value) => buffer.writeByte(value),
  read: async (buffer) => buffer.readByte(),
  typegen: () => ({
    type: "number",
  }),
}));

export const ubyte = defineProtocolType<number>(() => ({
  write: async (buffer, value) => buffer.writeUnsignedByte(value),
  read: async (buffer) => buffer.readUnsignedByte(),
  typegen: () => ({
    type: "number",
  }),
}));

export const boolean = defineProtocolType<boolean>(() => ({
  write: async (buffer, value) => buffer.writeBoolean(value),
  read: async (buffer) => buffer.readBoolean(),
  typegen: () => ({
    type: "boolean",
  }),
}));

export const short = defineProtocolType<number>(() => ({
  write: async (buffer, value) => buffer.writeShort(value),
  read: async (buffer) => buffer.readShort(),
  typegen: () => ({
    type: "number",
  }),
}));

export const ushort = defineProtocolType<number>(() => ({
  write: async (buffer, value) => buffer.writeUnsignedShort(value),
  read: async (buffer) => buffer.readUnsignedShort(),
  typegen: () => ({
    type: "number",
  }),
}));

export const long = defineProtocolType<bigint>(() => ({
  write: async (buffer, value) => buffer.writeLong(value),
  read: async (buffer) => buffer.readLong(),
  typegen: () => ({
    type: "bigint",
  }),
}));

export const varint = defineProtocolType<number>(() => ({
  write: async (buffer, value) => buffer.writeVarInt(value),
  read: async (buffer) => buffer.readVarInt(),
  typegen: () => ({
    type: "number",
  }),
}));

export const varlong = defineProtocolType<bigint>(() => ({
  write: async (buffer, value) => buffer.writeVarLong(value),
  read: async (buffer) => buffer.readVarLong(),
  typegen: () => ({
    type: "bigint",
  }),
}));

export const string = defineProtocolType<string>(() => ({
  write: async (buffer, value) => buffer.writeString(value),
  read: async (buffer) => buffer.readString(),
  typegen: () => ({
    type: "string",
  }),
}));

export const optional = defineProtocolType<
  unknown | undefined,
  { type: ProtocolType<unknown> }
>(({ type }) => ({
  write: async (buffer, value) => {
    const isPresent = value !== undefined;
    buffer.writeBoolean(isPresent);
    if (isPresent) {
      type.write(buffer, value);
    }
  },
  read: async (buffer) => {
    const isPresent = buffer.readBoolean();
    if (!isPresent) {
      return undefined;
    }

    return type.read(buffer);
  },
  typegen: async () => {
    const rawTypegen = type.typegen?.();
    const typegen =
      rawTypegen instanceof Promise ? await rawTypegen : rawTypegen;

    return {
      type: `(${typegen?.type ?? "unknown"}) | undefined`,
      declarations: typegen?.declarations ?? [],
    };
  },
}));

export const prefixedArray = defineProtocolType<
  unknown[],
  { type: ProtocolType<unknown>; elementSize: number }
>(({ elementSize, type }) => ({
  read: async (buffer) => {
    const size = buffer.readVarInt();
    if (size % elementSize !== 0) {
      throw new Error(
        `Invalid array size: ${size} is not a multiple of element size ${elementSize}`,
      );
    }

    const data: unknown[] = [];
    for (let i = 0; i < size; i += elementSize) {
      data.push(await type.read(buffer));
    }

    return data;
  },
  write: async (buffer, value) => {
    buffer.writeVarInt(value.length * elementSize);

    for (const item of value) {
      await type.write(buffer, item);
    }
  },
  typegen: async () => {
    const rawTypegen = type.typegen?.();
    const typegen =
      rawTypegen instanceof Promise ? await rawTypegen : rawTypegen;

    return {
      type: `(${typegen?.type ?? "unknown"})[]`,
      declarations: typegen?.declarations ?? [],
    };
  },
}));

// NOTE: see if the order of the keys is as expected
export const object = defineProtocolType<
  Record<string, unknown>,
  Record<string, ProtocolType<unknown>>
>((obj) => {
  return {
    write: async (buffer, value) => {
      for (const [key, type] of Object.entries(obj)) {
        await type.write(buffer, value[key]);
      }
    },
    read: async (buffer) => {
      const result: Record<string, unknown> = {};
      for (const [key, type] of Object.entries(obj)) {
        result[key] = await type.read(buffer);
      }
      return result;
    },
    typegen: async () => {
      const properties: string[] = [];
      const declarations = new Set<string>();
      for (const [key, protocolType] of Object.entries(obj)) {
        const rawTypegen = protocolType.typegen?.();
        const typegen =
          rawTypegen instanceof Promise ? await rawTypegen : rawTypegen;
        const type = typegen?.type ?? "unknown";
        if (typegen?.declarations) {
          typegen.declarations.forEach((declaration) =>
            declarations.add(declaration),
          );
        }

        properties.push(`${key}: ${type}`);
      }

      return {
        type: `{ ${properties} }`,
        declarations: [...declarations],
      };
    },
  };
});

export * from "./types/json.js";
export * from "./types/uuid.js";
export * from "./types/jsonTextComponent.js";
export * from "./types/identifier.js";
