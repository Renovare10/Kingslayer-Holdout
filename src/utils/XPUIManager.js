import Phaser from 'phaser';

export default class XPUIManager {
  constructor(scene, ecs) {
    this.scene = scene;
    this.ecs = ecs;
    this.xpText = null;
  }

  initialize() {
    // Create XP text below health (10, 50)
    this.xpText = this.scene.add.text(10, 50, 'XP: 0 | Level: 1', {
      font: '32px Arial',
      fill: '#000000',
    }).setScrollFactor(0);

    // Listen for xpChanged event
    this.ecs.on('xpChanged', ({ xp, level }) => {
      this.xpText.setText(`XP: ${xp} | Level: ${level}`);
    });
  }

  destroy() {
    if (this.xpText) {
      this.xpText.destroy();
      this.xpText = null;
    }
  }
}