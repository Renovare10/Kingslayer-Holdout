/**
 * Factory for creating sprites and visual effects.
 */
export default class SpriteFactory {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Creates an XP sprite (purple circle with lavender flash).
   * @param {number} x - X position.
   * @param {number} y - Y position.
   * @returns {Object} Sprite component data ({ phaserSprite, flashSprite }).
   */
  createXPSprite(x, y) {
    // Purple circle (17x17, radius 8.5)
    const phaserSprite = this.scene.add.circle(x, y, 8.5, 0x9932CC).setDepth(100);
    // Lavender flash overlay
    const flashSprite = this.scene.add.circle(x, y, 8.5, 0xE6E6FA).setDepth(101);

    // Add flash tween
    this.scene.tweens.add({
      targets: flashSprite,
      alpha: { from: 0, to: 0.5 },
      duration: 500,
      yoyo: true,
      repeat: -1,
    });

    return { phaserSprite, flashSprite };
  }
}