export default class RenderSystem {
    constructor(scene) {
      this.scene = scene;
    }
  
    update(ecs) {
      ecs.entities.forEach((_, entityId) => {
        const { position, sprite } = ecs.components.get(entityId) || {};
        if (position && sprite && !sprite.phaserSprite) {
          sprite.phaserSprite = this.scene.add.sprite(position.x, position.y, sprite.key).setOrigin(0.5);
        }
      });
    }
  
    initEntity(entityId, entities, components) {
      const { position, sprite } = components.get(entityId) || {};
      if (position && sprite && !sprite.phaserSprite) {
        sprite.phaserSprite = this.scene.add.sprite(position.x, position.y, sprite.key).setOrigin(0.5);
      }
    }
  }