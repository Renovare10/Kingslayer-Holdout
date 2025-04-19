import createBullet from '../entities/Bullet.js';

export default class PlayerShootingSystem {
  constructor(scene, bulletGroup) {
    this.scene = scene;
    this.bulletGroup = bulletGroup;
    this.scene.input.on('pointerdown', (pointer) => {
      this.handleClick(pointer);
    });
  }

  update(ecs) {
    this.ecs = ecs;
  }

  handleClick(pointer) {
    if (!this.ecs) {
      return;
    }

    const playerEntities = this.ecs.queryManager.getEntitiesWith('entityType', 'sprite', entityId => {
      const entityType = this.ecs.getComponent(entityId, 'entityType');
      return entityType && entityType.type === 'player';
    });

    if (playerEntities.size === 0) {
      return;
    }

    playerEntities.forEach(playerId => {
      const sprite = this.ecs.getComponent(playerId, 'sprite').phaserSprite;
      // Convert mouse click to world coordinates
      const worldPoint = this.scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
      // Calculate angle to mouse click in world space
      const angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, worldPoint.x, worldPoint.y);
      createBullet(this.ecs, this.scene, sprite.x, sprite.y, angle, 3500, this.bulletGroup);
    });
  }
}