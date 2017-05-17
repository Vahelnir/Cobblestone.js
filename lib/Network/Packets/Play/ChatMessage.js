const Packet = require('../Packet')

/**
 * Handshake Packet handler
 */
class ChatMessage extends Packet {
  constructor(jsonDatas, position) {
    super()
    this.jsonDatas = jsonDatas
    this.position = position
    this.rawText = ''
  }
  /**
   * Function called when encoding the Handshake
   * @param {CustomBuffer} data
   */
  encode(data) {
    data.writeString(JSON.stringify(this.jsonDatas))
    data.writeUByte(this.position)
  }

  /**
   * Function called when decoding the Handshake
   * @param {CustomBuffer} data
   */
  decode(data) {
    this.rawText = data.readString()
  }
}

module.exports = ChatMessage