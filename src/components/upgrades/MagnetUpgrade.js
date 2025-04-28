/**
 * Stores magnet upgrade data for an entity (e.g., player).
 */
export default class MagnetUpgrade {
  constructor() {
    this.count = 0; // Number of magnet upgrades (0–3)
    this.maxStacks = 3; // Maximum stackable upgrades
    this.radius = 150; // Magnet radius in pixels
    this.maxSpeed = 200; // Max pull speed for XP
  }
}