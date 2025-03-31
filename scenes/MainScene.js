import Phaser from 'phaser';
import ECSManager from '../utils/ECSManager.js';
import RenderSystem from '../systems/RenderSystem.js';
import { RotateToMouseSystem } from '../systems/RotateToMouseSystem.js';
import { PlayerMovementSystem } from '../systems/PlayerMovementSystem.js';
import createPlayer from '../src/entities/Player.js';
import { createZombie } from '../src/entities/Zombie.js';
import { createAnimations } from '../utils/animations.js';
import { setupCamera } from '../utils/camera.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.ecs = new ECSManager();
  }

  create() {
    createAnimations(this);
    
    // Add systems (assuming they accept a scene parameter now)
    this.ecs.addSystem(new RenderSystem(this));
    this.ecs.addSystem(new RotateToMouseSystem(this));
    this.ecs.addSystem(new PlayerMovementSystem(this));

    // Create Player
    const playerId = createPlayer(this.ecs, this, 500, 500);
    const playerSprite = this.ecs.getComponent(playerId, 'sprite').phaserSprite;
    playerSprite.play('idle');

    // Create Zombie (above player)
    createZombie(this.ecs, this, 500, -500);

    // Setup Camera
    setupCamera(this, playerSprite, '#E7C8A2', 0.4);

    // Add a static red box directly (not ECS)
    this.add.rectangle(600, 600, 50, 50, 0xff0000).setOrigin(0.5);
  }

  update() {
    this.ecs.update();
  }
}