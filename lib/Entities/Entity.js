class Entity {
  constructor(server, uuid) {
    this.id = 0
    this.uuid = uuid
    this.server = server
    this.location = { x: 0, y: 0, z: 0 }
  }
}

module.exports = Entity