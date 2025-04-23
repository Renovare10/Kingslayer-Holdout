import Phaser from 'phaser';
import HealthUIManager from '../utils/HealthUIManager.js';

export default class HUDScene extends Phaser.Scene {
  constructor() {
    super('HUDScene');
  }

  create(data) {
    // Get ECS from data
    this.ecs = data.ecs;

    // Initialize HealthUIManager
    this.healthUIManager = new HealthUIManager(this, this.ecs);
    this.healthUIManager.initialize();
  }
}