// src/systems/TargetLockSystem.js
import AutoTarget from '../components/AutoTarget.js';

/**
 * TargetLockSystem – finds the closest zombie each frame and writes an
 * AutoTarget + Angle component on the player.  Pure data, no firing.
 */
export default class TargetLockSystem {
  #scene;
  #ecs;

  constructor(scene) {
    this.#scene = scene;
  }

  /** @param {ECSManager} ecs */
  update(ecs) {
    this.#ecs = ecs;
    const playerId = this.#getPlayerId();
    if (!playerId) return;

    const closest = this.#findClosestZombie(playerId);
    if (!closest) {
      this.#ecs.removeComponent(playerId, 'autoTarget');
      return;
    }

    const angle = this.#calcAngle(playerId, closest.position);
    this.#writeTarget(playerId, angle);
  }

  /** @returns {number|null} */
  #getPlayerId() {
    const set = this.#ecs.queryManager.getEntitiesWith(
      'entityType',
      'position',
      id => this.#ecs.getComponent(id, 'entityType')?.type === 'player'
    );
    return set.size ? [...set][0] : null;
  }

  /** @returns {{id:number, position:{x:number,y:number}}|null} */
  #findClosestZombie(playerId) {
    const { x: px, y: py } = this.#ecs.getComponent(playerId, 'position');
    const zombies = this.#ecs.queryManager.getEntitiesWith(
      'entityType',
      'position',
      id => this.#ecs.getComponent(id, 'entityType')?.type === 'zombie'
    );

    let best = null;
    let bestDist = Infinity;

    for (const id of zombies) {
      const pos = this.#ecs.getComponent(id, 'position');
      const d = Phaser.Math.Distance.Between(px, py, pos.x, pos.y);
      if (d < bestDist) {
        bestDist = d;
        best = { id, position: pos };
      }
    }
    return best;
  }

  /** @returns {number} radians */
  #calcAngle(playerId, zombiePos) {
    const { x: px, y: py } = this.#ecs.getComponent(playerId, 'position');
    return Math.atan2(zombiePos.y - py, zombiePos.x - px);
  }

  /** @param {number} playerId @param {number} angle */
  #writeTarget(playerId, angle) {
    let auto = this.#ecs.getComponent(playerId, 'autoTarget');
    if (!auto) {
      auto = new AutoTarget(angle);  // ← Now defined
      this.#ecs.addComponent(playerId, 'autoTarget', auto);
    } else {
      auto.angle = angle;
    }

    let angleComp = this.#ecs.getComponent(playerId, 'angle');
    if (!angleComp) {
      angleComp = { value: angle };
      this.#ecs.addComponent(playerId, 'angle', angleComp);
    } else {
      angleComp.value = angle;
    }
  }
}