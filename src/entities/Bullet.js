import Position from '../components/Position.js';
import Sprite from '../components/Sprite.js';
import { createMovement } from '../components/Movement.js';
import { createBullet as createBulletComponent } from '../components/Bullet.js';
import { createEntityType } from '../components/EntityType.js';

export function createBullet(ecs, scene, x, y, velocity) {
  const bulletId = ecs.createEntity();
  ecs.addComponent(bulletId, 'position', new Position(x, y));
  ecs.addComponent(bulletId, 'movement', createMovement(4000, velocity));
  ecs.addComponent(bulletId, 'sprite', new Sprite(scene, x, y, null));
  ecs.addComponent(bulletId, 'bullet', createBulletComponent(10, 5000));
  ecs.addComponent(bulletId, 'entityType', createEntityType('bullet'));
  ecs.initEntity(bulletId); // Ensure systems like BulletSystem initialize it
  return bulletId;
}