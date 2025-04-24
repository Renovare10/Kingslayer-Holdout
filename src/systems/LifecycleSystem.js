export default class LifecycleSystem {
  constructor(scene, zombieGroup, gameState) {
    this.scene = scene;
    this.zombieGroup = zombieGroup;
    this.gameState = gameState;
  }

  update(ecs) {
    const playerPos = this.getPlayerPosition(ecs);
    if (!playerPos) return;

    const zombieEntities = ecs.queryManager.getEntitiesWith(
      'entityType',
      'position',
      'lifecycle',
      (id) => ecs.getComponent(id, 'entityType')?.type === 'zombie'
    );

    zombieEntities.forEach((zombieId) => {
      const position = ecs.getComponent(zombieId, 'position');
      const lifecycle = ecs.getComponent(zombieId, 'lifecycle');

      const distance = Phaser.Math.Distance.Between(
        playerPos.x,
        playerPos.y,
        position.x,
        position.y
      );

      if (distance > lifecycle.despawnDistance) {
        ecs.destroyEntity(zombieId);
        if (this.zombieGroup.countActive() < lifecycle.maxZombies) {
          const respawnPos = this.getRespawnPosition(playerPos, ecs);
          ecs.emit('spawnZombie', { x: respawnPos.x, y: respawnPos.y });
        }
      }
    });
  }

  getPlayerPosition(ecs) {
    const playerEntities = ecs.queryManager.getEntitiesWith(
      'entityType',
      'position',
      (id) => ecs.getComponent(id, 'entityType')?.type === 'player'
    );
    if (playerEntities.size === 0) return null;
    const playerId = [...playerEntities][0];
    return ecs.getComponent(playerId, 'position');
  }

  getPlayerVelocity(ecs) {
    const playerEntities = ecs.queryManager.getEntitiesWith(
      'entityType',
      'movement',
      (id) => ecs.getComponent(id, 'entityType')?.type === 'player'
    );
    if (playerEntities.size === 0) return { x: 0, y: 0 };
    const playerId = [...playerEntities][0];
    return ecs.getComponent(playerId, 'movement').velocity;
  }

  getRespawnPosition(playerPos, ecs) {
    const settings = this.gameState.getSettings();
    const playerVelocity = this.getPlayerVelocity(ecs);
    const distance = settings.respawnDistance;
    let angle;

    const velocityMagnitude = Math.sqrt(playerVelocity.x ** 2 + playerVelocity.y ** 2);
    if (velocityMagnitude > 0) {
      const headingAngle = Math.atan2(playerVelocity.y, playerVelocity.x);
      const offset = Phaser.Math.Between(-45, 45) * (Math.PI / 180);
      angle = headingAngle + offset;
    } else {
      angle = Phaser.Math.Between(0, 360) * (Math.PI / 180);
    }

    return {
      x: playerPos.x + Math.cos(angle) * distance,
      y: playerPos.y + Math.sin(angle) * distance,
    };
  }
}