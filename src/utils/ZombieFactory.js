import createBaseZombie from '../entities/BaseZombie.js';
import createFastZombie from '../entities/FastZombie.js';

export default class ZombieFactory {
  static createZombie(type, ecs, scene, x, y, zombieGroup, gameState) {
    const settings = gameState.getSettings();
    const zombieTypes = {
      standard: createBaseZombie,
      fast: createFastZombie,
    };

    const createFunction = zombieTypes[type] || createBaseZombie;
    const zombieId = createFunction(ecs, scene, x, y, zombieGroup, settings);

    const sprite = ecs.getComponent(zombieId, 'sprite').phaserSprite;
    sprite.setAlpha(0);
    scene.tweens.add({
      targets: sprite,
      alpha: 1,
      duration: settings.fadeInDuration,
      ease: 'Linear',
    });

    return zombieId;
  }

  static createRandomZombie(ecs, scene, x, y, zombieGroup, gameState) {
    const settings = gameState.getSettings();
    const type = Math.random() < settings.fastZombieChance ? 'fast' : 'standard';
    return this.createZombie(type, ecs, scene, x, y, zombieGroup, gameState);
  }
}