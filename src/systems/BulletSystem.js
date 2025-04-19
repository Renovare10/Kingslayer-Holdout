export default class BulletSystem {
  constructor(scene, bulletGroup) {
    this.scene = scene;
    this.bulletGroup = bulletGroup;
  }

  update(ecs) {
    this.ecs = ecs;
    const bulletEntities = this.ecs.queryManager.getEntitiesWith(
      'entityType', 'movement', 'angle', 'physicsBody', 'sprite', 'lifespan',
      entityId => {
        const entityType = this.ecs.getComponent(entityId, 'entityType');
        return entityType && entityType.type === 'bullet';
      }
    );

    bulletEntities.forEach(bulletId => {
      const movement = this.ecs.getComponent(bulletId, 'movement');
      const angle = this.ecs.getComponent(bulletId, 'angle').value;
      const bulletBody = this.ecs.getComponent(bulletId, 'physicsBody').body;
      const lifespan = this.ecs.getComponent(bulletId, 'lifespan');

      // Check lifespan
      const elapsedTime = this.scene.time.now - lifespan.createdAt;
      if (elapsedTime >= lifespan.duration) {
        this.ecs.destroyEntity(bulletId);
        return;
      }

      // Move bullet
      const speed = movement.speed;
      bulletBody.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );
    });
  }
}