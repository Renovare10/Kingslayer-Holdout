/**
 * Stores speed upgrade data for an entity (e.g., player).
 */
export default class SpeedUpgrade {
  constructor() {
    this.count = 0; // Number of speed upgrades (0–3)
    this.maxStacks = 3; // Maximum stackable upgrades
    this.speedBoost = 5; // Speed increase per stack
  }
}