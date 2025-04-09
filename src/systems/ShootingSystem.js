import { createBullet } from '../components/Bullet.js';
import Position from '../components/Position.js';
import Sprite from '../components/Sprite.js';
import { createMovement } from '../components/Movement.js';

export class ShootingSystem {
  constructor(scene) {
    this.scene = scene;
    this.shootEventSet = false;
  }

  init(ecs) {
    this.ecs = ecs;
    if (!this.shootEventSet) {
      this.scene.input.on('pointerdown', () => this.tryShoot());
      this.shootEventSet = true;
    }
  }

  tryShoot() {
    const shooters = this.ecs.queryManager.getEntitiesWith('shooting', 'position', 'sprite');
    shooters.forEach(entityId => {
      const shooting = this.ecs.getComponent(entityId, 'shooting');
      if (!shooting.enabled || shooting.currentCooldown > 0) return;

      const position = this.ecs.getComponent(entityId, 'position');
      const sprite = this.ecs.getComponent(entityId, 'sprite').phaserSprite;

      const pointer = this.scene.input.activePointer;
      const angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, pointer.worldX, pointer.worldY);
      const speed = 4000;
      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed
      };

      const bulletId = this.ecs.createEntity();
      this.ecs.addComponent(bulletId, 'position', new Position(position.x, position.y));
      this.ecs.addComponent(bulletId, 'movement', createMovement(speed, 'bullet', velocity));
      this.ecs.addComponent(bulletId, 'sprite', new Sprite(this.scene, position.x, position.y, null));
      this.ecs.addComponent(bulletId, 'bullet', createBullet(10, 1000));
      
      shooting.currentCooldown = shooting.cooldown;
    });
  }

  update(ecs) {
    const shooters = ecs.queryManager.getEntitiesWith('shooting');
    shooters.forEach(entityId => {
      const shooting = ecs.getComponent(entityId, 'shooting');
      if (shooting.currentCooldown > 0) {
        shooting.currentCooldown -= this.scene.game.loop.delta / 1000;
        if (shooting.currentCooldown < 0) shooting.currentCooldown = 0;
      }
    });
  }

  initEntity(entityId, ecs) {
    const sprite = ecs.getComponent(entityId, 'sprite')?.phaserSprite;
    if (sprite) sprite.setOrigin(0.5);
  }
}