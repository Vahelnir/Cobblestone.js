class EntityManager {
  constructor() {
    this.ids = []
    this.lastId = 0

    this.entities = new Map()
  }

  register(entity) {
    this.entities.put(entity.id, entity)
  }

  unregister(entity) {
    this.entities.delete(entity.id)
  }

  allocate(entity) {
    if(entity.id != 0) throw new Error('Entity already has an ID')
    entity.id = this.lastId += 1
    this.ids.push(entity.id)
  }

  deallocate(entity) {
    if(entity.id === 0) throw new Error('Entity does not have an ID')
    this.ids.remove(entity.id)
  }
}

module.exports = EntityManager