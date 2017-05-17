const Packet = require('../Packet')

/**
 * Handshake Packet handler
 */
class Position extends Packet {
  constructor(x, y, z, yaw, pitch, flags, teleportId) {
    super()
    this.x = x
    this.y = y
    this.z = z
    this.yaw = yaw
    this.pitch = pitch
    this.flags = flags
    this.teleportId = teleportId
  }
  /**
   * Function called when encoding the Handshake
   * @param {CustomBuffer} data 
   */
  encode(data) {
    data.writeDouble(this.x)
    data.writeDouble(this.y)
    data.writeDouble(this.z)
    data.writeFloat(this.yaw)
    data.writeFloat(this.pitch)
    data.writeUByte(this.flags)
    data.writeVarInt(this.teleportId)
  }

  /**
   * Function called when decoding the Handshake
   * @param {CustomBuffer} data 
   */
  decode(data) {
    this.id = data.readVarInt()
  }
}

module.exports = Position