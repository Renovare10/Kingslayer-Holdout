export class ZombieSystem {
  constructor(scene) {
    this.scene = scene;
    this.ecs = null;
    this.spawnTimer = 0;
    this.spawnInterval = 2;
    this.spawnDistance = 800;
    this.zombieSpeed = 100;
  }

  async init(ecs) {
    this.ecs = ecs;
    const { createZombie } = await import('../entities/Zombie.js');
    this.createZombie = createZombie;
  }

  update(ecs) {
    const deltaSeconds = this.scene.game.loop.delta / 1000;

    // Find player position
    const playerEntities = ecs.queryManager.getEntitiesWith('player');
    let playerPos = null;
    if (playerEntities.size > 0) {
      const playerId = playerEntities.values().next().value;
      playerPos = ecs.getComponent(playerId, 'position');
    }

    if (!playerPos) return;

    // Spawn zombies
    this.spawnTimer += deltaSeconds;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnZombie(playerPos);
      this.spawnTimer = 0;
    }

    // Move zombies toward player
    const zombieEntities = ecs.queryManager.getEntitiesWith('zombie');
    zombieEntities.forEach(entityId => {
      const pos = ecs.getComponent(entityId, 'position');
      const move = ecs.getComponent(entityId, 'movement');

      const dx = playerPos.x - pos.x;
      const dy = playerPos.y - pos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 0) {
        const velocityX = (dx / distance) * this.zombieSpeed;
        const velocityY = (dy / distance) * this.zombieSpeed;

        pos.x += velocityX * deltaSeconds;
        pos.y += velocityY * deltaSeconds;

        move.velocity.x = velocityX;
        move.velocity.y = velocityY;
      }
    });
  }

  async spawnZombie(playerPos) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    const x = playerPos.x + Math.cos(angle) * this.spawnDistance;
    const y = playerPos.y + Math.sin(angle) * this.spawnDistance;
    this.createZombie(this.ecs, this.scene, x, y);
  }
}