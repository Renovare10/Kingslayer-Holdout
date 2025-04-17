import Position from '../components/Position.js';
import Sprite from '../components/Sprite.js';
import { createRotateToMouse } from '../components/RotateToMouse.js';
import { createMovement } from '../components/Movement.js';
import { createShooting } from '../components/Shooting.js';
import { createEntityType } from '../components/EntityType.js';

export default function createPlayer(ecs, scene, x, y) {
  const playerId = ecs.createEntity();
  ecs.addComponent(playerId, 'position', new Position(x, y));

  // Create a red box instead of a sprite
  const graphics = scene.add.rectangle(x, y, 150, 150, 0xff0000); // 50x50 red box
  graphics.setOrigin(0.5); // Center the box
  scene.physics.add.existing(graphics); // Add physics to the rectangle
  graphics.body.setCircle(75); // Approximate circular hitbox (radius = half of 50)
  graphics.body.setOffset(0, 0); // No offset needed for centered rectangle

  // Wrap the graphics object in a Sprite component for compatibility
  const sprite = { phaserSprite: graphics };
  ecs.addComponent(playerId, 'sprite', sprite);
  ecs.addComponent(playerId, 'rotatetomouse', createRotateToMouse());
  ecs.addComponent(playerId, 'movement', createMovement(200));
  ecs.addComponent(playerId, 'shooting', createShooting(0.2));
  ecs.addComponent(playerId, 'entityType', createEntityType('player'));
  ecs.addComponent(playerId, 'physicsBody', { body: graphics.body });
  ecs.initEntity(playerId);
  return playerId;
}