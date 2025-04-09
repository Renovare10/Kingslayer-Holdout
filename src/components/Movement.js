export function createMovement(speed, velocity = { x: 0, y: 0 }) {
  return {
    speed,           // Movement speed in pixels per second
    velocity        // Current movement direction and magnitude
  };
}