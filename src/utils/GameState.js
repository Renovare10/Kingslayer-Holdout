/**
 * Manages game state and dynamic settings for Kingslayer Holdout.
 */
export default class GameState {
  constructor() {
    this.gameTime = 0; // Time in seconds
    this.level = 1; // Player level (for future XP system)

    // Initial settings
    this.baseMaxZombies = 175;
    this.initialSpawnDistance = 1500;
    this.despawnDistance = 2000;
    this.respawnDistance = 1600;
    this.fastZombieChance = 0.2;
    this.clusterChance = 0.1;
    this.clusterSizeMin = 2;
    this.clusterSizeMax = 5;
    this.clusterRadius = 200;
    this.fadeInDuration = 500;
    this.xpPerZombie = 1; // XP per zombie death
    this.xpDropChance = 1.0; // 100% drop chance
  }

  /**
   * Updates game state based on elapsed time.
   * @param {number} delta - Time elapsed since last update (in milliseconds).
   */
  update(delta) {
    this.gameTime += delta / 1000; // Convert to seconds
  }

  /**
   * Returns the current game settings, with dynamic adjustments.
   * @returns {Object} The current settings.
   */
  getSettings() {
    return {
      maxZombies: this.baseMaxZombies + Math.floor(this.gameTime / 60) * 10,
      initialSpawnDistance: this.initialSpawnDistance,
      despawnDistance: this.despawnDistance,
      respawnDistance: this.respawnDistance,
      fastZombieChance: this.fastZombieChance,
      clusterChance: this.clusterChance,
      clusterSizeMin: this.clusterSizeMin,
      clusterSizeMax: this.clusterSizeMax,
      clusterRadius: this.clusterRadius,
      fadeInDuration: this.fadeInDuration,
      xpPerZombie: this.xpPerZombie,
      xpDropChance: this.xpDropChance,
    };
  }
}