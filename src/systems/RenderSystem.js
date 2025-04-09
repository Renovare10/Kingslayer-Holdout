export default class RenderSystem {
  constructor(scene) {
    this.scene = scene;
  }

  update(ecs) {
    ecs.entities.forEach((_, entityId) => {
      const { position, sprite, bullet } = ecs.components.get(entityId) || {};
      if (position && sprite && !bullet) { // Skip bullets
        if (!sprite.phaserSprite) {
          sprite.phaserSprite = this.scene.add.sprite(position.x, position.y, sprite.key).setOrigin(0.5);
        } else {
          sprite.phaserSprite.x = position.x;
          sprite.phaserSprite.y = position.y;
        }
      }
    });
  }

  initEntity(entityId, ecs) {
    const { position, sprite, bullet } = ecs.components.get(entityId) || {};
    if (position && sprite && !bullet && !sprite.phaserSprite) { // Skip bullets
      sprite.phaserSprite = this.scene.add.sprite(position.x, position.y, sprite.key).setOrigin(0.5);
    }
  }
}