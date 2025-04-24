import createBaseZombie from './BaseZombie.js';

export default function createFastZombie(ecs, scene, x, y, zombieGroup, settings) {
  const config = {
    size: { width: 250, height: 250 },
    speed: 120,
    spriteKey: 'zombie',
  };
  const zombieId = createBaseZombie(ecs, scene, x, y, zombieGroup, { ...config, settings });
  
  const sprite = ecs.getComponent(zombieId, 'sprite').phaserSprite;
  sprite.setTint(0xCCCC00);
  sprite.setDisplaySize(100, 100);

  return zombieId;
}