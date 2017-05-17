const Packet = require('../Packet')

/**
 * Handshake Packet handler
 */
class PluginMessage extends Packet {
  constructor(channel, data) {
    super()
    this.channel = channel
    this.data = data
  }
  /**
   * Function called when encoding the Handshake
   * @param {CustomBuffer} data 
   */
  encode(data) {
    data.writeString(this.channel)
    data.writeUByteArray(this.data)
  }

  /**
   * Function called when decoding the Handshake
   * @param {CustomBuffer} data 
   */
  decode(data) {
    this.id = data.readVarInt()
  }
}

module.exports = PluginMessage