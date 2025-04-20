import createBullet from '../entities/Bullet.js';
import Shooting from '../components/Shooting.js';

/**
 * Manages player shooting mechanics, including click and continuous firing with a cooldown.
 */
export default class PlayerShootingSystem {
  #isMouseDown = false;
  #scene;
  #bulletGroup;
  #ecs;

  /**
   * @param {Phaser.Scene} scene - The Phaser scene for input and rendering.
   * @param {Phaser.Physics.Arcade.Group} bulletGroup - Physics group for bullets.
   */
  constructor(scene, bulletGroup) {
    this.#scene = scene;
    this.#bulletGroup = bulletGroup;
    this.#setupInputHandlers();
  }

  /**
   * Sets up mouse input handlers for shooting.
   */
  #setupInputHandlers() {
    this.#scene.input.on('pointerdown', (pointer) => {
      this.#isMouseDown = true;
      this.#handleShoot(pointer);
    });
    this.#scene.input.on('pointerup', () => {
      this.#isMouseDown = false;
    });
  }

  /**
   * Updates shooting cooldowns and handles continuous firing.
   * @param {ECSManager} ecs - The ECS manager instance.
   */
  update(ecs) {
    this.#ecs = ecs;
    const players = this.#getPlayerEntities();

    players.forEach((playerId) => {
      this.#updateCooldown(playerId);
      if (this.#isMouseDown && this.#canShoot(playerId)) {
        this.#fireBullet(playerId);
      }
    });
  }

  /**
   * Retrieves player entities with required components.
   * @returns {Set<number>} Set of player entity IDs.
   */
  #getPlayerEntities() {
    return this.#ecs.queryManager.getEntitiesWith(
      'entityType',
      'shooting',
      'sprite',
      (entityId) => {
        const { type } = this.#ecs.getComponent(entityId, 'entityType') || {};
        return type === 'player';
      }
    );
  }

  /**
   * Updates the shooting cooldown for a player.
   * @param {number} playerId - The player entity ID.
   */
  #updateCooldown(playerId) {
    const shooting = this.#ecs.getComponent(playerId, 'shooting');
    if (shooting.currentCooldown > 0) {
      shooting.currentCooldown = Math.max(
        0,
        shooting.currentCooldown - this.#scene.sys.game.loop.delta
      );
    }
  }

  /**
   * Checks if the player can shoot based on cooldown.
   * @param {number} playerId - The player entity ID.
   * @returns {boolean} True if the player can shoot.
   */
  #canShoot(playerId) {
    const shooting = this.#ecs.getComponent(playerId, 'shooting');
    return shooting.currentCooldown <= 0;
  }

  /**
   * Fires a bullet from the player toward the mouse position.
   * @param {number} playerId - The player entity ID.
   * @param {Phaser.Input.Pointer} [pointer] - Optional pointer for initial click position.
   */
  #fireBullet(playerId, pointer = this.#scene.input.activePointer) {
    const { phaserSprite: sprite } = this.#ecs.getComponent(playerId, 'sprite');
    const shooting = this.#ecs.getComponent(playerId, 'shooting');

    const worldPoint = this.#scene.cameras.main.getWorldPoint(pointer.x, pointer.y);
    const angle = Phaser.Math.Angle.Between(sprite.x, sprite.y, worldPoint.x, worldPoint.y);

    createBullet(this.#ecs, this.#scene, sprite.x, sprite.y, angle, 2000, this.#bulletGroup);
    shooting.currentCooldown = shooting.cooldown;
  }

  /**
   * Handles shooting on mouse click.
   * @param {Phaser.Input.Pointer} pointer - The pointer event data.
   */
  #handleShoot(pointer) {
    if (!this.#ecs) return;

    const players = this.#getPlayerEntities();
    players.forEach((playerId) => {
      if (this.#canShoot(playerId)) {
        this.#fireBullet(playerId, pointer);
      }
    });
  }
}