export default class Sprite {
  constructor(scene, x, y, key) {
    this.key = key;
    this.phaserSprite = scene.add.sprite(x, y, key).setOrigin(0.5);
  }
}