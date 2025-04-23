import Phaser from 'phaser';

export default class HealthUIManager {
  constructor(scene, ecs) {
    this.scene = scene;
    this.ecs = ecs;
    this.healthText = null;
  }

  initialize() {
    // Create health text
    this.healthText = this.scene.add.text(10, 10, 'Health: 100', {
      font: '32px Arial',
      fill: '#000000'
    }).setScrollFactor(0);

    // Listen for healthChanged event
    this.ecs.on('healthChanged', ({ health }) => {
      this.healthText.setText(`Health: ${health}`);
    });
  }

  destroy() {
    if (this.healthText) {
      this.healthText.destroy();
    }
  }
}