import Phaser from 'phaser';
import GameOverUIManager from '../utils/GameOverUIManager.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data) {
    // Store ECS for EventManager access
    this.ecs = data.ecs;

    // Initialize UI
    this.uiManager = new GameOverUIManager(this, this.ecs);
    this.uiManager.initialize();
  }
}