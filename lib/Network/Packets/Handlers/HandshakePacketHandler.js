const PacketHandler = require('./PacketHandler')

class HandshakePacketHandler extends PacketHandler {
  handle(session, handshake) {
    session.changeProtocol(handshake.state)
    session.protocolVersion = handshake.protocolVersion
  }
}

module.exports = HandshakePacketHandler