import Position from '../components/Position.js';
import Size from '../components/Size.js';
import { createMovement } from '../components/Movement.js';
import { createEntityType } from '../components/EntityType.js';

export default function createZombie(ecs, scene, x, y, zombieGroup) {
  const zombieId = ecs.createEntity();
  ecs.addComponent(zombieId, 'position', new Position(x, y));
  ecs.addComponent(zombieId, 'size', new Size(250, 250));
  const sprite = scene.physics.add.sprite(x, y, 'zombie').setOrigin(0.5);
  sprite.setSize(250, 250);
  sprite.entityId = zombieId; // Link sprite to ECS entity
  zombieGroup.add(sprite);
  ecs.addComponent(zombieId, 'sprite', { phaserSprite: sprite });
  ecs.addComponent(zombieId, 'movement', createMovement(60));
  ecs.addComponent(zombieId, 'entityType', createEntityType('zombie'));
  ecs.addComponent(zombieId, 'physicsBody', { body: sprite.body });
  ecs.initEntity(zombieId);
  return zombieId;
}