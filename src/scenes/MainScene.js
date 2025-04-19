import Phaser from 'phaser';
import ECSManager from '../utils/ECSManager.js';
import RenderSystem from '../systems/RenderSystem.js';
import { RotateToMouseSystem } from '../systems/RotateToMouseSystem.js';
import { PlayerMovementSystem } from '../systems/PlayerMovementSystem.js';
import { PlayerShootingSystem } from '../systems/PlayerShootingSystem.js';
import { BulletSystem } from '../systems/BulletSystem.js';
import createPlayer from '../entities/Player.js';
import { createAnimations } from '../utils/animations.js';
import { setupCamera } from '../utils/camera.js';
import { ZombieSystem } from '../systems/ZombieSystem.js';
import HealthSystem from '../systems/HealthSystem.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.ecs = new ECSManager();
  }

  create() {
    createAnimations(this);

    // Create zombie physics group
    const zombieGroup = this.physics.add.group();

    // Add systems to ECS
    this.ecs.addSystem(new RenderSystem(this));
    this.ecs.addSystem(new RotateToMouseSystem(this));
    this.ecs.addSystem(new PlayerMovementSystem(this));
    this.ecs.addSystem(new PlayerShootingSystem(this));
    this.ecs.addSystem(new BulletSystem(this));
    this.ecs.addSystem(new ZombieSystem(this, zombieGroup));
    this.ecs.addSystem(new HealthSystem(this, zombieGroup));

    // Create Player
    const playerId = createPlayer(this.ecs, this, 500, 500);
    const playerSprite = this.ecs.getComponent(playerId, 'sprite').phaserSprite;

    // Setup Camera
    setupCamera(this, playerSprite, '#E7C8A2', 0.4);

    // Add static red box as physics object
    const redBox = this.physics.add.staticImage(600, 600, null).setSize(50, 50).setOrigin(0.5);
    redBox.setTint(0xff0000); // Red color
    this.physics.add.collider(playerSprite, redBox); // Player-red box collision

    // Add player-zombie collision
    this.physics.add.collider(playerSprite, zombieGroup);

    // Add zombie-zombie collision
    this.physics.add.collider(zombieGroup, zombieGroup);

    // Add bullet-zombie collision (to be handled in BulletSystem)

    // Add health UI text (initial position will be updated in update())
    this.healthText = this.add.text(0, 0, 'Health: 100', {
      font: '80px Arial',
      fill: '#000000'
    }).setScrollFactor(0).setDepth(100); // Fix to screen, above other elements

    // Listen for health changes
    this.ecs.on('healthChanged', ({ health }) => {
      this.healthText.setText(`Health: ${health}`);
    });
  }

  update() {
    this.ecs.update();

    // Dynamically update health text position for autoCenter
    const offsetX = -(this.game.scale.width / 1.4) + 5; // Adjust for center, then add 5px padding
    const offsetY = -(this.game.scale.height / 1.4) + 5;
    this.healthText.setPosition(offsetX, offsetY);
  }
}