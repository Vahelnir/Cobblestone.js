import { defineProtocolType } from "../protocol-type.js";

export const uuid = defineProtocolType<string>(() => ({
  write: async (buffer, value) => {
    // Remove dashes and parse as hex
    const hex = value.replace(/-/g, "");
    const msb = BigInt("0x" + hex.slice(0, 16));
    const lsb = BigInt("0x" + hex.slice(16, 32));
    buffer.writeUnsignedLong(msb);
    buffer.writeUnsignedLong(lsb);
  },
  read: async (buffer) => {
    const msb = buffer.readUnsignedLong();
    const lsb = buffer.readUnsignedLong();

    const msbHex = msb.toString(16).padStart(16, "0");
    const lsbHex = lsb.toString(16).padStart(16, "0");
    const hex = msbHex + lsbHex;

    return (
      hex.slice(0, 8) +
      "-" +
      hex.slice(8, 12) +
      "-" +
      hex.slice(12, 16) +
      "-" +
      hex.slice(16, 20) +
      "-" +
      hex.slice(20)
    );
  },
  typegen: () => ({
    type: "UUID",
    declarations: ["type UUID = string "],
  }),
}));
