const Packet = require('../Packet')

/**
 * Handshake Packet handler
 */
class JoinGame extends Packet {
  constructor(entityId, gamemode, dimension, difficulty, maxPlayers, levelType, reducedDebug) {
    super()
    this.entityId = entityId
    this.gamemode = gamemode
    this.dimension = dimension
    this.difficulty = difficulty
    this.maxPlayers = maxPlayers
    this.levelType = levelType
    this.reducedDebug = reducedDebug
  }
  /**
   * Function called when encoding the Handshake
   * @param {CustomBuffer} data 
   */
  encode(data) {
    data.writeInteger(this.entityId)
    data.writeUByte(this.gamemode)
    data.writeInteger(this.dimension)
    data.writeUByte(this.difficulty)
    data.writeUByte(this.maxPlayers)
    console.log(this.levelType)
    data.writeString(this.levelType)
    data.writeBool(this.reducedDebug)
  }

  /**
   * Function called when decoding the Handshake
   * @param {CustomBuffer} data 
   */
  decode(data) {
    this.id = data.readVarInt()
  }
}

module.exports = JoinGame