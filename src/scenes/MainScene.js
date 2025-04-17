import Phaser from 'phaser';
import ECSManager from '../utils/ECSManager.js';
import RenderSystem from '../systems/RenderSystem.js';
import { RotateToMouseSystem } from '../systems/RotateToMouseSystem.js';
import { PlayerMovementSystem } from '../systems/PlayerMovementSystem.js';
import createPlayer from '../entities/Player.js';
import { createAnimations } from '../utils/animations.js';
import { setupCamera } from '../utils/camera.js';
import { ZombieSystem } from '../systems/ZombieSystem.js';
import { BulletSystem } from '../systems/BulletSystem.js';
import { PlayerShootingSystem } from '../systems/PlayerShootingSystem.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.ecs = new ECSManager();
  }

  create() {
    createAnimations(this);

    // Add systems to ECS
    this.ecs.addSystem(new RenderSystem(this));
    this.ecs.addSystem(new RotateToMouseSystem(this));
    this.ecs.addSystem(new PlayerMovementSystem(this));
    //this.ecs.addSystem(new ZombieSystem(this));
    this.ecs.addSystem(new PlayerShootingSystem(this));
    this.ecs.addSystem(new BulletSystem(this));

    // Create Player
    const playerId = createPlayer(this.ecs, this, 500, 500);
    const playerSprite = this.ecs.getComponent(playerId, 'sprite').phaserSprite;

    // Setup Camera
    setupCamera(this, playerSprite, '#E7C8A2', 0.4);

    // Add static red box as physics object
    const redBox = this.physics.add.staticImage(600, 600, null).setSize(50, 50).setOrigin(0.5);
    redBox.setTint(0xff0000); // Red color
    this.physics.add.collider(playerSprite, redBox); // Add collision
  }

  update() {
    this.ecs.update();
  }
}