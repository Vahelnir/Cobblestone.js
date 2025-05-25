export class CustomBuffer {
  public buffer: Buffer;
  private cursor = 0;

  constructor(buffer: Buffer | number[] | number = 0) {
    if (Buffer.isBuffer(buffer)) {
      this.buffer = buffer;
    } else if (Array.isArray(buffer)) {
      this.buffer = Buffer.from(buffer);
    } else {
      this.buffer = Buffer.alloc(buffer);
    }
  }

  slice(begin = 0, end = this.buffer.length) {
    const slice = Buffer.alloc(end - begin);
    this.buffer.subarray(begin, end).copy(slice);
    return new CustomBuffer(slice);
  }

  readUnsignedByte(): number {
    const ubyte = this.buffer.readUIntBE(this.cursor, 1);
    this.cursor += 1;
    return ubyte;
  }

  readByte(): number {
    const byte = this.buffer.readIntBE(this.cursor, 1);
    this.cursor += 1;
    return byte;
  }

  readBoolean(): boolean {
    return this.readByte() !== 0;
  }

  readBytes(size?: number): Buffer {
    if (size === undefined) {
      size = this.bytesAvailable;
    }

    const bytes = this.buffer.subarray(this.cursor, this.cursor + size);
    this.cursor += size;
    return bytes;
  }

  readBuffer(size: number): Buffer {
    const slice = Buffer.alloc(size);
    this.buffer.subarray(this.cursor, this.cursor + size).copy(slice);
    this.cursor += size;
    return slice;
  }

  readCustomBuffer(size: number): CustomBuffer {
    if (size > this.bytesAvailable) {
      return new CustomBuffer();
    }
    return new CustomBuffer(this.readBuffer(size));
  }

  readShort(): number {
    const short = this.buffer.readInt16BE(this.cursor);
    this.cursor += 2;
    return short;
  }

  readUnsignedShort(): number {
    const ushort = this.buffer.readUInt16BE(this.cursor);
    this.cursor += 2;
    return ushort;
  }

  readInt(): number {
    const integer = this.buffer.readInt32BE(this.cursor);
    this.cursor += 4;
    return integer;
  }

  readUnsignedInt(): number {
    const uinteger = this.buffer.readUInt32BE(this.cursor);
    this.cursor += 4;
    return uinteger;
  }

  readLong(): bigint {
    const bigInt = this.buffer.readBigInt64BE(this.cursor);
    this.cursor += 8;
    return bigInt;
  }

  readUnsignedLong(): bigint {
    const bigInt = this.buffer.readBigUInt64BE(this.cursor);
    this.cursor += 8;
    return bigInt;
  }

  readFloat(): number {
    const float = this.buffer.readFloatBE(this.cursor);
    this.cursor += 4;
    return float;
  }

  readDouble(): number {
    const double = this.buffer.readDoubleBE(this.cursor);
    this.cursor += 8;
    return double;
  }

  readVarShort() {
    let res = 0;
    for (let i = 0; i < 16; i += 7) {
      const b = this.readUnsignedByte();
      res += (b & 127) << i;
      if (!(b & 128)) {
        return res;
      }
    }
    throw new Error("Too much data");
  }

  readVarUhShort(): number {
    return this.readVarShort();
  }

  readVarInt(): number {
    let res = 0;
    for (let i = 0; i < 32; i += 7) {
      const b = this.readUnsignedByte();
      res += (b & 127) << i;
      if (!(b & 128)) {
        return res;
      }
    }
    throw new Error("Too much data");
  }

  readVarLong(): bigint {
    let res = 0n;
    for (let i = 0n; i < 64; i += 7n) {
      const b = BigInt(this.readUnsignedByte());
      res += (b & 127n) << i;
      if (!(b & 128n)) {
        return res;
      }
    }
    throw new Error("Too much data");
  }

  readString() {
    const length = this.readVarInt();
    return this.readBuffer(length).toString("utf8");
  }

  expand(value: number) {
    if (this.bytesAvailable < value) {
      const size = value - this.bytesAvailable;

      this.buffer = Buffer.concat([this.buffer, Buffer.alloc(size)]);
    }
  }

  private writeBufferFunc(func: () => void, size: number) {
    this.expand(size);
    func();
    this.cursor += size;
  }

  writeByte(byte: number) {
    this.expand(1);
    this.buffer.writeInt8(byte, this.cursor++);
    return this;
  }

  writeUnsignedByte(ubyte: number) {
    this.expand(1);
    this.buffer.writeUInt8(ubyte, this.cursor++);
    return this;
  }

  writeBoolean(bool: boolean) {
    this.writeUnsignedByte(bool ? 1 : 0);
    return this;
  }

  writeBytes(bytesArg: CustomBuffer | Buffer, offset = 0, length = 0) {
    const bytes = bytesArg instanceof CustomBuffer ? bytesArg.buffer : bytesArg;
    if (length === 0) {
      length = bytes.length - offset;
    }

    this.expand(length);

    for (let i = 0; i < length; i++) {
      this.buffer[i + this.cursor] = bytes[i + offset];
    }

    this.cursor += length;
    return this;
  }

  writeShort(short: number) {
    this.writeBufferFunc(() => {
      this.buffer.writeInt16BE(short, this.cursor);
    }, 2);
    return this;
  }

  writeUnsignedShort(ushort: number) {
    this.writeBufferFunc(() => {
      this.buffer.writeUInt16BE(ushort, this.cursor);
    }, 2);
    return this;
  }

  writeInt(integer: number) {
    this.writeBufferFunc(() => {
      this.buffer.writeInt32BE(integer, this.cursor);
    }, 4);
    return this;
  }

  writeUnsignedInt(uinteger: number) {
    this.writeBufferFunc(() => {
      this.buffer.writeUInt32BE(uinteger, this.cursor);
    }, 4);
    return this;
  }

  writeLong(long: bigint | number) {
    this.writeBufferFunc(() => {
      this.buffer.writeBigInt64BE(BigInt(long), this.cursor);
    }, 8);
    return this;
  }

  writeUnsignedLong(ulong: bigint | number) {
    this.writeBufferFunc(() => {
      this.buffer.writeBigUInt64BE(BigInt(ulong), this.cursor);
    }, 8);
    return this;
  }

  writeFloat(float: number) {
    this.writeBufferFunc(() => {
      this.buffer.writeFloatBE(float, this.cursor);
    }, 4);
    return this;
  }

  writeDouble(double: number) {
    this.writeBufferFunc(() => {
      this.buffer.writeDoubleBE(double, this.cursor);
    }, 8);
    return this;
  }

  writeVarShort(value: number) {
    this.writeVar(value);
    return this;
  }

  writeVarUhShort(value: number) {
    this.writeVarShort(value);
    return this;
  }

  writeVarInt(value: number): CustomBuffer {
    this.writeVar(value);
    return this;
  }

  writeVarUhInt(value: number): CustomBuffer {
    this.writeVarInt(value);
    return this;
  }

  writeVarLong(value: bigint) {
    if (!value) {
      this.writeUnsignedByte(0);
    }
    while (value) {
      let b = value & 127n;
      value >>= 7n;
      if (value) {
        b |= 128n;
      }
      this.writeUnsignedByte(Number(b));
    }
    return this;
  }

  writeVarUhLong(value: bigint) {
    this.writeVarLong(value);
    return this;
  }

  private writeVar(i: number) {
    if (!i) {
      this.writeUnsignedByte(0);
    }
    while (i) {
      let b = i & 0b01111111;
      i >>= 7;
      if (i) {
        b |= 0b10000000;
      }
      this.writeUnsignedByte(b);
    }
  }

  writeString(text: string) {
    const textBuffer = Buffer.from(text, "utf8");
    this.writeVarInt(textBuffer.length);
    this.writeBytes(textBuffer);
    return this;
  }

  clear(): void {
    this.buffer = Buffer.alloc(0);
    this.reset();
  }

  reset(): void {
    this.cursor = 0;
  }

  get position() {
    return this.cursor;
  }

  set position(pos: number) {
    this.cursor = pos;
  }

  get bytesAvailable() {
    return this.buffer.length - this.cursor;
  }

  get length(): number {
    return this.buffer.length;
  }
}
