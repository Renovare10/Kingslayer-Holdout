import Phaser from 'phaser';
import ECSManager from '../utils/ECSManager.js';
import RenderSystem from '../systems/RenderSystem.js';
import createPlayer from '../entities/Player.js';
import { createAnimations } from '../utils/animations.js';

export default class MainScene extends Phaser.Scene {
    constructor() {
        super('MainScene');
        this.ecs = new ECSManager();
    }

    create() {
      // Set background to a light brown color
      this.cameras.main.setBackgroundColor('#E7C8A2');

      createAnimations(this);
      this.ecs.addSystem(new RenderSystem(this));
      const playerId = createPlayer(this.ecs, this, 400, 400);

      const playerSprite = this.ecs.getComponent(playerId, 'sprite').phaserSprite;
      playerSprite.play('idle');
    }

    update() {
      this.ecs.update();
    }
}