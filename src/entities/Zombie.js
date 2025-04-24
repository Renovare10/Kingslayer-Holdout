import createBaseZombie from './BaseZombie.js';

export default function createZombie(ecs, scene, x, y, zombieGroup, settings) {
  const config = {
    size: { width: 250, height: 250 },
    speed: 60,
    spriteKey: 'zombie',
  };
  return createBaseZombie(ecs, scene, x, y, zombieGroup, { ...config, settings });
}