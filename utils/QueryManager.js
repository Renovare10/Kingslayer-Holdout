export default class QueryManager {
  constructor(ecs) {
    this.ecs = ecs; // Reference to ECSManager
    this.componentIndex = new Map(); // componentName -> Set of entityIds
  }

  // Called by ECSManager when adding a component
  indexComponent(entityId, componentName) {
    if (!this.componentIndex.has(componentName)) {
      this.componentIndex.set(componentName, new Set());
    }
    this.componentIndex.get(componentName).add(entityId);
  }

  // Called by ECSManager when removing a component
  unindexComponent(entityId, componentName) {
    this.componentIndex.get(componentName)?.delete(entityId);
  }

  // Query entities with specific components
  getEntitiesWith(...componentNames) {
    if (componentNames.length === 0) return new Set();

    const firstComponent = componentNames[0];
    const initialSet = this.componentIndex.get(firstComponent) || new Set();

    if (componentNames.length === 1) return new Set(initialSet);

    const result = new Set(initialSet);
    for (let i = 1; i < componentNames.length; i++) {
      const componentSet = this.componentIndex.get(componentNames[i]) || new Set();
      for (const entityId of result) {
        if (!componentSet.has(entityId)) {
          result.delete(entityId);
        }
      }
    }
    return result;
  }
}