/**
 * System to manage XP entities, handling despawn.
 */
export default class XPSystem {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Updates XP entities, despawning those past their lifespan.
   * @param {Object} ecs - ECSManager instance.
   */
  update(ecs) {
    const xpEntities = ecs.queryManager.getEntitiesWith('xp');
    const currentTime = performance.now();

    for (const entityId of xpEntities) {
      const xp = ecs.getComponent(entityId, 'xp');
      if (!xp) continue;

      if (currentTime > xp.createdAt + xp.lifespan) {
        ecs.destroyEntity(entityId);
      }
    }
  }
}