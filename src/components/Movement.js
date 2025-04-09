export function createMovement(speed, type) {
  return {
    speed,              // Pixels per second
    velocity: { x: 0, y: 0 }, // Current direction/speed
    type                
  };
}