export function createMovement(speed, type, velocity = { x: 0, y: 0 }) {
  return {
    speed,           // Movement speed in pixels per second
    velocity,        // Current movement direction and magnitude
    type             // Identifies movement behavior or entity type
  };
}