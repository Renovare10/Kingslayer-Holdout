import Position from '../components/Position.js';
import Sprite from '../components/Sprite.js';
import { createMovement } from '../components/Movement.js';

export function createZombie(ecs, scene, x, y) {
  const zombieId = ecs.createEntity();
  ecs.addComponent(zombieId, 'position', new Position(x, y));
  ecs.addComponent(zombieId, 'sprite', new Sprite(scene, x, y, 'zombie'));
  ecs.addComponent(zombieId, 'movement', createMovement(100, 'zombie'));
  ecs.addComponent(zombieId, 'zombie', { active: true });
  ecs.initEntity(zombieId);
  return zombieId;
}