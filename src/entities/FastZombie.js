import createBaseZombie from './BaseZombie.js';

/**
 * Creates a fast zombie entity with increased speed and smaller size.
 * @param {ECSManager} ecs - The ECS manager instance.
 * @param {Phaser.Scene} scene - The Phaser scene.
 * @param {number} x - X-coordinate for zombie spawn.
 * @param {number} y - Y-coordinate for zombie spawn.
 * @param {Phaser.Physics.Arcade.Group} zombieGroup - Physics group for zombies.
 * @returns {number} The entity ID of the created fast zombie.
 */
export default function createFastZombie(ecs, scene, x, y, zombieGroup) {
  const config = {
    size: { width: 150, height: 150 },
    speed: 120,
    spriteKey: 'zombie', // Reuse zombie.png; update if new sprite available
  };
  return createBaseZombie(ecs, scene, x, y, zombieGroup, config);
}