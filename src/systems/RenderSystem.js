// src/systems/RenderSystem.js
export default class RenderSystem {
  constructor(scene) {
    this.scene = scene;
  }

  init(ecs) {
    this.ecs = ecs;
  }

  initEntity(entityId, ecs) {
    const sprite = ecs.getComponent(entityId, 'sprite');
    if (sprite && sprite.phaserSprite) {
      sprite.phaserSprite.setDepth(1);
    }
  }

  update(ecs) {
    const entities = ecs.queryManager.getEntitiesWith('position', 'sprite');
    for (const entityId of entities) {
      const position = ecs.getComponent(entityId, 'position');
      const sprite = ecs.getComponent(entityId, 'sprite');
      const physicsBody = ecs.getComponent(entityId, 'physicsBody');

      // Skip position update for physics-enabled entities
      if (!physicsBody) {
        sprite.phaserSprite.x = position.x;
        sprite.phaserSprite.y = position.y;
      }
    }
  }
}