import Flash from '../components/Flash.js'; // Add this import

export default class HealthSystem {
  constructor(scene, zombieGroup) {
    this.scene = scene;
    this.zombieGroup = zombieGroup;
  }

  update(ecs) {
    this.ecs = ecs;
    const playerEntities = this.ecs.queryManager.getEntitiesWith('entityType', 'health', 'sprite', entityId => {
      return this.ecs.getComponent(entityId, 'entityType').type === 'player';
    });

    playerEntities.forEach(playerId => {
      const health = this.ecs.getComponent(playerId, 'health');
      const playerSprite = this.ecs.getComponent(playerId, 'sprite').phaserSprite;

      // Update invincibility timer
      if (health.invincibilityTimer > 0) {
        health.invincibilityTimer -= this.scene.game.loop.delta;
        if (health.invincibilityTimer < 0) health.invincibilityTimer = 0;
      }

      // Check for collisions with zombies
      if (health.invincibilityTimer <= 0) {
        this.scene.physics.world.overlap(playerSprite, this.zombieGroup, () => {
          health.current -= 10;
          health.invincibilityTimer = 1000; // 1 second invincibility
          
          // Add Flash component for visual feedback
          ecs.addComponent(playerId, 'flash', new Flash(1000, 100)); // 1s flash, toggle every 100ms

          if (health.current <= 0) {
            health.current = 0;
            this.ecs.emit('gameOver');
          }
          this.ecs.emit('healthChanged', { health: health.current });
        });
      }
    });
  }
}