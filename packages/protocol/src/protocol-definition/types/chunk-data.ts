import type { CustomBuffer } from "@cobblestonejs/buffer";
import type { NBTCompoundTag } from "@cobblestonejs/nbt";

import { defineProtocolType } from "../protocol-type.js";
import type { ProtocolType } from "../protocol.js";
import {
  long,
  nbt,
  object,
  prefixedArray,
  short,
  ubyte,
  varint,
} from "../types.js";
import {
  palettedContainer,
  type PalettedContainer,
} from "./chunk/paletted-container.js";

const heightMap = object({
  type: varint(),
  data: prefixedArray({
    type: long(),
  }),
});

export type PackedXZ = { blockX: number; blockZ: number };
const packedXZ = defineProtocolType<PackedXZ>(() => {
  const baseType = ubyte();
  return {
    write: async (buffer, { blockX, blockZ }) => {
      const packed = ((blockX & 15) << 4) | (blockZ >> 4);
      return baseType.write(buffer, packed);
    },
    read: async (buffer) => {
      const packed = await baseType.read(buffer);
      return {
        blockX: packed >> 4,
        blockZ: packed & 15,
      };
    },
    typegen: () => ({
      type: "PackedXZ",
      declarations: ["type PackedXZ = { blockX: number; blockZ: number }"],
    }),
  };
});

export type ChunkSection = {
  blockCount: number;
  blockStates: PalettedContainer;
  biomes: PalettedContainer;
};
class ChunkSectionType implements ProtocolType<ChunkSection> {
  async write(buffer: CustomBuffer, value: ChunkSection) {
    await this.#type().write(buffer, value);
  }

  read(buffer: CustomBuffer): Promise<ChunkSection> {
    return this.#type().read(buffer) as Promise<ChunkSection>;
  }

  typegen() {
    return {
      type: "ChunkSection[]",
      declarations: [
        `type ChunkSection = {
          blockCount: number;
          blockStates: PalettedContainer;
          biomes: PalettedContainer;
        }`,
      ],
    };
  }

  #type() {
    return object({
      blockCount: short(),
      blockStates: palettedContainer("blocks"),
      biomes: palettedContainer("biome"),
    });
  }
}

export type ChunkData = {
  heightMaps: { type: number; data: bigint[] }[];
  data: Buffer[];
  blockEntities: {
    packedXZ: PackedXZ;
    y: number;
    type: number;
    data: NBTCompoundTag;
  }[];
};
class ChunkDataType implements ProtocolType<ChunkData> {
  async write(buffer: CustomBuffer, value: ChunkData): Promise<void> {
    await this.#type().write(buffer, value);
  }

  async read(buffer: CustomBuffer): Promise<ChunkData> {
    return (await this.#type().read(buffer)) as ChunkData;
  }

  typegen() {
    return {
      type: "ChunkData",
      declarations: [
        `type ChunkData = {
          heightMaps: { type: number; data: bigint[] }[];
          data: Buffer[];
          blockEntities: {
            packedXZ: PackedXZ;
            y: number;
            type: number;
            data: NBTCompoundTag;
          }[];
        }`,
      ],
    };
  }

  #type() {
    return object({
      heightMaps: prefixedArray({ type: heightMap }),
      data: prefixedArray({ type: chunkSection() }),
      blockEntities: prefixedArray({
        type: object({
          packedXZ: packedXZ(),
          y: short(),
          type: varint(),
          data: nbt(),
        }),
      }),
    });
  }
}

export function chunkSection() {
  return new ChunkSectionType();
}

export function chunkData() {
  return new ChunkDataType();
}
