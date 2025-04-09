import { createBullet } from '../entities/Bullet.js'; // Updated import
import Position from '../components/Position.js';
import Sprite from '../components/Sprite.js';

export class PlayerShootingSystem {
  constructor(scene) {
    this.scene = scene;
    this.shootEventSet = false;
  }

  init(ecs) {
    this.ecs = ecs;
    if (!this.shootEventSet) {
      this.scene.input.on('pointerdown', () => {
        const player = this.ecs.queryManager.getEntitiesWith(
          'shooting', 'entityType',
          id => this.ecs.getComponent(id, 'entityType')?.type === 'player'
        ).values().next().value;
        if (player) {
          this.ecs.emit('shoot', { entityId: player, target: this.scene.input.activePointer });
        }
      });
      this.shootEventSet = true;
    }
    this.ecs.on('shoot', ({ entityId, target }) => this.tryShoot(entityId, target));
  }

  tryShoot(entityId, target) {
    const shooting = this.ecs.getComponent(entityId, 'shooting');
    if (!shooting.enabled || shooting.currentCooldown > 0) return;

    const position = this.ecs.getComponent(entityId, 'position');
    const sprite = this.ecs.getComponent(entityId, 'sprite').phaserSprite;

    const angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, target.worldX, target.worldY);
    const speed = 4000;
    const velocity = {
      x: Math.cos(angle) * speed,
      y: Math.sin(angle) * speed
    };

    createBullet(this.ecs, this.scene, position.x, position.y, velocity);
    
    shooting.currentCooldown = shooting.cooldown;
  }

  update(ecs) {
    const player = ecs.queryManager.getEntitiesWith(
      'shooting', 'entityType',
      id => this.ecs.getComponent(id, 'entityType')?.type === 'player'
    ).values().next().value;
    if (!player) return;

    const shooting = ecs.getComponent(player, 'shooting');
    if (shooting.currentCooldown > 0) {
      shooting.currentCooldown -= this.scene.game.loop.delta / 1000;
      if (shooting.currentCooldown < 0) shooting.currentCooldown = 0;
    }
  }

  initEntity(entityId, ecs) {
    const sprite = ecs.getComponent(entityId, 'sprite')?.phaserSprite;
    if (sprite) sprite.setOrigin(0.5);
  }
}