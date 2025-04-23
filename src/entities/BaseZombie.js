import Position from '../components/Position.js';
import Size from '../components/Size.js';
import { createMovement } from '../components/Movement.js';
import { createEntityType } from '../components/EntityType.js';

/**
 * Creates a base zombie entity with common components.
 * @param {ECSManager} ecs - The ECS manager instance.
 * @param {Phaser.Scene} scene - The Phaser scene.
 * @param {number} x - X-coordinate for zombie spawn.
 * @param {number} y - Y-coordinate for zombie spawn.
 * @param {Phaser.Physics.Arcade.Group} zombieGroup - Physics group for zombies.
 * @param {Object} [config] - Optional configuration to override defaults.
 * @returns {number} The entity ID of the created zombie.
 */
export default function createBaseZombie(ecs, scene, x, y, zombieGroup, config = {}) {
  const zombieId = ecs.createEntity();

  // Default configuration
  const defaults = {
    size: { width: 250, height: 250 },
    speed: 60,
    spriteKey: 'zombie',
  };
  const { size, speed, spriteKey } = { ...defaults, ...config };

  // Add components
  ecs.addComponent(zombieId, 'position', new Position(x, y));
  ecs.addComponent(zombieId, 'size', new Size(size.width, size.height));
  
  // Create and configure sprite
  const sprite = scene.physics.add.sprite(x, y, spriteKey).setOrigin(0.5);
  sprite.setSize(size.width, size.height);
  sprite.entityId = zombieId; // Link sprite to ECS entity
  zombieGroup.add(sprite);
  ecs.addComponent(zombieId, 'sprite', { phaserSprite: sprite });
  
  ecs.addComponent(zombieId, 'movement', createMovement(speed));
  ecs.addComponent(zombieId, 'entityType', createEntityType('zombie'));
  ecs.addComponent(zombieId, 'physicsBody', { body: sprite.body });

  // Initialize entity in ECS
  ecs.initEntity(zombieId);

  return zombieId;
}