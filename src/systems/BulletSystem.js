export class BulletSystem {
  constructor(scene) {
    this.scene = scene;
  }

  update(ecs) {
    this.ecs = ecs;
    const bulletEntities = ecs.queryManager.getEntitiesWith('entityType', 'movement', 'angle', 'physicsBody', 'sprite', 'lifespan', entityId => {
      return ecs.getComponent(entityId, 'entityType').type === 'bullet';
    });

    const zombieEntities = ecs.queryManager.getEntitiesWith('entityType', 'physicsBody', 'sprite', entityId => {
      return ecs.getComponent(entityId, 'entityType').type === 'zombie';
    });

    bulletEntities.forEach(bulletId => {
      const movement = ecs.getComponent(bulletId, 'movement');
      const angle = ecs.getComponent(bulletId, 'angle').value;
      const bulletBody = ecs.getComponent(bulletId, 'physicsBody').body;
      const bulletSprite = ecs.getComponent(bulletId, 'sprite').phaserSprite;
      const lifespan = ecs.getComponent(bulletId, 'lifespan');

      // Check lifespan
      const elapsedTime = this.scene.time.now - lifespan.createdAt;
      if (elapsedTime >= lifespan.duration) {
        this.ecs.destroyEntity(bulletId);
        return; // Skip further processing for this bullet
      }

      // Move bullet
      const speed = movement.speed;
      bulletBody.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );

      // Check collisions with zombies
      zombieEntities.forEach(zombieId => {
        const zombieSprite = ecs.getComponent(zombieId, 'sprite').phaserSprite;
        this.scene.physics.add.overlap(bulletSprite, zombieSprite, () => {
          // Destroy both bullet and zombie on collision
          this.ecs.destroyEntity(bulletId);
          this.ecs.destroyEntity(zombieId);
        });
      });
    });
  }
}