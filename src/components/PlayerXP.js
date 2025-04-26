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
    /**
     * Updates XP and checks for level-up, resetting XP to 0.
     * @param {number} xpGained - XP to add.
     * @returns {boolean} True if leveled up.
     */
    addXP(xpGained) {
      this.xp += xpGained;
      if (this.xp >= this.xpToNextLevel) {
        this.level += 1;
        this.xp = 0; // Reset XP to 0
        this.xpToNextLevel += 50; // Increase by 50
        return true;
      }
      return false;
    },
  };
}