const Entity = require('./Entity')

class EntityLiving extends Entity {
  constructor(server, uuid) {
    super(server, uuid)
    this.uuid = uuid
    this.health = 20.0
    this.ai = true
  }
}

module.exports = EntityLiving