const { Socket } = require('net')
const Session = require('./Session')
const ChatMessage = require('../Packets/Play/ChatMessage')
const ChatComponent = require('../../Core/Chat/ChatComponent')

class SessionRegistry {
  constructor (server) {
    this.server = server;
    this.sessions = []
  }

  /**
   * Add a session to the list
   * @param {Session} session
   */
  add (session) {
    this.sessions.push(session)
  }

  /**
   * Remove a session from the list
   * @param {Session} session
   */
  remove (session) {
    this.sessions.splice(this.sessions.indexOf(session), 1)
  }

  /**
   * Register & create a new session
   * @param {Socket} socket
   */
  registerSession (socket) {
    const session = new Session(socket, this, this.server)
    this.add(session)
    return session
  }

  /**
   * Broadcast a packet to everyone
   * @param {Packet} packet
   */
  broadcastPacket (packet) {
    for (let i = 0; i < this.sessions.length; i++) {
      const session = this.sessions[ i ]
      session.sendPacket(packet)
    }
  }

  /**
   * Broadcast a message to everyone
   * @param {string} message
   * @param {number} position
   */
  broadcastMessage (message, position = 0) {
    this.broadcastPacket(new ChatMessage(new ChatComponent(message), position))
  }
}

module.exports = SessionRegistry