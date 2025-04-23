import createBaseZombie from './BaseZombie.js';

/**
 * Creates a fast zombie entity with increased speed, smaller size (100x100), and dark yellow tint.
 * @param {ECSManager} ecs - The ECS manager instance.
 * @param {Phaser.Scene} scene - The Phaser scene.
 * @param {number} x - X-coordinate for zombie spawn.
 * @param {number} y - Y-coordinate for zombie spawn.
 * @param {Phaser.Physics.Arcade.Group} zombieGroup - Physics group for zombies.
 * @returns {number} The entity ID of the created fast zombie.
 */
export default function createFastZombie(ecs, scene, x, y, zombieGroup) {
  const config = {
    size: { width: 250, height: 250 },
    speed: 120,
    spriteKey: 'zombie', // Reuse zombie.png
  };
  const zombieId = createBaseZombie(ecs, scene, x, y, zombieGroup, config);
  
  // Apply dark yellow tint and set display size to match collider
  const sprite = ecs.getComponent(zombieId, 'sprite').phaserSprite;
  sprite.setTint(0xCCCC00); // Darker yellow tint
  sprite.setDisplaySize(100, 100); // Ensure visual size matches collider

  return zombieId;
}