// src/entities/Player.js
import Position from '../components/Position.js';
import Sprite from '../components/Sprite.js';
import { createRotateToMouse } from '../components/RotateToMouse.js';
import { createMovement } from '../components/Movement.js';
import { createShooting } from '../components/Shooting.js';
import { createEntityType } from '../components/EntityType.js';

export default function createPlayer(ecs, scene, x, y) {
  const playerId = ecs.createEntity();
  ecs.addComponent(playerId, 'position', new Position(x, y));
  const sprite = new Sprite(scene, x, y, 'survivor-idle_handgun');
  sprite.phaserSprite.setOrigin(0.5);
  sprite.phaserSprite.body.setCircle(85); // Radius = half of 170
  sprite.phaserSprite.body.setOffset(40, 25); // Keep existing offset
  ecs.addComponent(playerId, 'sprite', sprite);
  ecs.addComponent(playerId, 'rotatetomouse', createRotateToMouse());
  ecs.addComponent(playerId, 'movement', createMovement(200));
  ecs.addComponent(playerId, 'shooting', createShooting(0.2));
  ecs.addComponent(playerId, 'entityType', createEntityType('player'));
  ecs.addComponent(playerId, 'physicsBody', { body: sprite.phaserSprite.body });
  ecs.initEntity(playerId);
  return playerId;
}