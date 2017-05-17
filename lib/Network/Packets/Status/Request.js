const Packet = require('../Packet')

/**
 * Handshake Packet handler
 */
class Request extends Packet {
  constructor() {
    super();
  }
  
  /**
   * Function called when encoding the Handshake
   * @param {CustomBuffer} data 
   */
  encode(data) {}

  /**
   * Function called when decoding the Handshake
   * @param {CustomBuffer} data 
   */
  decode(data) {}
}

module.exports = Request