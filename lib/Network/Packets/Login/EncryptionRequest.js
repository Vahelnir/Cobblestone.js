const Packet = require('../Packet')
const CustomBuffer = require('../../../CustomBuffer')

/**
 * Handshake Packet handler
 */
class EncryptionRequest extends Packet {
  constructor(serverId, publicKey, verifyToken) {
    super();
    this.serverId = serverId
    this.publicKey = publicKey
    this.verifyToken = verifyToken
  }
  /**
   * Function called when encoding the Handshake
   * @param {CustomBuffer} data 
   */
  encode(data) {
    data.writeString(this.serverId)
    data.writeVarInt(this.publicKey.length)
    data.writeBuffer(this.publicKey)
    data.writeVarInt(this.verifyToken.length)
    data.writeBuffer(this.verifyToken)
  }

  /**
   * Function called when decoding the Handshake
   * @param {CustomBuffer} data 
   */
  decode(data) {
    this.serverId = data.readString()
    this.publicKey = data.readBuffer(data.readVarInt())
    this.verifyToken = data.readBuffer(data.readVarInt())
  }
}

module.exports = EncryptionRequest