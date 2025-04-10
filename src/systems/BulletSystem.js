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
    const bullets = ecs.queryManager.getEntitiesWith(
      'bullet', 'position', 'movement', 'sprite', 'entityType',
      id => this.ecs.getComponent(id, 'entityType')?.type === 'bullet'
    );
    const currentTime = Date.now();

    bullets.forEach(entityId => {
      const bullet = ecs.getComponent(entityId, 'bullet');
      if (!bullet) return;

      this.moveBullet(entityId, ecs);
      this.rotateBullet(entityId, ecs);
      if (!this.checkCollisions(entityId, ecs)) {
        this.checkBulletLifespan(entityId, ecs, currentTime);
      }
    });
  }

  moveBullet(entityId, ecs) {
    const position = ecs.getComponent(entityId, 'position');
    const movement = ecs.getComponent(entityId, 'movement');
    const sprite = ecs.getComponent(entityId, 'sprite').phaserSprite;

    position.x += movement.velocity.x * (this.scene.game.loop.delta / 1000);
    position.y += movement.velocity.y * (this.scene.game.loop.delta / 1000);
    sprite.setPosition(position.x, position.y);
  }

  rotateBullet(entityId, ecs) {
    const movement = ecs.getComponent(entityId, 'movement');
    const sprite = ecs.getComponent(entityId, 'sprite').phaserSprite;

    sprite.setRotation(
      Phaser.Math.Angle.Between(0, 0, movement.velocity.x, movement.velocity.y)
    );
  }

  checkBulletLifespan(entityId, ecs, currentTime) {
    const bullet = ecs.getComponent(entityId, 'bullet');
    if (currentTime - bullet.createdAt >= bullet.lifespan) {
      ecs.destroyEntity(entityId);
    }
  }

  checkCollisions(entityId, ecs) {
    const bulletPos = ecs.getComponent(entityId, 'position');
    const zombies = ecs.queryManager.getEntitiesWith(
      'position', 'entityType',
      entity => entity.entityType?.type === 'zombie'
    );

    console.log(`Checking bullet ${entityId} at (${bulletPos.x}, ${bulletPos.y}), found ${zombies.size} zombies`);

    for (const zombieId of zombies) {
      const zombiePos = ecs.getComponent(zombieId, 'position');
      const distance = Phaser.Math.Distance.Between(
        bulletPos.x,
        bulletPos.y,
        zombiePos.x,
        zombiePos.y
      );

      console.log(`Zombie ${zombieId} at (${zombiePos.x}, ${zombiePos.y}), distance: ${distance}`);

      if (distance < 50) { // Increased to 50 for testing
        console.log(`Hit! Destroying zombie ${zombieId} and bullet ${entityId}`);
        ecs.destroyEntity(zombieId);
        ecs.destroyEntity(entityId);
        return true;
      }
    }
    return false;
  }
}