const Packet = require('../Packet')

/**
 * Handshake Packet handler
 */
class EncryptionResponse extends Packet {
  constructor(sharedSecret, verifyToken) {
    super();
    this.sharedSecret = sharedSecret
    this.verifyToken = verifyToken
  }
  /**
   * Function called when encoding the Handshake
   * @param {CustomBuffer} data 
   */
  encode(data) {
    data.writeByteArray(this.sharedSecret)
    data.writeByteArray(this.verifyToken)
  }

  /**
   * Function called when decoding the Handshake
   * @param {CustomBuffer} data 
   */
  decode(data) {
    this.sharedSecret = data.readUByteArray()
    this.verifyToken = data.readUByteArray()
  }
}

module.exports = EncryptionResponse