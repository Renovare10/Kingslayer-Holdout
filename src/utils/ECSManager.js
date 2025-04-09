import QueryManager from './QueryManager.js';

export default class ECSManager {
  constructor() {
    this.entities = new Map();
    this.components = new Map();
    this.systems = [];
    this.queryManager = new QueryManager(this);
    this.nextId = 1;
    this.events = new Map(); // Event listeners
  }

  createEntity() {
    const id = this.nextId++;
    this.entities.set(id, {});
    return id;
  }

  addComponent(entityId, componentName, componentData) {
    if (!this.entities.has(entityId)) {
      throw new Error(`Entity ${entityId} does not exist`);
    }
    if (!this.components.has(entityId)) {
      this.components.set(entityId, {});
    }
    this.components.get(entityId)[componentName] = componentData;
    this.queryManager.indexComponent(entityId, componentName);
    this.initEntity(entityId);
  }

  removeComponent(entityId, componentName) {
    if (this.components.has(entityId) && componentName in this.components.get(entityId)) {
      delete this.components.get(entityId)[componentName];
      this.queryManager.unindexComponent(entityId, componentName);
    }
  }

  destroyEntity(entityId) {
    if (this.entities.has(entityId)) {
      const components = this.components.get(entityId) || {};
      if (components.sprite && components.sprite.phaserSprite) {
        components.sprite.phaserSprite.destroy();
      }
      for (const componentName in components) {
        this.queryManager.unindexComponent(entityId, componentName);
      }
      this.entities.delete(entityId);
      this.components.delete(entityId);
    }
  }

  getComponent(entityId, componentName) {
    return this.components.get(entityId)?.[componentName];
  }

  addSystem(system) {
    this.systems.push(system);
    if (system.init) {
      system.init(this);
    }
  }

  update() {
    this.systems.forEach(system => system.update(this));
  }

  initEntity(entityId) {
    this.systems.forEach(system => {
      if (system.initEntity) {
        system.initEntity(entityId, this);
      }
    });
  }

  emit(eventName, data) {
    if (this.events.has(eventName)) {
      this.events.get(eventName).forEach(callback => callback(data));
    }
  }

  on(eventName, callback) {
    if (!this.events.has(eventName)) this.events.set(eventName, new Set());
    this.events.get(eventName).add(callback);
  }
}