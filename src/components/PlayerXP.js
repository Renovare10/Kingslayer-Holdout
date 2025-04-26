/**
 * Component for tracking player XP and level.
 * @param {Object} config - Configuration for the PlayerXP component.
 * @param {number} [config.xp=0] - Current XP.
 * @param {number} [config.level=1] - Current level.
 * @param {number} [config.xpToNextLevel=100] - XP needed for next level.
 * @returns {Object} PlayerXP component data.
 */
export function createPlayerXP({
  xp = 0,
  level = 1,
  xpToNextLevel = 100,
} = {}) {
  return {
    xp,
    level,
    xpToNextLevel,
  };
}