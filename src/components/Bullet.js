export function createBullet(damage = 10, lifespan = 5000) {
  return {
    damage,            // Damage dealt on hit (default 10)
    lifespan,         // Lifespan in milliseconds (default 5000)
    createdAt: Date.now()  // Timestamp for lifespan tracking (in milliseconds)
  };
}