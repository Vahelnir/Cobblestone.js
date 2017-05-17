const Packet = require('../Packet')

/**
 * Handshake Packet handler
 */
class SetCompression extends Packet {
  constructor(threshold) {
    super();
    this.uuid = threshold 
  }
  /**
   * Function called when encoding
   * @param {CustomBuffer} data 
   */
  encode(data) {
    data.writeInteger(this.uuid)
  }

  /**
   * Function called when decoding
   * @param {CustomBuffer} data 
   */
  decode(data) {
    this.uuid = data.readInteger()
  }
}

module.exports = SetCompression