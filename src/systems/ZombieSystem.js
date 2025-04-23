import createZombie from '../entities/Zombie.js';
import createFastZombie from '../entities/FastZombie.js';

// Manages zombie spawning, movement, and respawning with a dynamic spawn rate.
export default class ZombieSystem {
  constructor(scene, zombieGroup, gameState) {
    this.scene = scene;
    this.zombieGroup = zombieGroup;
    this.gameState = gameState;
    this.spawnTimer = 0;
  }

  // Updates spawn timer, zombie movement, and respawn logic.
  update(ecs) {
    this.ecs = ecs;
    this.updateSpawnTimer();
    this.moveZombiesTowardPlayer();
    this.handleZombieRespawn();
  }

  // Increments spawn timer and triggers spawning if ready.
  updateSpawnTimer() {
    const settings = this.gameState.getSettings();
    if (this.isMaxZombiesReached(settings)) return;
    this.spawnTimer += this.scene.sys.game.loop.delta;
    if (this.spawnTimer >= this.getSpawnInterval()) {
      this.trySpawnZombie();
    }
  }

  // Checks if the zombie cap is reached.
  isMaxZombiesReached(settings) {
    return this.zombieGroup.countActive() >= settings.maxZombies;
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
    const progress = Math.min(this.gameState.gameTime / maxTime, 1);
    return (1 - progress) ** 2;
  }

  // Calculates the sine wave offset for spawn interval variation.
  getSineWaveOffset() {
    const period = 20; // 20s period
    const amplitude = 1.25 * 1000; // ±1.25s
    const wave = Math.sin((this.gameState.gameTime * 2 * Math.PI) / period);
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

  // Gets the player’s velocity for respawn bias.
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

  // Calculates a spawn position using GameState settings.
  getSpawnPosition() {
    const playerPos = this.getPlayerPosition();
    if (!playerPos) return null;
    const settings = this.gameState.getSettings();
    const distance = settings.initialSpawnDistance;
    const angle = Phaser.Math.Between(0, 360) * (Math.PI / 180);
    return {
      x: playerPos.x + Math.cos(angle) * distance,
      y: playerPos.y + Math.sin(angle) * distance,
    };
  }

  // Calculates a respawn position using GameState settings.
  getRespawnPosition(playerPos) {
    const settings = this.gameState.getSettings();
    const playerVelocity = this.getPlayerVelocity();
    const distance = settings.respawnDistance;
    let angle;

    // If player is moving, bias the spawn angle toward their heading
    const velocityMagnitude = Math.sqrt(playerVelocity.x ** 2 + playerVelocity.y ** 2);
    if (velocityMagnitude > 0) {
      const headingAngle = Math.atan2(playerVelocity.y, playerVelocity.x);
      // Add a random offset (±45 degrees) around the heading for variation
      const offset = Phaser.Math.Between(-45, 45) * (Math.PI / 180);
      angle = headingAngle + offset;
    } else {
      // If player isn't moving, spawn randomly around them
      angle = Phaser.Math.Between(0, 360) * (Math.PI / 180);
    }

    return {
      x: playerPos.x + Math.cos(angle) * distance,
      y: playerPos.y + Math.sin(angle) * distance,
    };
  }

  // Spawns a single zombie with settings from GameState.
  spawnSingleZombie(x, y) {
    const settings = this.gameState.getSettings();
    const isFastZombie = Math.random() < settings.fastZombieChance;
    const createFunction = isFastZombie ? createFastZombie : createZombie;
    const zombieId = createFunction(this.ecs, this.scene, x, y, this.zombieGroup);
    const sprite = this.ecs.getComponent(zombieId, 'sprite').phaserSprite;
    sprite.setAlpha(0); // Start invisible
    this.scene.tweens.add({
      targets: sprite,
      alpha: 1,
      duration: settings.fadeInDuration, // Fade in over 0.5 seconds
      ease: 'Linear',
    });
  }

  // Determines if a cluster should spawn.
  shouldSpawnCluster() {
    const settings = this.gameState.getSettings();
    return Math.random() < settings.clusterChance && !this.isMaxZombiesReached(settings);
  }

  // Calculates the number of zombies to spawn in a cluster.
  getClusterSize() {
    const settings = this.gameState.getSettings();
    const clusterSize = Phaser.Math.Between(settings.clusterSizeMin, settings.clusterSizeMax);
    const availableSlots = settings.maxZombies - this.zombieGroup.countActive();
    return Math.min(clusterSize, availableSlots);
  }

  // Spawns a cluster of zombies around the base position.
  spawnCluster(baseX, baseY) {
    const settings = this.gameState.getSettings();
    const zombiesToSpawn = this.getClusterSize();
    for (let i = 0; i < zombiesToSpawn; i++) {
      const offsetAngle = Phaser.Math.Between(0, 360) * (Math.PI / 180);
      const offsetDistance = Phaser.Math.Between(0, settings.clusterRadius);
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

  // Handles despawning and respawning zombies too far from the player.
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
        // Despawn the zombie
        this.ecs.destroyEntity(zombieId);

        // Respawn a new zombie closer, biased toward player heading
        if (!this.isMaxZombiesReached(settings)) {
          const respawnPos = this.getRespawnPosition(playerPos);
          this.spawnSingleZombie(respawnPos.x, respawnPos.y);
        }
      }
    });
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