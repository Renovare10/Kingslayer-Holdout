import createBaseZombie from '../entities/BaseZombie.js';
import createFastZombie from '../entities/FastZombie.js';

// Centralizes zombie creation logic with type selection and shared effects.
export default class ZombieFactory {
  /**
   * Creates a zombie of the specified type with a fade-in effect.
   * @param {string} type - The type of zombie to create ('standard', 'fast', etc.).
   * @param {Object} ecs - The ECS manager instance.
   * @param {Object} scene - The Phaser scene.
   * @param {number} x - X-coordinate for zombie spawn.
   * @param {number} y - Y-coordinate for zombie spawn.
   * @param {Phaser.Physics.Arcade.Group} zombieGroup - Physics group for zombies.
   * @param {Object} gameState - The game state instance.
   * @returns {number} The entity ID of the created zombie.
   */
  static createZombie(type, ecs, scene, x, y, zombieGroup, gameState) {
    const settings = gameState.getSettings();
    const zombieTypes = {
      standard: createBaseZombie,
      fast: createFastZombie,
    };

    // Default to standard if type is not specified or invalid
    const createFunction = zombieTypes[type] || createBaseZombie;
    const zombieId = createFunction(ecs, scene, x, y, zombieGroup);

    // Apply fade-in effect
    const sprite = ecs.getComponent(zombieId, 'sprite').phaserSprite;
    sprite.setAlpha(0); // Start invisible
    scene.tweens.add({
      targets: sprite,
      alpha: 1,
      duration: settings.fadeInDuration,
      ease: 'Linear',
    });

    return zombieId;
  }

  /**
   * Creates a zombie with a chance for a fast zombie.
   * @param {Object} ecs - The ECS manager instance.
   * @param {Object} scene - The Phaser scene.
   * @param {number} x - X-coordinate for zombie spawn.
   * @param {number} y - Y-coordinate for zombie spawn.
   * @param {Phaser.Physics.Arcade.Group} zombieGroup - Physics group for zombies.
   * @param {Object} gameState - The game state instance.
   * @returns {number} The entity ID of the created zombie.
   */
  static createRandomZombie(ecs, scene, x, y, zombieGroup, gameState) {
    const settings = gameState.getSettings();
    const type = Math.random() < settings.fastZombieChance ? 'fast' : 'standard';
    return this.createZombie(type, ecs, scene, x, y, zombieGroup, gameState);
  }
}