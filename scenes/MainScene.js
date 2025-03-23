import Phaser from 'phaser';
import ECSManager from '../utils/ECSManager.js';
import RenderSystem from '../systems/RenderSystem.js';
import createPlayer from '../entities/Player.js';
import { createAnimations } from '../utils/animations.js';
import { setupCamera } from '../utils/camera.js';
import { RotateToMouseSystem } from '../systems/RotateToMouseSystem.js';
export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.ecs = new ECSManager();
    }

    create() {
      setupCamera(this);
      const centerX = this.cameras.main.width / 2;
      const centerY = this.cameras.main.height / 2;

      createAnimations(this);
      this.ecs.addSystem(new RenderSystem(this));
      this.ecs.addSystem(new RotateToMouseSystem(this));
      const playerId = createPlayer(this.ecs, this, centerX, centerY);

      const playerSprite = this.ecs.getComponent(playerId, 'sprite').phaserSprite;
      playerSprite.play('idle');
    }

    update() {
      this.ecs.update();
    }
}