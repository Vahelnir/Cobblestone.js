const EventEmitter = require('events').EventEmitter
const iconv = require('iconv-lite');
const Protocol = require('../Protocol')
const CustomBuffer = require('../../CustomBuffer')
const KickDisconnectPacket = require('../Packets/KickDisconnect')
const KeepAlive = require('../Packets/Play/KeepAlive')
const Handshake = require('../Packets/Handshake/Handshake')
const ChatComponent = require('../../Core/Chat/ChatComponent')
const Player = require('../../Entities/Player')
const legacyPing = require('../Handlers/LegacyPing')
const packetParser = require('../Handlers/PacketParser')

class Session extends EventEmitter {

  constructor (socket, sessions, server) {
    super()
    this.server = server
    this.player = null
    this.bufferQueue = Buffer.alloc(0)
    this.sessions = sessions
    this.socket = socket
    this.protocol = Protocol.HANDSHAKE
    this.protocolVersion = 0
    this.verifyToken = null
    this.sharedSecret = null
    this.serverId = null
    this.latency = 0
    this.logged = false
    this.isCompressed = false
    this.compressor = null

    this.kickTimeout = 30 * 1000
    this.keepAlive = false
    this.keepAliveInterval = NaN
    this.lastKeepAlive = 0

    this.events()
    console.log(`[Connection] User (IP: ${this.ip}, Protocol: ${this.protocol.type}) is connecting ...`)
  }

  /**
   * Register the events
   * TODO: Split this code into files 
   */
  events () {
    this.socket.on('data', data => {
      try {
        let cbuffer = new CustomBuffer(/*this.bufferQueue*/)
        cbuffer.writeBuffer(data)
        cbuffer.offset = 0
        let stop = false
        while (!stop) {
          if (cbuffer.buffer.length > 0) {
            // LEGACY PING
            stop = legacyPing(cbuffer, this)
            if(stop) break
            // PACKETS
            ({buffer: cbuffer, stop: stop} = packetParser(cbuffer, this))
          } else stop = true
        }
      } catch (err) {
         if(!(err instanceof RangeError)) throw err
        console.log(err)
      }
    })

    this.socket.on('drain', () => console.log('drain'))

    this.socket.once('end', _ => this.closeConnection())
    this.socket.on('error', err => this.closeConnection(err))
  }

  /**
   * Send a packet to the client
   * @param {Packet} packet
   */
  sendPacket (packet) {
    const result = this.buildPacket(packet);
    console.log(`[Sent] (Protocol: ${this.protocol.type}) Packet ${packet.constructor.name} ID ${result.id} (Size: ${result.toSend.length}) sent to ${this.ip}`)
    this.socket.write(result.toSend)
  }

  /**
   * Build the packet for it to be ready to send
   * @param {Packet} packet
   */
  buildPacket (packet) {
    const packets = this.protocol.packets.TO_CLIENT
    const toSend = new CustomBuffer()
    let packId = NaN
    packets.forEach((Packet, id) => {
      if (packet instanceof Packet) {
        packId = id
        const packetId = CustomBuffer.writeVarInt(id)
        const packetData = new CustomBuffer()
        const buff = new CustomBuffer()
        packet.encode(packetData)
        buff.writeBuffer(Buffer.from(packetId))
        buff.writeBuffer(packetData)
        if (this.isCompressed) {
          const compressed = new CustomBuffer()
          this.compressor.compress(buff, compressed)
          toSend.writeVarInt(compressed.length)
        }
        toSend.writeVarInt(buff.length)
        toSend.writeBuffer(this.isCompressed ? compressed : buff)
      }
    })
    if (isNaN(packId)) throw new Error(`No packet found (${packet})`)

    toSend.offset = 0
    return { toSend: toSend.buffer, id: packId }
  }

  /**
   * Close the connection between the user and the server
   */
  closeConnection (err) {
    if(err) console.log(err)
    if (this.keepAlive) this.stopKeepAlive()
    this.sessions.remove(this)
    if (this.logged && this.player)
      this.server.setPlayerStatus(this.player, false)
    console.log('[Remove Session] Removed session')
  }

  /**
   * Get the client IP
   * @return {string} ip
   */
  get ip () {
    return this.socket.remoteAddress
  }

  /**
   * Disconnect the client
   * @param {string} reason
   */
  disconnect (reason) {
    if (typeof reason !== 'string') throw new Error('reason must be a string')
    console.log('kicked with reason:', reason)
    this.sendPacket(new KickDisconnectPacket(new ChatComponent(reason)))
    this.closeConnection()
  }

  /**
   * Change the protocol used by the client
   * @param {Protocol} protocol
   */
  changeProtocol (protocol) {
    const protocols = Object.entries(Protocol)
    for (let i = 0; i < protocols.length; i++) {
      if (protocols[ i ][ 1 ].id === protocol) {
        this.protocol = protocols[ i ][ 1 ]
        break
      }
    }
  }

  startKeepAlive () {
    this.keepAlive = true
    this.lastKeepAlive = new Date();
    this.keepAliveLoop()
    this.keepAliveInterval = setInterval(_ => this.keepAliveLoop(), 4000)
  }

  keepAliveLoop () {
    if (!this.keepAlive) return
    const elapsed = new Date() - this.lastKeepAlive
    if (elapsed > this.kickTimeout) {
      this.disconnect('KeepAliveTimeout')
      return;
    }
    this.sendKeepAliveTime = new Date()
    // https://github.com/PrismarineJS/node-minecraft-protocol/blob/5126b969546dbfb38aaaa61ab2f92d08476659e8/src/createServer.js#L85
    const randomId = Math.floor(Math.random() * 2147483648)
    console.log(`[Keep Alive] Keep Alive sent for ${this.username}`)
    this.sendPacket(new KeepAlive(randomId))
  }

  receiveKeepAlive () {
    if (this.sendKeepAliveTime) this.latency = (new Date()) - this.sendKeepAliveTime;
    this.lastKeepAlive = new Date();
  }

  stopKeepAlive () {
    if (this.keepAliveInterval) clearInterval(this.keepAliveInterval)
  }

  login () {
    if (!this.logged) {
      this.player = new Player(this)
      this.startKeepAlive()
      this.logged = true
    }
  }

}

module.exports = Session