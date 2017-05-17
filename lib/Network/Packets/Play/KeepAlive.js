const Packet = require('../Packet')

/**
 * Handshake Packet handler
 */
class KeepAlive extends Packet {
  constructor(id) {
    super()
    this.id = id
  }
  /**
   * Function called when encoding the Handshake
   * @param {CustomBuffer} data 
   */
  encode(data) {
    data.writeVarInt(this.id)
  }

  /**
   * Function called when decoding the Handshake
   * @param {CustomBuffer} data 
   */
  decode(data) {
    this.id = data.readVarInt()
  }
}

module.exports = KeepAlive