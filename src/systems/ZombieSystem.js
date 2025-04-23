import createZombie from '../entities/Zombie.js';
import createFastZombie from '../entities/FastZombie.js';

// Manages zombie spawning and movement with a dynamic spawn rate.
export default class ZombieSystem {
  constructor(scene, zombieGroup) {
    this.scene = scene;
    this.zombieGroup = zombieGroup;
    this.spawnTimer = 0;
    this.gameTime = 0; // Total game time in seconds
    this.maxZombies = 150; // Maximum active zombies
  }

  // Updates spawn timer and zombie movement.
  update(ecs) {
    this.ecs = ecs;
    this.gameTime += this.scene.sys.game.loop.delta / 1000;
    this.updateSpawnTimer();
    this.moveZombiesTowardPlayer();
  }

  // Increments spawn timer and triggers spawning if ready.
  updateSpawnTimer() {
    if (this.isMaxZombiesReached()) return;
    this.spawnTimer += this.scene.sys.game.loop.delta;
    if (this.spawnTimer >= this.getSpawnInterval()) {
      this.trySpawnZombie();
    }
  }

  // Checks if the zombie cap is reached.
  isMaxZombiesReached() {
    return this.zombieGroup.countActive() >= this.maxZombies;
  }

  // Spawns a zombie and possibly a cluster, resetting the timer.
  trySpawnZombie() {
    const spawnPos = this.getSpawnPosition();
    if (!spawnPos) return;
    this.spawnSingleZombie(spawnPos.x, spawnPos.y);
    if (this.shouldSpawnCluster()) {
      this.spawnCluster(spawnPos.x, spawnPos.y);
    }
    this.spawnTimer = 0;
  }

  // Calculates the dynamic spawn interval with quadratic and sine wave components.
  getSpawnInterval() {
    const baseInterval = this.getBaseInterval();
    return Math.max(200, baseInterval + this.getSineWaveOffset());
  }

  // Calculates the quadratic base interval (2s to 0.5s over 5 minutes).
  getBaseInterval() {
    const quadraticFactor = this.getQuadraticFactor();
    const minInterval = 500; // 0.5s
    const maxInterval = 2000; // 2s
    return minInterval + (maxInterval - minInterval) * quadraticFactor;
  }

  // Computes the quadratic factor for the spawn interval curve.
  getQuadraticFactor() {
    const maxTime = 300; // 5 minutes in seconds
    const progress = Math.min(this.gameTime / maxTime, 1);
    return (1 - progress) ** 2;
  }

  // Calculates the sine wave offset for spawn interval variation.
  getSineWaveOffset() {
    const period = 20; // 20s period
    const amplitude = 1.25 * 1000; // ±1.25s
    const wave = Math.sin((this.gameTime * 2 * Math.PI) / period);
    const normalized = (wave + 1) / 2; // Map to 0-1
    const scaled = Math.pow(normalized, 3); // Slow buildup, sharp decline
    return (scaled * 2 - 1) * amplitude; // Map back to -1 to 1
  }

  // Gets the player’s position for spawning and movement.
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

  // Calculates a spawn position 1500 units from the player.
  getSpawnPosition() {
    const playerPos = this.getPlayerPosition();
    if (!playerPos) return null;
    const distance = 1500;
    const angle = Phaser.Math.Between(0, 360) * (Math.PI / 180);
    return {
      x: playerPos.x + Math.cos(angle) * distance,
      y: playerPos.y + Math.sin(angle) * distance,
    };
  }

  // Spawns a single zombie (20% chance for fast zombie) at the given position.
  spawnSingleZombie(x, y) {
    const isFastZombie = Math.random() < 0.2;
    const createFunction = isFastZombie ? createFastZombie : createZombie;
    createFunction(this.ecs, this.scene, x, y, this.zombieGroup);
  }

  // Determines if a cluster should spawn (10% chance).
  shouldSpawnCluster() {
    return Math.random() < 0.1 && !this.isMaxZombiesReached();
  }

  // Calculates the number of zombies to spawn in a cluster (2-5, capped by limit).
  getClusterSize() {
    const clusterSize = Phaser.Math.Between(2, 5);
    const availableSlots = this.maxZombies - this.zombieGroup.countActive();
    return Math.min(clusterSize, availableSlots);
  }

  // Spawns a cluster of zombies around the base position.
  spawnCluster(baseX, baseY) {
    const zombiesToSpawn = this.getClusterSize();
    for (let i = 0; i < zombiesToSpawn; i++) {
      const offsetAngle = Phaser.Math.Between(0, 360) * (Math.PI / 180);
      const offsetDistance = Phaser.Math.Between(0, 200);
      const x = baseX + Math.cos(offsetAngle) * offsetDistance;
      const y = baseY + Math.sin(offsetAngle) * offsetDistance;
      this.spawnSingleZombie(x, y);
    }
  }

  // Moves all zombies toward the player using Position component.
  moveZombiesTowardPlayer() {
    const playerPos = this.getPlayerPosition();
    if (!playerPos) return;

    const zombieEntities = this.getZombieEntities();
    zombieEntities.forEach((zombieId) =>
      this.moveZombieToPlayer(zombieId, playerPos)
    );
  }

  // Queries zombies with required components for movement.
  getZombieEntities() {
    return this.ecs.queryManager.getEntitiesWith(
      'entityType',
      'movement',
      'position',
      'physicsBody',
      (id) => this.ecs.getComponent(id, 'entityType')?.type === 'zombie'
    );
  }

  // Moves a single zombie toward the player using physics velocity.
  moveZombieToPlayer(zombieId, playerPos) {
    const zombiePos = this.ecs.getComponent(zombieId, 'position');
    const movement = this.ecs.getComponent(zombieId, 'movement');
    const body = this.ecs.getComponent(zombieId, 'physicsBody').body;
    const angle = Phaser.Math.Angle.Between(
      zombiePos.x,
      zombiePos.y,
      playerPos.x,
      playerPos.y
    );

    const velocityX = Math.cos(angle) * movement.speed;
    const velocityY = Math.sin(angle) * movement.speed;
    body.setVelocity(velocityX, velocityY);
  }
}