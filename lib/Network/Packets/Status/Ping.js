const Packet = require('../Packet')

/**
 * Handshake Packet handler
 */
class Ping extends Packet {
  constructor() {
    super();
    this.ping = NaN
  }
  
  /**
   * Function called when encoding the Handshake
   * @param {CustomBuffer} data 
   */
  encode(data) {
    data.writeLong(this.ping)
  }

  /**
   * Function called when decoding the Handshake
   * @param {CustomBuffer} data 
   */
  decode(data) {
    this.ping = data.readLong()
  }
}

module.exports = Ping