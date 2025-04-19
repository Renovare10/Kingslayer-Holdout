export class BulletSystem {
  constructor(scene) {
    this.scene = scene;
  }

  update(ecs) {
    const bulletEntities = ecs.queryManager.getEntitiesWith('entityType', 'movement', 'angle', 'physicsBody', entityId => {
      return ecs.getComponent(entityId, 'entityType').type === 'bullet';
    });

    bulletEntities.forEach(bulletId => {
      const movement = ecs.getComponent(bulletId, 'movement');
      const angle = ecs.getComponent(bulletId, 'angle').value;
      const body = ecs.getComponent(bulletId, 'physicsBody').body;

      // Set velocity based on angle and speed
      const speed = movement.speed;
      body.setVelocity(
        Math.cos(angle) * speed,
        Math.sin(angle) * speed
      );
    });
  }
}