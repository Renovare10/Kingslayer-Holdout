import createBullet from '../entities/Bullet.js';

export class PlayerShootingSystem {
  constructor(scene) {
    this.scene = scene;
    this.scene.input.on('pointerdown', (pointer) => this.handleClick(pointer));
  }

  update(ecs) {
    this.ecs = ecs;
  }

  handleClick(pointer) {
    const playerEntities = this.ecs.queryManager.getEntitiesWith('entityType', 'sprite', entityId => {
      return this.ecs.getComponent(entityId, 'entityType').type === 'player';
    });

    playerEntities.forEach(playerId => {
      const sprite = this.ecs.getComponent(playerId, 'sprite').phaserSprite;
      // Convert mouse click to world coordinates
      const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
      // Calculate angle to mouse click in world space
      const angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, worldPoint.x, worldPoint.y);
      createBullet(this.ecs, this.scene, sprite.x, sprite.y, angle);
    });
  }
}