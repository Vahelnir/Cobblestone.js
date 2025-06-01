import { defineProtocolType } from "../protocol-type.js";
import { object, prefixedArray, prefixedByteArray } from "../types.js";

const LONG_BYTE_SIZE = 8; // 64 bits = 8 bytes

export type BitSet = Buffer;
// TODO: change this to be a BigInt64Array
const bitset = defineProtocolType<BitSet>(() => ({
  write: async (buffer, value) => {
    if (value.length % LONG_BYTE_SIZE !== 0) {
      throw new Error("BitSet length must be a multiple of 64 bits");
    }

    const length = value.length / LONG_BYTE_SIZE;
    buffer.writeVarInt(length);
    if (length !== 0) {
      buffer.writeBytes(value, length);
    }
  },
  read: async (buffer) => {
    const length = buffer.readVarInt();
    return buffer.readBytes(length);
  },
  typegen: () => ({
    type: "Buffer",
    declarations: ["type BitSet = Buffer"],
  }),
}));

export type LightData = {
  skyLight: BitSet;
  blockLight: BitSet;
  emptySkyLight: BitSet;
  emptyBlockLight: BitSet;
  skyLightArrays: Buffer[];
  blockLightArrays: Buffer[];
};

const lightDataType = () =>
  object({
    skyLight: bitset(),
    blockLight: bitset(),
    emptySkyLight: bitset(),
    emptyBlockLight: bitset(),
    skyLightArrays: prefixedArray({ type: prefixedByteArray() }), // TODO: fixed 2048-byte arrays
    blockLightArrays: prefixedArray({ type: prefixedByteArray() }), // TODO: fixed 2048-byte arrays
  });

export const lightData = defineProtocolType<LightData>({
  write: async (buffer, value) => {
    await lightDataType().write(buffer, value);
  },
  read: async (buffer) => {
    return (await lightDataType().read(buffer)) as LightData;
  },
  typegen: () => ({
    type: "LightData",
    declarations: [
      `type LightData = {
        skyLight: BitSet;
        blockLight: BitSet;
        emptySkyLight: BitSet;
        emptyBlockLight: BitSet;
        skyLightArrays: Buffer[];
        blockLightArrays: Buffer[];
      }`,
    ],
  }),
});
