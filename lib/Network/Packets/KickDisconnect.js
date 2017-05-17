const Packet = require('./Packet')

/**
 * Handshake Packet handler
 */
class KickDisconnect extends Packet {
  constructor(msg) {
    super();
    this.msg = JSON.stringify(msg)
  }
  /**
   * Function called when encoding the Handshake
   * @param {CustomBuffer} data 
   */
  encode(data) {
    data.writeString(this.msg)
  }

  /**
   * Function called when decoding the Handshake
   * @param {CustomBuffer} data 
   */
  decode(data) {}
}

module.exports = KickDisconnect