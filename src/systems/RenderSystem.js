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

      if (sprite && sprite.phaserSprite) {
        if (physicsBody) {
          // Sync sprite and ECS position with physics body
          sprite.phaserSprite.x = physicsBody.body.x + physicsBody.body.width * 0.5; // Adjust for origin 0.5
          sprite.phaserSprite.y = physicsBody.body.y + physicsBody.body.height * 0.5;
          position.x = sprite.phaserSprite.x;
          position.y = sprite.phaserSprite.y;
        } else {
          // Sync sprite with ECS position for non-physics entities
          sprite.phaserSprite.x = position.x;
          sprite.phaserSprite.y = position.y;
        }
      }
    }
  }
}