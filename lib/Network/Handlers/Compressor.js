// TODO WIP

const zlib = require('zlib')

class Compressor {

  constructor(threshold) {
    this.threshold = threshold
  }

  deflate(buffer) {
    return new Promise((resolve, reject) => zlib.deflate(buffer, (err, newBuff) => err ? reject(err) : resolve(newBuff)))
  }

  inflate(buffer) {
    return new Promise((resolve, reject) => zlib.inflate(buffer, (err, newBuff) => err ? reject(err) : resolve(newBuff)))
  }

  async compress(cIn, cOut) {
    if (cIn.length < this.threshold) {
      cOut.writeByte(0)
      cOut.writeBuffer(cIn)
    }
    const res = await this.deflate(cIn.buffer)
    cOut.writeVarInt(cIn.length)
    cOut.writeByteArray(res)
  }

  async decompress(cIn, cOut) {
    const ucLn = cIn.readVarInt()
    if(ucLn === 0) {
      cOut.writeBuffer(cOut)
      return
    }
    const res = await this.inflate(cIn.buffer)
    cOut.writeBuffer(res)
  }

}

module.exports = Compressor