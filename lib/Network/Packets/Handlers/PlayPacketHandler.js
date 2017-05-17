const PacketHandler = require('./PacketHandler')

const KeepAlive = require('../Play/KeepAlive')
const ChatMessage = require('../Play/ChatMessage')

class PlayPacketHandler extends PacketHandler {
  /**
   * Handle the packet
   * @param {Session} session 
   * @param {Packet} packet 
   */
  handle(session, packet) {
    if(packet instanceof KeepAlive) {
      session.receiveKeepAlive()
    } else if (packet instanceof ChatMessage) {
      this.handleChatMessage(session, packet)
    }
  }

  handleChatMessage (session, packet) {
    session.player.broadcastMessage(packet.rawText)
  }
}

module.exports = PlayPacketHandler