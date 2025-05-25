import { defineProtocolType } from "./protocol-type.js";
import type { ProtocolType } from "./protocol.js";

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

export const string = defineProtocolType<string, { length?: number }>(
  (options) => ({
    write: async (buffer, value) => buffer.writeString(value),
    read: async (buffer) => buffer.readString(),
    typegen: () => ({
      type: "string",
    }),
  }),
);

export const object = defineProtocolType<
  Record<string, unknown>,
  Record<string, ProtocolType<unknown>>
>((obj) => {
  return {
    write: async (buffer, value) => {
      for (const [key, type] of Object.entries(obj)) {
        type.write(buffer, value[key]);
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
