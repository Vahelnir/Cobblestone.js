const PacketHandler = require('./PacketHandler')
const Request = require('../Status/Request')
const Response = require('../Status/Response')
const Ping = require('../Status/Ping')

class StatusPacketHandler extends PacketHandler {
  /**
   * Handle the packet
   * @param {Session} session 
   * @param {Packet} packet 
   */
  handle(session, packet) {
    if (packet instanceof Request)
      session.sendPacket(new Response(session.sessions.server.serverPing()))
    else if (packet instanceof Ping)
      session.sendPacket(packet)
  }
}

module.exports = StatusPacketHandler