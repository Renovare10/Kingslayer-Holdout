import Phaser from 'phaser';
import GameOverUIManager from '../utils/GameOverUIManager.js';

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  create(data) {
    // Store ECS and SceneManager
    this.ecs = data.ecs;
    this.sceneManager = data.sceneManager;

    // Initialize UI
    this.uiManager = new GameOverUIManager(this, this.ecs);
    this.uiManager.initialize();
  }
}