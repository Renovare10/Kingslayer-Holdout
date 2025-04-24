import Position from '../components/Position.js';
import Size from '../components/Size.js';
import { createMovement } from '../components/Movement.js';
import { createEntityType } from '../components/EntityType.js';
import { createLifecycle } from '../components/Lifecycle.js';

export default function createBaseZombie(ecs, scene, x, y, zombieGroup, config = {}) {
  const zombieId = ecs.createEntity();

  const defaults = {
    size: { width: 250, height: 250 },
    speed: 60,
    spriteKey: 'zombie',
    settings: {}, // Default empty settings
  };
  const { size, speed, spriteKey, settings } = { ...defaults, ...config };

  ecs.addComponent(zombieId, 'position', new Position(x, y));
  ecs.addComponent(zombieId, 'size', new Size(size.width, size.height));
  
  const sprite = scene.physics.add.sprite(x, y, spriteKey).setOrigin(0.5);
  sprite.setSize(size.width, size.height);
  sprite.entityId = zombieId;
  zombieGroup.add(sprite);
  ecs.addComponent(zombieId, 'sprite', { phaserSprite: sprite });
  
  ecs.addComponent(zombieId, 'movement', createMovement(speed));
  ecs.addComponent(zombieId, 'entityType', createEntityType('zombie'));
  ecs.addComponent(zombieId, 'physicsBody', { body: sprite.body });
  ecs.addComponent(zombieId, 'lifecycle', createLifecycle(settings));

  ecs.initEntity(zombieId);

  return zombieId;
}