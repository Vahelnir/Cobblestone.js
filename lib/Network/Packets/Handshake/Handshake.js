const Packet = require('../Packet')

/**
 * Handshake Packet handler
 */
class Handshake extends Packet {
  constructor(protocol, ip, port, state) {
    super();
    this.protocol = protocol
    this.ip = ip
    this.port = port
    this.state = state
  }
  /**
   * Function called when encoding the Handshake
   * @param {CustomBuffer} data 
   */
  encode(data) {
    data.writeVarInt(this.protocol)
    data.writeString(this.ip)
    data.writeShort(this.port)
    data.writeVarInt(this.state)
  }

  /**
   * Function called when decoding the Handshake
   * @param {CustomBuffer} data 
   */
  decode(data) {
    this.protocol = data.readVarInt()
    this.ip = data.readString()
    this.port = data.readShort()
    this.state = data.readVarInt()
  }
}

module.exports = Handshake