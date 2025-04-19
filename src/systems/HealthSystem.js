import Phaser from 'phaser';

export default class HealthSystem {
  constructor(scene, zombieGroup) {
    this.scene = scene;
    this.zombieGroup = zombieGroup;
    this.collisionSetup = false; // Track if overlap is set
  }

  init(ecs) {
    this.ecs = ecs;
  }

  setupCollisions() {
    // Find player entity
    const playerEntities = this.ecs.queryManager.getEntitiesWith('entityType', 'sprite', 'health', entityId => {
      return this.ecs.getComponent(entityId, 'entityType').type === 'player';
    });

    if (playerEntities.size === 0) return;

    const playerId = [...playerEntities][0];
    const playerSprite = this.ecs.getComponent(playerId, 'sprite').phaserSprite;

    // Set up overlap for player-zombie collisions
    this.scene.physics.add.overlap(
      playerSprite,
      this.zombieGroup,
      () => {
        this.handlePlayerZombieCollision(playerId);
      },
      null,
      this
    );

    this.collisionSetup = true;
  }

  handlePlayerZombieCollision(playerId) {
    const health = this.ecs.getComponent(playerId, 'health');

    // Only apply damage if not invincible
    if (!health.isInvincible) {
      health.current = Math.max(0, health.current - 10); // Reduce by 10, min 0
      health.invincibilityTimer = 1000; // 1s invincibility
      this.ecs.emit('healthChanged', { entityId: playerId, health: health.current });
    }
  }

  update(ecs) {
    // Setup collisions once zombies are available
    if (!this.collisionSetup && this.zombieGroup.getLength() > 0) {
      this.setupCollisions();
    }

    // Update invincibility timers
    const entities = ecs.queryManager.getEntitiesWith('health');
    entities.forEach(entityId => {
      const health = ecs.getComponent(entityId, 'health');
      if (health.invincibilityTimer > 0) {
        health.invincibilityTimer -= this.scene.sys.game.loop.delta; // Decrease by frame time (ms)
        if (health.invincibilityTimer < 0) health.invincibilityTimer = 0;
      }
    });
  }
}