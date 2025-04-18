import Position from '../components/Position.js';
import Sprite from '../components/Sprite.js';
import { createMovement } from '../components/Movement.js';
import { createEntityType } from '../components/EntityType.js';

export function createZombie(ecs, scene, x, y, zombieGroup) {
  const zombieId = ecs.createEntity();
  ecs.addComponent(zombieId, 'position', new Position(x, y));

  // Create zombie sprite with physics
  const sprite = new Sprite(scene, x, y, 'zombie', true); // Enable physics
  sprite.phaserSprite.body.setCircle(125); // Circular collider with radius 125
  sprite.phaserSprite.body.setOffset(0, 0); // No offset for centered sprite

  // Add to zombie physics group
  if (zombieGroup) {
    zombieGroup.add(sprite.phaserSprite);
  }

  ecs.addComponent(zombieId, 'sprite', sprite);
  ecs.addComponent(zombieId, 'movement', createMovement(100));
  ecs.addComponent(zombieId, 'zombie', { active: true });
  ecs.addComponent(zombieId, 'entityType', createEntityType('zombie'));
  ecs.addComponent(zombieId, 'physicsBody', { body: sprite.phaserSprite.body });
  ecs.initEntity(zombieId);
  return zombieId;
}