import Position from '../components/Position.js';
import Sprite from '../components/Sprite.js';
import { createRotateToMouse } from '../components/RotateToMouse.js';
import { createMovement } from '../components/Movement.js';

export default function createPlayer(ecs, scene, x, y) {
  const playerId = ecs.createEntity();
  ecs.addComponent(playerId, 'player', { active: true }); // Flag as player
  ecs.addComponent(playerId, 'position', new Position(x, y));
  ecs.addComponent(playerId, 'sprite', new Sprite(scene, x, y, 'survivor-idle_handgun_0'));
  ecs.addComponent(playerId, 'rotateToMouse', createRotateToMouse()); 
  ecs.addComponent(playerId, 'movement', createMovement(200, 'player'));
  return playerId;
}