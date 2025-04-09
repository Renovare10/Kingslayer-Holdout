export class BulletSystem {
  constructor(scene) {
    this.scene = scene;
  }

  init(ecs) {
    this.ecs = ecs;
  }

  initEntity(entityId, ecs) {
    const spriteComp = ecs.getComponent(entityId, 'sprite');
    if (spriteComp && ecs.getComponent(entityId, 'bullet')) {
      if (spriteComp.phaserSprite) spriteComp.phaserSprite.destroy();
      const position = ecs.getComponent(entityId, 'position');
      spriteComp.phaserSprite = this.scene.add.rectangle(
        position.x,
        position.y,
        14, 3,
        0x000000
      ).setOrigin(0.5);
    }
  }

  update(ecs) {
    const bullets = ecs.queryManager.getEntitiesWith('bullet', 'position', 'movement', 'sprite');
    const currentTime = Date.now();

    bullets.forEach(entityId => {
      const bullet = ecs.getComponent(entityId, 'bullet');
      const position = ecs.getComponent(entityId, 'position');
      const movement = ecs.getComponent(entityId, 'movement');
      const sprite = ecs.getComponent(entityId, 'sprite').phaserSprite;

      position.x += movement.velocity.x * (this.scene.game.loop.delta / 1000);
      position.y += movement.velocity.y * (this.scene.game.loop.delta / 1000);
      sprite.setPosition(position.x, position.y);

      sprite.setRotation(Phaser.Math.Angle.Between(0, 0, movement.velocity.x, movement.velocity.y));

      if (currentTime - bullet.createdAt >= bullet.lifespan) {
        ecs.destroyEntity(entityId);
      }
    });
  }
}