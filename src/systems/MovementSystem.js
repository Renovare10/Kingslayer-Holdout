export default class MovementSystem {
  constructor(scene) {
    this.scene = scene;
    this.playerId = null;
  }

  update(ecs) {
    const playerPos = this.getPlayerPosition(ecs);
    if (!playerPos) return;

    const zombieEntities = ecs.queryManager.getEntitiesWith(
      'entityType',
      'movement',
      'position',
      'physicsBody',
      (id) => ecs.getComponent(id, 'entityType')?.type === 'zombie'
    );

    zombieEntities.forEach((zombieId) => {
      const position = ecs.getComponent(zombieId, 'position');
      const movement = ecs.getComponent(zombieId, 'movement');
      const body = ecs.getComponent(zombieId, 'physicsBody').body;

      const angle = Phaser.Math.Angle.Between(
        position.x,
        position.y,
        playerPos.x,
        playerPos.y
      );

      movement.velocity.x = Math.cos(angle) * movement.speed;
      movement.velocity.y = Math.sin(angle) * movement.speed;

      body.setVelocity(movement.velocity.x, movement.velocity.y);
    });
  }

  getPlayerPosition(ecs) {
    if (!this.playerId) {
      const playerEntities = ecs.queryManager.getEntitiesWith(
        'entityType',
        'position',
        (id) => ecs.getComponent(id, 'entityType')?.type === 'player'
      );
      if (playerEntities.size === 0) return null;
      this.playerId = [...playerEntities][0];
    }
    return ecs.getComponent(this.playerId, 'position');
  }
}