const Packet = require('../Packet')

/**
 * Handshake Packet handler
 */
class LoginSuccess extends Packet {
  constructor(uuid, username) {
    super();
    this.uuid = uuid
    this.username = username
  }
  /**
   * Function called when encoding
   * @param {CustomBuffer} data 
   */
  encode(data) {
    data.writeString(this.uuid)
    data.writeString(this.username)
  }

  /**
   * Function called when decoding
   * @param {CustomBuffer} data 
   */
  decode(data) {
    this.uuid = data.readString()
    this.username = data.readString()
  }
}

module.exports = LoginSuccess