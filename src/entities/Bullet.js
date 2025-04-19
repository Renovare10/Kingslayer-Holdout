import Size from '../components/Size.js';
import Position from '../components/Position.js';
import Angle from '../components/Angle.js';
import { createMovement } from '../components/Movement.js';
import { createEntityType } from '../components/EntityType.js';

export default function createBullet(ecs, scene, x, y, angle = 0) {
  const bulletId = ecs.createEntity();
  ecs.addComponent(bulletId, 'position', new Position(x, y));
  const size = new Size(14, 3);
  ecs.addComponent(bulletId, 'size', size);
  // Create a 14x3 black rectangle and add physics
  const rectangle = scene.add.rectangle(x, y, size.width, size.height, 0x000000);
  rectangle.setOrigin(0.5);
  rectangle.setRotation(angle); // Rotate to the angle
  scene.physics.add.existing(rectangle);
  rectangle.body.setSize(size.width, size.height);
  ecs.addComponent(bulletId, 'sprite', { phaserSprite: rectangle });
  ecs.addComponent(bulletId, 'movement', createMovement(500)); // Speed 500
  ecs.addComponent(bulletId, 'entityType', createEntityType('bullet'));
  ecs.addComponent(bulletId, 'physicsBody', { body: rectangle.body });
  ecs.addComponent(bulletId, 'angle', new Angle(angle)); // Use Angle component
  ecs.initEntity(bulletId);
  return bulletId;
}