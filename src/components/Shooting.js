export function createShooting() {
  return {
    enabled: true,      // Whether this entity can shoot
    cooldown: 0.2,      // Time between shots in seconds (500ms)
    currentCooldown: 0  // Tracks remaining cooldown time, updated by system
  };
}