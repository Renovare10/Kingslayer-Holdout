export default class Sprite {
  constructor(scene, x, y, key) {
    this.key = key;
    this.phaserSprite = scene.physics.add.sprite(x, y, key).setOrigin(0.5);
  }
}