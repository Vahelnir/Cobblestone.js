module.exports = function PacketParser(cbuffer, session) {
  const { size: size, result: packetSize } = cbuffer.readVarInt(true)
  const packetData = cbuffer.slice(size, size + packetSize)
  cbuffer = cbuffer.slice(size + packetSize)
  if (packetData.length === packetSize) {
    const id = packetData.readVarInt()
    const direction = session.protocol.packets.TO_SERVER
    if (direction.has(id)) {
      const Packet = direction.get(id)
      const packet = new Packet()
      console.log(`[Received] (Protocol: ${session.protocol.type}) Packet ${packet.constructor.name} ID ${id} received from ${session.ip}`)
      packet.decode(packetData)
      session.protocol.handler.handle(session, packet)
    } else console.warn('Unknown packet')
  } else {
    session.bufferQueue = cbuffer.buffer
    stop = true
  }
}