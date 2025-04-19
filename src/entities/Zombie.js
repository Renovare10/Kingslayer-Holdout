import Position from '../components/Position.js';
import Size from '../components/Size.js';
import { createMovement } from '../components/Movement.js';
import { createEntityType } from '../components/EntityType.js';

export default function createZombie(ecs, scene, x, y) {
  const zombieId = ecs.createEntity();
  ecs.addComponent(zombieId, 'position', new Position(x, y));
  ecs.addComponent(zombieId, 'size', new Size(250, 250)); // Matches sprite dimensions
  const sprite = scene.physics.add.sprite(x, y, 'zombie').setOrigin(0.5);
  sprite.setSize(250, 250); // Square collider matching sprite size
  ecs.addComponent(zombieId, 'sprite', { phaserSprite: sprite });
  ecs.addComponent(zombieId, 'movement', createMovement(100)); // Speed 100
  ecs.addComponent(zombieId, 'entityType', createEntityType('zombie'));
  ecs.addComponent(zombieId, 'physicsBody', { body: sprite.body });
  ecs.initEntity(zombieId);
  return zombieId;
}