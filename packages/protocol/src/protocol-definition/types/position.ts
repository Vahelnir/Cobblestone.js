import { defineProtocolType } from "../protocol-type.js";

export type Position = { x: number; y: number; z: number };

export const position = defineProtocolType<Position>(() => ({
  write: async (buffer, value) => {
    // x: 26 bits, z: 26 bits, y: 12 bits (all signed)
    let x = value.x & 0x3ffffff; // 26 bits
    let y = value.y & 0xfff; // 12 bits
    let z = value.z & 0x3ffffff; // 26 bits
    // Pack into a single 64-bit integer (BigInt)
    let packed = (BigInt(x) << 38n) | (BigInt(z) << 12n) | (BigInt(y) & 0xfffn);
    buffer.writeLong(packed);
  },
  read: async (buffer) => {
    const packed = buffer.readLong();
    let x = Number((packed >> 38n) & 0x3ffffffn);
    let y = Number(packed & 0xfffn);
    let z = Number((packed >> 12n) & 0x3ffffffn);
    // Convert from two's complement if negative
    if (x >= 0x2000000) x -= 0x4000000;
    if (y >= 0x800) y -= 0x1000;
    if (z >= 0x2000000) z -= 0x4000000;
    return { x, y, z };
  },
  typegen: () => ({
    type: "Position",
    declarations: ["type Position = { x: number; y: number; z: number }"],
  }),
}));
