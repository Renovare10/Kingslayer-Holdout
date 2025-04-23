/**
 * Flash component for entities that flash (e.g., on damage).
 * @class
 */
export default class Flash {
  /**
   * @param {number} duration - Total flash duration in ms.
   * @param {number} interval - Interval between alpha toggles in ms.
   */
  constructor(duration = 1000, interval = 100) {
    this.duration = duration; // Total flash time
    this.interval = interval; // Time between flashes
    this.currentTime = 0; // Tracks elapsed time
    this.isVisible = true; // Tracks current visibility
  }
}