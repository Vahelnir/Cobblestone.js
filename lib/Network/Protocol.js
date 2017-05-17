const CustomBuffer = require('../CustomBuffer')
const PacketHandler = require('./Packets/Handlers/PacketHandler')
const Handshake = require('./Packets/Handshake/Handshake')
const fs = require('fs')

/**
 * Class that parse the data buffer and dispatch the packet
 */
class Protocol {

  constructor (id, type, handler, func) {
    this.packets = {
      TO_SERVER: new Map(),
      TO_CLIENT: new Map()
    }
    this.id = id
    this.type = type
    this.handler = (handler && handler.prototype instanceof PacketHandler) ? new handler() : null
    func(this)
  }

  /**
   *
   * @param {string} type
   * @param {number} id
   * @param {Packet} packet
   */
  registerPacket (type, id, packet) {
    if (type in this.packets) this.packets[ type ].set(id, packet)
    else throw new Error(`${type} is not a valid Protocol`);
  }

}

module.exports = {
  HANDSHAKE: new Protocol(-1, 'HANDSHAKE', require('./Packets/Handlers/HandshakePacketHandler'), protocol => {
    protocol.registerPacket('TO_SERVER', 0x00, require('./Packets/Handshake/Handshake'))
  }),
  PLAY: new Protocol(0, 'PLAY', require('./Packets/Handlers/PlayPacketHandler'), protocol => {
    protocol.registerPacket('TO_SERVER', 0x0B, require('./Packets/Play/KeepAlive'))
    protocol.registerPacket('TO_SERVER', 0x02, require('./Packets/Play/ChatMessage'))

    protocol.registerPacket('TO_CLIENT', 0x1A, require('./Packets/KickDisconnect'))
    protocol.registerPacket('TO_CLIENT', 0x1F, require('./Packets/Play/KeepAlive'))
    protocol.registerPacket('TO_CLIENT', 0x23, require('./Packets/Play/JoinGame'))
    protocol.registerPacket('TO_CLIENT', 0x18, require('./Packets/Play/PluginMessage'))
    protocol.registerPacket('TO_CLIENT', 0x2E, require('./Packets/Play/Position'))
    protocol.registerPacket('TO_CLIENT', 0x0F, require('./Packets/Play/ChatMessage'))
  }),
  STATUS: new Protocol(1, 'STATUS', require('./Packets/Handlers/StatusPacketHandler'), protocol => {
    protocol.registerPacket('TO_SERVER', 0x00, require('./Packets/Status/Request'))
    protocol.registerPacket('TO_SERVER', 0x01, require('./Packets/Status/Ping'))

    protocol.registerPacket('TO_CLIENT', 0x00, require('./Packets/Status/Response'))
    protocol.registerPacket('TO_CLIENT', 0x01, require('./Packets/Status/Ping'))
  }),
  LOGIN: new Protocol(2, 'LOGIN', require('./Packets/Handlers/LoginPacketHandler'), protocol => {
    protocol.registerPacket('TO_SERVER', 0x00, require('./Packets/Login/LoginStart'))
    protocol.registerPacket('TO_SERVER', 0x01, require('./Packets/Login/EncryptionResponse'))

    protocol.registerPacket('TO_CLIENT', 0x00, require('./Packets/KickDisconnect'))
    protocol.registerPacket('TO_CLIENT', 0x01, require('./Packets/Login/EncryptionRequest'))
    protocol.registerPacket('TO_CLIENT', 0x02, require('./Packets/Login/LoginSuccess'))
    protocol.registerPacket('TO_CLIENT', 0x03, require('./Packets/Login/SetCompression'))
  })
}