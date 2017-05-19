const CustomBuffer = require('../../CustomBuffer')
const iconv = require('iconv-lite')

/**
 * @return {boolean}
 */
module.exports = function LegacyPingHandler(cbuffer, session) {
  if (cbuffer.buffer[0] === 0xFE) {
    cbuffer.offset = 1
    let str = ''
    switch (cbuffer.readableBytes()) {
      case 0:
        str = `${session.server.motd}\u00a7${session.server.players.length.toString()}\u00a7${session.server.maxPlayers.toString()}`
        break
      case 1:
        str = `\u00a71\u0000${session.server.protocolVersion}\u0000${session.server.version}\u0000${session.server.motd}\u0000${session.server.players.length.toString()}\u0000${session.server.maxPlayers.toString()}`
        break
      default:
        if (cbuffer.readUByte() === 0x01 && cbuffer.readUByte() === 0xFA) {
          const size = cbuffer.readShort() * 2
          const type = iconv.decode(cbuffer.buffer.slice(cbuffer.offset, cbuffer.offset += size), 'utf16be')
          if (type === 'MC|PingHost') {
            const length = cbuffer.readUShort()
            const clientVersion = cbuffer.readUByte()
            const hostnameSize = cbuffer.readShort() * 2
            const hostname = iconv.decode(cbuffer.buffer.slice(cbuffer.offset, cbuffer.offset += hostnameSize), 'utf16be')
            if (clientVersion >= 73 && 7 + hostname.length * 2 === length)
              str = `\u00a71\u0000${session.server.protocolVersion}\u0000${session.server.version}\u0000${session.server.motd}\u0000${session.server.players.length.toString()}\u0000${session.server.maxPlayers.toString()}`
          }
        }
        break
    }

    const res = new CustomBuffer()
      .writeUByte(0xFF)
      .writeUShort(str.length)
      .writeBuffer(iconv.encode(str, 'utf16be'))
    session.socket.write(res.buffer)
    return true
  }
  return false
}