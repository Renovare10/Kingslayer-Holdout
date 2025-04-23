import Position from '../components/Position.js';
import Sprite from '../components/Sprite.js';
import { createRotateToMouse } from '../components/RotateToMouse.js';
import { createMovement } from '../components/Movement.js';
import { createEntityType } from '../components/EntityType.js';
import Health from '../components/Health.js';
import Shooting from '../components/Shooting.js';

export default function createPlayer(ecs, scene, x, y) {
  const playerId = ecs.createEntity();
  
  // Create the sprite first to get its dimensions
  const graphics = scene.add.rectangle(x, y, 150, 150, 0xff0000); // 150x150 red box
  graphics.setOrigin(0.5); // Center the box
  graphics.setPosition(x, y); // Ensure center stays at (500, 500) after setOrigin
  scene.physics.add.existing(graphics); // Add physics to the rectangle
  graphics.body.setCircle(75); // Approximate circular hitbox (radius = half of 150)
  graphics.body.setOffset(0, 0); // No offset needed for centered rectangle

  // Adjust Position to match the sprite's centered coordinates
  const sprite = { phaserSprite: graphics };
  const adjustedX = graphics.x; // Should be 500
  const adjustedY = graphics.y; // Should be 500
  ecs.addComponent(playerId, 'position', new Position(adjustedX, adjustedY));
  
  ecs.addComponent(playerId, 'sprite', sprite);
  ecs.addComponent(playerId, 'rotatetomouse', createRotateToMouse());
  ecs.addComponent(playerId, 'movement', createMovement(100));
  ecs.addComponent(playerId, 'entityType', createEntityType('player'));
  ecs.addComponent(playerId, 'physicsBody', { body: graphics.body });
  ecs.addComponent(playerId, 'health', new Health(100, 100)); // 100 HP, max 100
  ecs.addComponent(playerId, 'shooting', new Shooting(200)); // Cooldown of 200ms
  
  ecs.initEntity(playerId);
  return playerId;
}