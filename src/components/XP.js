/**
 * Component for XP entities dropped by zombies.
 * @param {Object} config - Configuration for the XP component.
 * @param {number} [config.value=1] - XP value.
 * @param {number} [config.lifespan=5000] - Lifespan in milliseconds.
 * @param {number} [config.createdAt] - Creation timestamp (defaults to now).
 * @returns {Object} XP component data.
 */
export function createXP({
  value = 1,
  lifespan = 10000,
  createdAt = performance.now(),
} = {}) {
  return {
    value,
    createdAt,
    lifespan,
  };
}