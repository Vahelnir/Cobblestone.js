const EntityLiving = require('./EntityLiving')
const LoginSuccess = require('../Network/Packets/Login/LoginSuccess')
const PluginMessage = require('../Network/Packets/Play/PluginMessage')
const JoinGame = require('../Network/Packets/Play/JoinGame')
const Position = require('../Network/Packets/Play/Position')
const ChatComponent = require('../Core/Chat/ChatComponent')
const ChatMessage = require('../Network/Packets/Play/ChatMessage')

class Player extends EntityLiving {
  constructor (session) {
    super(session.server, session.uuid)
    this.session = session
    this.ai = false

    session.server.entityManager.allocate(this)
    console.log('uuid:', this.uuid, this.uuid.length)
    console.log('name:', this.profile.name, this.profile.name.length)
    session.sendPacket(new LoginSuccess(this.uuid, this.profile.name))

    session.changeProtocol(0)

    session.sendPacket(new PluginMessage('MC|Brand', Buffer.from('Cobblestone.js')))
    session.sendPacket(new JoinGame(this.id, 0, 0, 0, this.session.server.maxPlayers, 'default', false))
    session.sendPacket(new Position(0, 64, 0, 0, 0, 1));
    this.session.sessions.broadcastMessage(`§e${this.profile.name} joined the server`)

    this.server.setPlayerStatus(this, true)
  }

  /**
   * Send a message to the player
   * @param message
   */
  sendMessage(message) {
    this.session.sendPacket(new ChatMessage(new ChatComponent(message), 0))
  }

  /**
   * Broadcast a message
   * @param {string} msg
   */
  broadcastMessage(msg) {
    this.session.sessions.broadcastMessage(`<${this.profile.name}> ${msg}`)
  }

  get profile () {
    return this.session.profile
  }

  set profile (val) {
    this.session.profile = val
  }
}

module.exports = Player