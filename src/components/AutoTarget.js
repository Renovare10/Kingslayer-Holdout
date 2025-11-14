/**
 * AutoTarget component – holds the firing angle calculated by TargetLockSystem.
 * @typedef {Object} AutoTarget
 * @property {number} angle - Radians toward the closest zombie.
 */
export default class AutoTarget {
  constructor(angle = 0) {
    this.angle = angle;
  }
}