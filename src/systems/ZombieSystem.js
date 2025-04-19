import createZombie from '../entities/Zombie.js';

export default class ZombieSystem {
  constructor(scene, zombieGroup) {
    this.scene = scene;
    this.zombieGroup = zombieGroup;
    this.spawnTimer = 0;
    this.spawnInterval = 2000; // Spawn every 2s
  }

  update(ecs) {
    this.ecs = ecs;
    this.updateSpawnTimer();
    this.moveZombiesTowardPlayer();
  }

  updateSpawnTimer() {
    this.spawnTimer += this.scene.sys.game.loop.delta;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnZombie();
      this.spawnTimer = 0;
    }
  }

  spawnZombie() {
    const playerEntities = this.ecs.queryManager.getEntitiesWith('entityType', 'position', entityId => {
      const entityType = this.ecs.getComponent(entityId, 'entityType');
      return entityType && entityType.type === 'player';
    });

    if (playerEntities.size === 0) {
      return;
    }

    const playerId = [...playerEntities][0];
    const playerPos = this.ecs.getComponent(playerId, 'position');
    const distance = 800; // Spawn 800 units away
    const angle = Phaser.Math.Between(0, 360) * (Math.PI / 180); // Random angle in radians
    const x = playerPos.x + Math.cos(angle) * distance;
    const y = playerPos.y + Math.sin(angle) * distance;

    createZombie(this.ecs, this.scene, x, y, this.zombieGroup);
  }

  moveZombiesTowardPlayer() {
    const playerEntities = this.ecs.queryManager.getEntitiesWith('entityType', 'position', entityId => {
      const entityType = this.ecs.getComponent(entityId, 'entityType');
      return entityType && entityType.type === 'player';
    });

    if (playerEntities.size === 0) {
      return;
    }

    const playerId = [...playerEntities][0];
    const playerPos = this.ecs.getComponent(playerId, 'position');

    const zombieEntities = this.ecs.queryManager.getEntitiesWith('entityType', 'movement', 'position', 'physicsBody', entityId => {
      const entityType = this.ecs.getComponent(entityId, 'entityType');
      return entityType && entityType.type === 'zombie';
    });

    zombieEntities.forEach(zombieId => {
      const zombiePos = this.ecs.getComponent(zombieId, 'position');
      const movement = this.ecs.getComponent(zombieId, 'movement');
      const body = this.ecs.getComponent(zombieId, 'physicsBody').body;

      // Calculate angle to player every frame
      const angle = Phaser.Math.Angle.Between(zombiePos.x, zombiePos.y, playerPos.x, playerPos.y);

      // Calculate target velocity
      const velocityX = Math.cos(angle) * movement.speed;
      const velocityY = Math.sin(angle) * movement.speed;

      // Set velocity
      body.setVelocity(velocityX, velocityY);
    });
  }
}