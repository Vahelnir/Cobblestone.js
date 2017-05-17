const Packet = require('../Packet')

/**
 * Handshake Packet handler
 */
class LoginStart extends Packet {
  constructor(name) {
    super();
    this.name = name
  }
  /**
   * Function called when encoding the Handshake
   * @param {CustomBuffer} data 
   */
  encode(data) {
    data.writeString(this.name)
  }

  /**
   * Function called when decoding the Handshake
   * @param {CustomBuffer} data 
   */
  decode(data) {
    this.name = data.readString()
  }
}

module.exports = LoginStart