const Int64BE = require('int64-buffer').Int64BE

/**
 * A CustomBuffer used everywhere in the app
 */
class CustomBuffer {

  /**
   * Create a CustomBuffer from a buffer object
   * @param {Buffer|number} buffer
   */
  constructor (buffer = 0) {
    if (typeof buffer !== 'number' && !(buffer instanceof Buffer))
      throw new Error('buffer must be a number or an instance of Buffer')
    this.buffer = buffer instanceof Buffer ? buffer : Buffer.alloc(buffer)
    this.offset = 0
  }

  /**
   * Read a Byte
   * @return {number} byte
   */
  readByte () {
    return this.buffer.slice(this.offset++, this.offset).readInt8()
  }

  /**
   * Read an Unsigned Byte
   * @return {number} byte
   */
  readUByte () {
    return this.buffer.slice(this.offset++, this.offset).readUInt8()
  }

  /**
   * Read a Byte Array
   * @return {number[]} byte
   */
  readByteArray () {
    const size = this.readVarInt();
    const buf = new CustomBuffer(this.buffer.slice(this.offset, this.offset + size))
    const array = []
    for (let i = 0; i < buf.buffer.length; i++)
      array.push(buf.readUByte())
    return array
  }

  /**
   * Read a UByte Array
   * @return {number[]} byte
   */
  readUByteArray () {
    const size = this.readVarInt();
    const buf = this.buffer.slice(this.offset, this.offset += size)
    const array = []
    for (let i = 0; i < buf.length; i++)
      array.push(buf[ i ])
    return array
  }

  /**
   * Read a boolean
   * @return {boolean} boolean
   */
  readBool () {
    return this.readByte() === 1
  }

  /**
   * Read a Short
   * @return {number} short
   */
  readShort () {
    return this.buffer.slice(this.offset, this.offset += 2).readInt16BE()
  }

  /**
   * Read an Unsigned Short
   * @return {number} ushort
   */
  readUShort () {
    return this.buffer.slice(this.offset, this.offset += 2).readUInt16BE()
  }

  /**
   * Read an Integer
   * @return {number} integer
   */
  readInteger () {
    return this.buffer.slice(this.offset, this.offset += 4).readInt32BE()
  }

  /**
   * Read a Long
   * @return {number} long
   */
  readLong () {
    const buf = this.buffer.slice(this.offset, this.offset += 8)
    return +(new Int64BE(buf))
  }

  /**
   * Read a Float
   * @return {number} float
   */
  readFloat () {
    return this.buffer.slice(this.offset, this.offset += 4).readFloatBE()
  }

  /**
   * Read a Double
   * @return {number} double
   */
  readDouble () {
    return this.buffer.slice(this.offset, this.offset += 8).readDoubleBE()
  }

  /**
   * Read a String
   * @param {number} [size=NaN]
   * @param {string} [encoding='utf-8']
   * @return {string} string
   */
  readString (size = NaN, encoding = 'utf-8') {
    if (isNaN(size)) size = this.readVarInt();
    return this.buffer.slice(this.offset, this.offset += size).toString(encoding)
  }

  /**
   * Check if there are more bytes to read
   * @return {boolean} bool
   */
  canReadMore () {
    return this.offset >= this.buffer.length
  }

  /**
   * Read a Var
   * @param {number} max - The maximum Var size
   * @param withSize
   * @ignore
   */
  readVar (max, withSize = false) {
    let numRead = 0,
      result = 0,
      read
    do {
      read = this.readByte()
      let value = (read & 0b01111111)
      result |= (value << (7 * numRead))

      numRead++;
      if (numRead > max)
        throw new RuntimeException("VarInt/Long is too big")
    } while ((read & 0b10000000) !== 0)

    return withSize ? {
      size: numRead,
      result
    } : result;
  }

  /**
   * Read a VarInt
   * @return {number} varint
   */
  readVarInt (withSize) {
    return this.readVar(5, withSize)
  }

  /**
   * Read a VarLong
   * @return {number} varlong
   */
  readVarLong (withSize) {
    return this.readVar(10, withSize)
  }

  write (method, size, value) {
    if (method in this.buffer || method === 'writeLong') {
      const buf = Buffer.alloc(size)
      if (method === 'writeLong')
        buf.fill(new Int64BE(value).toBuffer(), 0, 8)
      else
        buf[ method ](value)
      if (this.buffer.length < this.offset + buf.length) {
        const newBuf = Buffer.alloc(this.offset + buf.length)
        newBuf.fill(this.buffer, 0, this.buffer.length)
        this.buffer = newBuf
      }
      this.buffer.fill(buf, this.offset, this.offset += buf.length)
    }
  }

  /**
   * Write a Byte
   * @param {number} byte
   */
  writeByte (byte) {
    this.write('writeInt8', 1, byte)
    return this
  }

  /**
   * Write a Unsigned Byte
   * @param {number} ubyte
   */
  writeUByte (ubyte) {
    this.write('writeUInt8', 1, ubyte)
    return this
  }

  /**
   * Write a Byte Array
   * @param {number[]} buffer
   * @param {boolean} isUnsigned
   */
  writeByteArray (buffer, isUnsigned) {
    const buf = new CustomBuffer()
    buf.writeVarInt(buffer.length)
    for (let i = 0; i < buffer.length; i++)
      buf.write(isUnsigned ? 'writeUInt8' : 'writeInt8', 1, buffer[ i ])
    this.writeBuffer(buf)
    return this
  }

  /**
   * Write a UByte Array
   * @param {number[]} buff
   * @return {CustomBuffer} this
   */
  writeUByteArray (buff) {
    this.writeByteArray(buff, true)
    return this
  }

  /**
   * Write a boolean
   * @param {boolean} boolean
   * @return {CustomBuffer} this
   */
  writeBool (boolean) {
    this.writeByte(boolean ? 1 : 0)
    return this
  }

  /**
   * Write a Short
   * @param {number} short
   * @return {CustomBuffer} this
   */
  writeShort (short) {
    this.write('writeInt16BE', 2, short)
    return this
  }

  /**
   * Write an Unsigned Short
   * @param {number} ushort
   * @return {CustomBuffer} this
   */
  writeUShort (ushort) {
    this.write('writeUInt16BE', 2, ushort)
    return this
  }

  /**
   * Write an Integer
   * @param {number} integer
   * @return {CustomBuffer} this
   */
  writeInteger (integer) {
    this.write('writeUInt32BE', 4, integer)
    return this
  }

  /**
   * Write a Long
   * @param {number} long
   * @return {CustomBuffer} this
   */
  writeLong (long) {
    this.write('writeLong', 8, long)
    return this
  }

  /**
   * Write a Float
   * @param {number} float
   * @return {CustomBuffer} this
   */
  writeFloat (float) {
    this.write('writeFloatBE', 4, float)
    return this
  }

  /**
   * Write a Double
   * @param {number} double
   * @return {CustomBuffer} this
   */
  writeDouble (double) {
    this.write('writeDoubleBE', 8, double)
    return this
  }

  /**
   * Write a String
   * @param {string} str
   * @return {CustomBuffer} this
   */
  writeString (str) {
    const size = Buffer.byteLength(str)
    this.writeVarInt(size)
    this.write('write', size, str)
    return this
  }

  /**
   * Write a VarInt
   * @param {number} value
   * @return {CustomBuffer} this
   */
  writeVarInt (value) {
    do {
      let temp = (value & 0b01111111)
      value >>>= 7
      if (value !== 0)
        temp |= 0b10000000
      this.writeUByte(temp)
    } while (value !== 0)
    return this
  }

  /**
   * Write a VarLong
   * @param {number} value
   * @return {CustomBuffer} this
   */
  writeVarLong (value) {
    this.writeVarInt(value)
    return this
  }

  /**
   * Write a Buffer
   * @param {Buffer|CustomBuffer} buffer
   * @return {CustomBuffer} this
   */
  writeBuffer (buffer) {
    if (buffer instanceof CustomBuffer)
      buffer = buffer.buffer
    if (this.buffer.length < this.offset + buffer.length) {
      const newBuf = Buffer.alloc(this.offset + buffer.length)
      newBuf.fill(this.buffer, 0, this.buffer.length)
      this.buffer = newBuf
    }
    this.buffer.fill(buffer, this.offset, this.offset += buffer.length)
    return this
  }

  /**
   * Slice the buffer
   * @param {number} offset
   * @param {number|null} end
   */
  slice (offset, end) {
    return new CustomBuffer(this.buffer.slice(offset, end))
  }

  /**
   * Return the bufferlength
   * @return {number} length
   */
  get length () {
    return this.buffer.length
  }

  readableBytes () {
    return this.buffer.length - this.offset
  }

  static writeVarInt (value) {
    const arr = []
    do {
      let temp = (value & 0b01111111)
      value >>>= 7
      if (value !== 0)
        temp |= 0b10000000
      arr.push(temp)
    } while (value !== 0)
    return arr
  }

}

module.exports = CustomBuffer