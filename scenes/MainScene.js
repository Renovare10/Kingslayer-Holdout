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
      createAnimations(this);
      this.ecs.addSystem(new RenderSystem(this));
      this.ecs.addSystem(new RotateToMouseSystem(this));
      const playerId = createPlayer(this.ecs, this, 500, 500);

      const playerSprite = this.ecs.getComponent(playerId, 'sprite').phaserSprite;
      playerSprite.play('idle');

      setupCamera(this, playerSprite, '#E7C8A2', 0.4);
    }

    update() {
      this.ecs.update();
    }
}