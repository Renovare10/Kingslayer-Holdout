export default class ZombieSystem {
  constructor(scene, zombieGroup, gameState) {
    this.scene = scene;
    this.zombieGroup = zombieGroup;
    this.gameState = gameState;
  }

  update(ecs) {
    this.ecs = ecs;
    this.handleZombieRespawn();
  }

  getPlayerPosition() {
    const playerEntities = this.ecs.queryManager.getEntitiesWith(
      'entityType',
      'position',
      (id) => this.ecs.getComponent(id, 'entityType')?.type === 'player'
    );
    if (playerEntities.size === 0) return null;
    const playerId = [...playerEntities][0];
    return this.ecs.getComponent(playerId, 'position');
  }

  getPlayerVelocity() {
    const playerEntities = this.ecs.queryManager.getEntitiesWith(
      'entityType',
      'movement',
      (id) => this.ecs.getComponent(id, 'entityType')?.type === 'player'
    );
    if (playerEntities.size === 0) return { x: 0, y: 0 };
    const playerId = [...playerEntities][0];
    return this.ecs.getComponent(playerId, 'movement').velocity;
  }

  getRespawnPosition(playerPos) {
    const settings = this.gameState.getSettings();
    const playerVelocity = this.getPlayerVelocity();
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

  handleZombieRespawn() {
    const settings = this.gameState.getSettings();
    const playerPos = this.getPlayerPosition();
    if (!playerPos) return;

    const zombieEntities = this.getZombieEntities();
    zombieEntities.forEach((zombieId) => {
      const zombiePos = this.ecs.getComponent(zombieId, 'position');
      const distance = Phaser.Math.Distance.Between(
        playerPos.x,
        playerPos.y,
        zombiePos.x,
        zombiePos.y
      );

      if (distance > settings.despawnDistance) {
        this.ecs.destroyEntity(zombieId);
        if (this.zombieGroup.countActive() < settings.maxZombies) {
          const respawnPos = this.getRespawnPosition(playerPos);
          this.ecs.emit('spawnZombie', { x: respawnPos.x, y: respawnPos.y });
        }
      }
    });
  }

  getZombieEntities() {
    return this.ecs.queryManager.getEntitiesWith(
      'entityType',
      'movement',
      'position',
      'physicsBody',
      (id) => this.ecs.getComponent(id, 'entityType')?.type === 'zombie'
    );
  }
}