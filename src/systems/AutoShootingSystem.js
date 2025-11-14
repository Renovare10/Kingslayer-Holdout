import createBullet from '../entities/Bullet.js';

/**
 * AutoShootingSystem – fires bullets automatically toward the angle stored
 * in the player's AutoTarget component.  Cooldown is respected.
 */
export default class AutoShootingSystem {
  #scene;
  #bulletGroup;
  #ecs;

  constructor(scene, bulletGroup) {
    this.#scene = scene;
    this.#bulletGroup = bulletGroup;
  }

  /** @param {ECSManager} ecs */
  update(ecs) {
    this.#ecs = ecs;
    const playerId = this.#getPlayerId();
    if (!playerId) return;

    this.#updateCooldown(playerId);
    if (this.#canShoot(playerId)) {
      this.#fireBullet(playerId);
    }
  }

  /** @returns {number|null} */
  #getPlayerId() {
    const set = this.#ecs.queryManager.getEntitiesWith(
      'entityType',
      'shooting',
      'autoTarget',
      id => this.#ecs.getComponent(id, 'entityType')?.type === 'player'
    );
    return set.size ? [...set][0] : null;
  }

  /** @param {number} playerId */
  #updateCooldown(playerId) {
    const shooting = this.#ecs.getComponent(playerId, 'shooting');
    if (shooting.currentCooldown > 0) {
      shooting.currentCooldown = Math.max(
        0,
        shooting.currentCooldown - this.#scene.sys.game.loop.delta
      );
    }
  }

  /** @param {number} playerId @returns {boolean} */
  #canShoot(playerId) {
    const shooting = this.#ecs.getComponent(playerId, 'shooting');
    return shooting.currentCooldown <= 0;
  }

  /** @param {number} playerId */
  #fireBullet(playerId) {
    const { phaserSprite } = this.#ecs.getComponent(playerId, 'sprite');
    const { angle } = this.#ecs.getComponent(playerId, 'autoTarget');
    const shooting = this.#ecs.getComponent(playerId, 'shooting');

    createBullet(
      this.#ecs,
      this.#scene,
      phaserSprite.x,
      phaserSprite.y,
      angle,
      2000,
      this.#bulletGroup
    );

    shooting.currentCooldown = shooting.cooldown;
  }
}