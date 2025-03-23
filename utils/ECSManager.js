export default class ECSManager {
  constructor() {
      this.entities = new Map();
      this.components = new Map();
      this.systems = [];
  }

  createEntity() {
      const id = this.entities.size + 1;
      this.entities.set(id, {});
      return id;
  }

  addComponent(entityId, componentName, componentData) {
      if (!this.components.has(entityId)) {
          this.components.set(entityId, {});
      }
      this.components.get(entityId)[componentName] = componentData;
      this.initEntity(entityId);
  }

  getComponent(entityId, componentName) {
      return this.components.get(entityId)?.[componentName];
  }

  addSystem(system) {
      this.systems.push(system);
  }

  update() {
      this.systems.forEach(system => system.update(this.entities, this.components));
  }

  initEntity(entityId) {
    this.systems.forEach(system => {
        if (system.initEntity) {
            system.initEntity(entityId, this.entities, this.components);
        }
    });
  }
}