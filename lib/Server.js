const net = require('net')
const ursa = require('ursa')
const SessionRegistry = require('./Network/Sessions/SessionRegistry')
const EntityManager = require('./Entities/EntityManager')

class Server {
  constructor () {
    this.sessions = new SessionRegistry(this)
    this.net = net.createServer()
    this.entityManager = new EntityManager()
    this.version = '1.11.2'
    this.protocolVersion = 316
    this.maxPlayers = 100
    this.players = []
    this.motd = 'Hello tout le monde <3'
    this.favicon = '' // data:image/png;base64,
    this.isOnlineMode = false
    this.keyPair = ursa.generatePrivateKey(1024);
    this.events()
  }

  serverPing () {
    return {
      version: {
        name: this.version,
        protocol: this.protocolVersion
      },
      players: {
        max: this.maxPlayers,
        online: this.players.length,
        sample: this.players.map(({ uuid: id, profile: { name }}) => ({ id, name }))
      },
      description: {
        text: this.motd
      },
      // favicon: this.favicon
    }
  }

  events () {
    this.net.on('connection', socket => this.sessions.registerSession(socket))
  }

  start () {
    this.net.listen(25565)
  }

  setPlayerStatus (player, status) {
    if (status)
      this.players.push(player)
    else {
      const index = this.players.indexOf(player)
      this.players.splice(index, 1)
      this.sessions.broadcastMessage(`§e${player.profile.name} left the server`)
    }
  }

}

module.exports = Server