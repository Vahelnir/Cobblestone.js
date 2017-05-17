class PacketHandler {
  handle(session, packet, pclass) {
    new pclass().handle(sesion, packet)
  }
}

module.exports = PacketHandler