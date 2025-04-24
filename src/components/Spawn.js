export function createSpawn(settings) {
  return {
    interval: settings.spawnInterval || 2000, // Base spawn interval (ms)
    timer: 0, // Current timer (ms)
    clusterChance: settings.clusterChance || 0.1, // Chance to spawn a cluster
    clusterSizeMin: settings.clusterSizeMin || 2,
    clusterSizeMax: settings.clusterSizeMax || 5,
    clusterRadius: settings.clusterRadius || 200,
    maxZombies: settings.maxZombies || 175, // Max active zombies
  };
}