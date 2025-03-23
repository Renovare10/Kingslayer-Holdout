import Phaser from 'phaser';
import ECSManager from '../utils/ECSManager.js';
import RenderSystem from '../systems/RenderSystem.js';
import { RotateToMouseSystem } from '../systems/RotateToMouseSystem.js';
import { PlayerMovementSystem } from '../systems/PlayerMovementSystem.js';
import createPlayer from '../entities/Player.js';
import { createAnimations } from '../utils/animations.js';
import { setupCamera } from '../utils/camera.js';
import Position from '../components/Position.js';
import Sprite from '../components/Sprite.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.ecs = new ECSManager();
  }

  create() {
    createAnimations(this);
    this.ecs.addSystem(new RenderSystem(this));
    this.ecs.addSystem(new RotateToMouseSystem(this));
    this.ecs.addSystem(new PlayerMovementSystem(this));
    const playerId = createPlayer(this.ecs, this, 500, 500);

    const playerSprite = this.ecs.getComponent(playerId, 'sprite').phaserSprite;
    playerSprite.play('idle');

    // Add a static red box directly (not ECS)
    this.add.rectangle(600, 600, 50, 50, 0xff0000).setOrigin(0.5);

    setupCamera(this, playerSprite, '#E7C8A2', 0.4);
  }

  update() {
    this.ecs.update();
  }
}