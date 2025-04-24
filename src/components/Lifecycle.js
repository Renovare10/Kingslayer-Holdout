export function createLifecycle(settings) {
  return {
    despawnDistance: settings.despawnDistance || 2000, // Distance to despawn zombie
    respawnDistance: settings.respawnDistance || 1600, // Distance to respawn new zombie
    maxZombies: settings.maxZombies || 175 // Max active zombies
  };
}