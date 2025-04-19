export default class QueryManager {
  constructor(ecs) {
    this.ecs = ecs;
    this.componentIndex = new Map();
  }

  indexComponent(entityId, componentName) {
    if (!this.componentIndex.has(componentName)) {
      this.componentIndex.set(componentName, new Set());
    }
    this.componentIndex.get(componentName).add(entityId);
  }

  unindexComponent(entityId, componentName) {
    if (this.componentIndex.has(componentName)) {
      this.componentIndex.get(componentName).delete(entityId);
    }
  }

  getEntitiesWith(...args) {
    const componentNames = args.filter(arg => typeof arg === 'string');
    const filter = args.find(arg => typeof arg === 'function') || (() => true);

    if (!this.ecs) {
      throw new Error('QueryManager not initialized with ECS');
    }
    if (componentNames.length === 0) {
      return new Set();
    }

    const sets = componentNames
      .filter(name => this.componentIndex.has(name))
      .map(name => this.componentIndex.get(name));
    
    if (sets.length === 0) {
      return new Set();
    }
    
    return new Set([...sets[0]]
      .filter(id => sets.every(set => set.has(id)))
      .filter(id => filter(id, this.ecs))
    );
  }
}