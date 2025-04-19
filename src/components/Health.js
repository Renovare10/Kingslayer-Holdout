export default class Health {
  constructor(current = 100, max = 100) {
    this.current = current; // Current health points
    this.max = max; // Maximum health points
    this.invincibilityTimer = 0; // Time remaining for invincibility (ms)
  }

  get isInvincible() {
    return this.invincibilityTimer > 0; // True if invincibility is active
  }
}