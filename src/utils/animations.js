export function createAnimations(scene) {
  scene.anims.create({
      key: 'idle',
      frames: Array.from({ length: 20 }, (_, i) => ({ key: `survivor-idle_handgun_${i}.png` })),
      frameRate: 10,
      repeat: -1
  });
}