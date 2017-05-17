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
    const players = []
    for (let i = 0; i < this.players.length; i++)
      players.push({
        name: this.players[ i ].profile.name,
        id: this.players[ i ].uuid
      })
    return {
      version: {
        name: this.version,
        protocol: this.protocolVersion
      },
      players: {
        max: this.maxPlayers,
        online: this.players.length,
        sample: players
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

  setPlayerOnline (player, status) {
    if (status)
      this.players.push(player)
    else {
      this.sessions.broadcastMessage(`§e${player.profile.name} left the server`)
      const index = this.players.findIndex(p => p === player)
      this.players.splice(index, 1)
    }
  }

}

module.exports = Server