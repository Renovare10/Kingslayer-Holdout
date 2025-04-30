import Phaser from 'phaser';

/**
 * Displays a pause screen with a grey overlay, centered "Paused" text, and a resume button, activated/deactivated with Esc or click.
 */
export default class PauseScene extends Phaser.Scene {
  constructor() {
    super('PauseScene');
  }

  init(data) {
    this.ecs = data.ecs;
    this.sceneManager = data.sceneManager;
  }

  create() {
    // Pause MainScene
    this.scene.pause('MainScene');

    // Get game dimensions
    const { width, height } = this.sys.game.config;

    // Semi-transparent grey overlay
    this.overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x333333, 1)
      .setAlpha(0.7)
      .setDepth(100)
      .setOrigin(0.5);

    // "Paused" text, scaled to screen size
    const baseFontSize = Math.max(50, 50 * (width / 1920));
    this.pausedText = this.add.text(width / 2, height / 2.8, 'Paused', {
      fontFamily: 'Arial',
      fontSize: `${baseFontSize}px`,
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(110);

    // Resume button (rectangle)
    this.resumeButton = this.add.rectangle(width / 2, height / 1.6, 400, 80, 0x666666)
      .setDepth(190)
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        this.scene.resume('MainScene');
        this.sceneManager.stopScene('PauseScene');
      });

    // "Resume" text on button
    this.resumeText = this.add.text(width / 2, height / 1.6, 'Resume', {
      fontFamily: 'Arial',
      fontSize: '40px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(195);

    // Handle resize events
    this.scale.on('resize', (gameSize) => {
      const newWidth = gameSize.width;
      const newHeight = gameSize.height;

      // Update overlay
      this.overlay.setPosition(newWidth / 2, newHeight / 2);
      this.overlay.setSize(newWidth, newHeight);

      // Update paused text
      const newFontSize = Math.max(50, 50 * (newWidth / 1920));
      this.pausedText.setFontSize(newFontSize);
      this.pausedText.setPosition(newWidth / 2, newHeight / 2.8);

      // Update resume button and text
      this.resumeButton.setPosition(newWidth / 2, newHeight / 1.8);
      this.resumeText.setPosition(newWidth / 2, newHeight / 1.8);
    });

    // Resume on Esc key press
    this.input.keyboard.on('keydown-ESC', () => {
      this.scene.resume('MainScene');
      this.sceneManager.stopScene('PauseScene');
    });
  }
}