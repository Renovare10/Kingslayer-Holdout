import Phaser from 'phaser';
import SpeedUpgrade from '../components/upgrades/SpeedUpgrade.js';
import MagnetUpgrade from '../components/upgrades/MagnetUpgrade.js';

/**
 * Displays the upgrade selection UI when the player levels up.
 */
export default class UpgradeScene extends Phaser.Scene {
  constructor() {
    super('UpgradeScene');
    this.powerUps = [
      { type: 'speed', color: 0xff0000, title: 'Speed Boost' },
      { type: 'magnet', color: 0x0000ff, title: 'XP Magnet' },
    ];
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

    // Skip UI if all upgrades are maxed
    const speedUpgrade = this.ecs.getComponent(playerId, 'speedUpgrade') || new SpeedUpgrade();
    const magnetUpgrade = this.ecs.getComponent(playerId, 'magnetUpgrade') || new MagnetUpgrade();
    if (speedUpgrade.count >= speedUpgrade.maxStacks && magnetUpgrade.count >= magnetUpgrade.maxStacks) {
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

    // Power-up options (filter out maxed upgrades)
    const availablePowerUps = this.powerUps.filter(powerUp => {
      if (powerUp.type === 'speed') return speedUpgrade.count < speedUpgrade.maxStacks;
      if (powerUp.type === 'magnet') return magnetUpgrade.count < magnetUpgrade.maxStacks;
      return false;
    });

    this.powerUpElements = availablePowerUps.map((powerUp, index) => {
      const x = width / 2 + (index - (availablePowerUps.length - 1) / 2) * 150; // Center with 150px spacing
      const y = height * 2 / 3; // Lower on screen

      // 50x50 colored circle
      const circle = this.add.circle(x, y, 25, powerUp.color)
        .setDepth(120)
        .setOrigin(0.5)
        .setInteractive()
        .on('pointerdown', () => this.#selectPowerUp(powerUp.type));

      // Title text (20px Arial, white)
      const title = this.add.text(x, y + 40, powerUp.title, {
        fontFamily: 'Arial',
        fontSize: '20px',
        color: '#ffffff',
      }).setOrigin(0.5).setDepth(120);

      return { circle, title };
    });

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

      // Update power-up elements
      this.powerUpElements.forEach((element, index) => {
        const x = newWidth / 2 + (index - (availablePowerUps.length - 1) / 2) * 150; // Recenter
        const y = newHeight * 2 / 3;
        element.circle.setPosition(x, y);
        element.title.setPosition(x, y + 40);
      });
    });

    // Resume on Space key press (for testing)
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.resume('MainScene');
      this.scene.stop();
    });
  }

  #selectPowerUp(type) {
    // Find player entity
    const playerId = [...this.ecs.queryManager.getEntitiesWith('entityType')]
      .find(id => this.ecs.getComponent(id, 'entityType').type === 'player');

    if (!playerId) return;

    if (type === 'speed') {
      let speedUpgrade = this.ecs.getComponent(playerId, 'speedUpgrade') || new SpeedUpgrade();
      if (speedUpgrade.count < speedUpgrade.maxStacks) {
        speedUpgrade.count += 1;
        this.ecs.addComponent(playerId, 'speedUpgrade', speedUpgrade);
      }
    } else if (type === 'magnet') {
      let magnetUpgrade = this.ecs.getComponent(playerId, 'magnetUpgrade') || new MagnetUpgrade();
      if (magnetUpgrade.count < magnetUpgrade.maxStacks) {
        magnetUpgrade.count += 1;
        this.ecs.addComponent(playerId, 'magnetUpgrade', magnetUpgrade);
      }
    }

    // Resume game
    this.scene.resume('MainScene');
    this.scene.stop();
  }
}