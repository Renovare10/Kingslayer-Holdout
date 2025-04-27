import Phaser from 'phaser';
import SpeedUpgrade from '../components/upgrades/SpeedUpgrade.js';

/**
 * Displays the upgrade selection UI when the player levels up.
 */
export default class UpgradeScene extends Phaser.Scene {
  constructor() {
    super('UpgradeScene');
    this.powerUp = { type: 'speed', color: 0xff0000, title: 'Speed Boost' };
  }

  init(data) {
    this.ecs = data.ecs;
  }

  create() {
    // Find player entity
    const playerId = [...this.ecs.queryManager.getEntitiesWith('entityType')]
      .find(id => this.ecs.getComponent(id, 'entityType').type === 'player');

    if (!playerId) {
      this.scene.resume('MainScene');
      this.scene.stop();
      return;
    }

    // Skip UI if SpeedUpgrade is maxed
    const speedUpgrade = this.ecs.getComponent(playerId, 'speedUpgrade') || new SpeedUpgrade();
    if (speedUpgrade.count >= speedUpgrade.maxStacks) {
      this.scene.resume('MainScene');
      this.scene.stop();
      return;
    }

    // Pause MainScene
    this.scene.pause('MainScene');

    // Get initial game dimensions
    const { width, height } = this.sys.game.config;

    // Semi-transparent black background
    this.background = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 1)
      .setAlpha(0.7)
      .setDepth(100)
      .setOrigin(0.5);

    // "Choose Your Power-Up" text
    const baseFontSize = Math.max(30, 50 * (width / 1920));
    this.titleText = this.add.text(width / 2, height / 3, 'Choose Your Power-Up', {
      fontFamily: 'Arial',
      fontSize: `${baseFontSize}px`,
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(110);

    // Single power-up option (Speed Boost)
    const x = width / 2; // Centered
    const y = height * 2 / 3; // Lower on screen

    // 50x50 red circle
    this.powerUpCircle = this.add.circle(x, y, 25, this.powerUp.color)
      .setDepth(120)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.#selectPowerUp(this.powerUp.type));

    // Title text (20px Arial, white)
    this.powerUpTitle = this.add.text(x, y + 40, this.powerUp.title, {
      fontFamily: 'Arial',
      fontSize: '20px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(120);

    // Handle resize events
    this.scale.on('resize', (gameSize) => {
      const newWidth = gameSize.width;
      const newHeight = gameSize.height;

      // Update background
      this.background.setPosition(newWidth / 2, newHeight / 2);
      this.background.setSize(newWidth, newHeight);

      // Update title text
      const newFontSize = Math.max(30, 50 * (newWidth / 1920));
      this.titleText.setFontSize(newFontSize);
      this.titleText.setPosition(newWidth / 2, newHeight / 3);

      // Update power-up
      const newX = newWidth / 2;
      const newY = newHeight * 2 / 3;
      this.powerUpCircle.setPosition(newX, newY);
      this.powerUpTitle.setPosition(newX, newY + 40);
    });

    // Resume on Space key press (for testing)
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.resume('MainScene');
      this.scene.stop();
    });
  }

  #selectPowerUp(type) {
    if (type !== 'speed') return;

    // Find player entity
    const playerId = [...this.ecs.queryManager.getEntitiesWith('entityType')]
      .find(id => this.ecs.getComponent(id, 'entityType').type === 'player');

    if (!playerId) return;

    // Get or create SpeedUpgrade component
    let speedUpgrade = this.ecs.getComponent(playerId, 'speedUpgrade') || new SpeedUpgrade();
    if (speedUpgrade.count < speedUpgrade.maxStacks) {
      speedUpgrade.count += 1;
      this.ecs.addComponent(playerId, 'speedUpgrade', speedUpgrade);
    }

    // Resume game
    this.scene.resume('MainScene');
    this.scene.stop();
  }
}