import Position from '../components/Position.js';
import Sprite from '../components/Sprite.js';
import Size from '../components/Size.js';
import { createMovement } from '../components/Movement.js';
import { createBullet as createBulletComponent } from '../components/Bullet.js';
import { createEntityType } from '../components/EntityType.js';

export function createBullet(ecs, scene, x, y, velocity, { width = 14, height = 3, speed = 4000, damage = 10, lifespan = 5000 } = {}) {
  const bulletId = ecs.createEntity();
  ecs.addComponent(bulletId, 'position', new Position(x, y));
  ecs.addComponent(bulletId, 'size', new Size(width, height));
  ecs.addComponent(bulletId, 'movement', createMovement(speed, velocity));
  ecs.addComponent(bulletId, 'sprite', new Sprite(scene, x, y, null));
  ecs.addComponent(bulletId, 'bullet', createBulletComponent(damage, lifespan));
  ecs.addComponent(bulletId, 'entityType', createEntityType('bullet'));
  ecs.initEntity(bulletId);
  return bulletId;
}