// src/components/Sprite.js
export default class Sprite {
  constructor(scene, x, y, key, usePhysics = false) {
    this.key = key;
    this.phaserSprite = usePhysics
      ? scene.physics.add.sprite(x, y, key).setOrigin(0.5)
      : scene.add.sprite(x, y, key).setOrigin(0.5);
  }
}