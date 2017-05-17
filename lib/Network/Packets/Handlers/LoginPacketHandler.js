const ursa = require('ursa')
const crypto = require('crypto')
const UUID = require('uuid-1345');
const yggserver = require('yggdrasil').server({});
const PacketHandler = require('./PacketHandler')
const LoginStart = require('../Login/LoginStart')
const EncryptionRequest = require('../Login/EncryptionRequest')
const EncryptionResponse = require('../Login/EncryptionResponse')
const SetCompression = require('../Login/SetCompression')
const Compressor = require('../../Handlers/Compressor')

class LoginPacketHandler extends PacketHandler {
  handle(session, packet) {
    if(packet instanceof SetCompression) {
      session.isCompressed = true
      session.compressor = new Compressor(packet.threshold)
      return
    }

    if (packet instanceof LoginStart) {
      session.username = packet.name
      if (session.server.isOnlineMode) {
        let publicKeyArr = session.server.keyPair.toPublicPem('utf8').split('\n')
        publicKeyArr = publicKeyArr.slice(1, publicKeyArr.length - 2)
        let publicKey = '';
        for (let i = 0; i < publicKeyArr.length; i++)
          publicKey += publicKeyArr[i]
        session.serverId = crypto.randomBytes(4).toString('hex')
        session.publicKey = new Buffer(publicKey, 'base64')
        session.verifyToken = crypto.randomBytes(4)
        session.sendPacket(new EncryptionRequest(session.serverId, session.publicKey, session.verifyToken))
        return;
      } else {
        // https://github.com/openjdk-mirror/jdk7u-jdk/blob/f4d80957e89a19a29bb9f9807d2a28351ed7f7df/src/share/classes/java/util/UUID.java#L163
        function javaUUID(s) {
          const hash = crypto.createHash('md5');
          hash.update(s, 'utf8');
          const buffer = hash.digest();
          buffer[6] = (buffer[6] & 0x0f) | 0x30;
          buffer[8] = (buffer[8] & 0x3f) | 0x80;
          return buffer;
        }

        // https://github.com/PrismarineJS/node-minecraft-protocol/blob/5126b969546dbfb38aaaa61ab2f92d08476659e8/src/createServer.js#L257
        function nameToMcOfflineUUID(name) {
          return (new UUID(javaUUID('OfflinePlayer:' + name))).toString();
        }
        session.uuid = nameToMcOfflineUUID(session.username);
        session.profile = { name: session.username }
        session.login()
      }
    }

    if (packet instanceof EncryptionResponse) {
      this.encryptionResponse(session, packet)
      return
    }

    if ((session.protocol < session.server.protocolVersion) || session.protocol > session.server.protocolVersion) {
      session.disconnect(`Your client is outdated. Server Protocol Version: ${session.server.protocolVersion} (your protocol version: ${session.protocol})`)
      return
    } else if (session.server.maxPlayers <= session.server.onlinePlayers) {
      session.disconnect('The server is full')
      return
    }

  }

  async encryptionResponse(session, packet) {
    let sharedSecret
    try {
      const verifyToken = session.server.keyPair.decrypt(packet.verifyToken, undefined, undefined, ursa.RSA_PKCS1_PADDING);
      sharedSecret = session.server.keyPair.decrypt(packet.sharedSecret, undefined, undefined, ursa.RSA_PKCS1_PADDING);
      if (!session.verifyToken.equals(verifyToken))
        throw new Error('VerifyTokens are not matching')
    } catch (err) {
      session.disconnect('An error occured during the encrypting step')
      return
    }
    session.sharedSecret = sharedSecret
    try {
      const profile = await this.authRequest(session.username, session.serverId, sharedSecret, session.publicKey)
      session.uuid = profile.id
      session.profile = profile
      session.login()
    } catch (err) {
      console.log(err)
      session.disconnect(err.message)
      return
    }
  }

  authRequest(username, serverId, sharedSecret, publicKey) {
    return new Promise((resolve, reject) => {
      yggserver.hasJoined(username, serverId, sharedSecret, publicKey, (err, profile) => {
        if (err) reject('Failed to verify username!')
        profile.id = profile.id.replace(/(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/, "$1-$2-$3-$4-$5")
        resolve(profile)
      })
    })
  }
}

module.exports = LoginPacketHandler