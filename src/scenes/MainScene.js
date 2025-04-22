import Phaser from 'phaser';
import ECSManager from '../utils/ECSManager.js';
import UIManager from '../utils/UIManager.js';
import createPlayer from '../entities/Player.js';
import { createAnimations } from '../utils/animations.js';
import { setupCamera } from '../utils/camera.js';
import SystemManager from '../utils/SystemManager.js';
import PhysicsManager from '../utils/PhysicsManager.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.ecs = new ECSManager();
    this.isRestarting = false;
  }

  create() {
    // Clear existing animations
    this.anims.remove('idle');

    createAnimations(this);

    // Initialize physics
    const physicsManager = new PhysicsManager(this, this.ecs);
    physicsManager.initialize();

    // Initialize systems with zombieGroup and bulletGroup
    const systemManager = new SystemManager(this, this.ecs, physicsManager.getZombieGroup(), physicsManager.getBulletGroup());
    systemManager.initializeSystems();

    // Create player and setup collisions
    const playerId = createPlayer(this.ecs, this, 500, 500);
    const playerSprite = this.ecs.getComponent(playerId, 'sprite').phaserSprite;
    physicsManager.setupCollisions(playerSprite);

    // Setup camera
    setupCamera(this, playerSprite, '#E7C8A2', 0.4);

    // Initialize UI
    this.uiManager = new UIManager(this, this.ecs);
    this.uiManager.initialize();

    // Store managers for cleanup
    this.physicsManager = physicsManager;
    this.systemManager = systemManager;

    // Pause game and start GameOverScene on game over
    this.ecs.on('gameOver', () => {
      this.scene.pause();
      this.scene.start('GameOverScene', { ecs: this.ecs });
    });

    // Restart game on restartGame event
    this.ecs.on('restartGame', () => {
      this.isRestarting = true;

      // Clean up ECS
      this.ecs.entities.clear();
      this.ecs.components.clear();
      this.ecs.systems.length = 0;
      this.ecs.queryManager.componentIndex.clear();
      this.ecs.eventManager.clear();

      // Clean up physics
      if (this.physicsManager.zombieGroup && this.physicsManager.zombieGroup.children) {
        this.physicsManager.zombieGroup.clear(true, true);
      }
      if (this.physicsManager.bulletGroup && this.physicsManager.bulletGroup.children) {
        this.physicsManager.bulletGroup.clear(true, true);
      }

      // Clean up UI
      this.uiManager.destroy();

      // Restart scene
      this.scene.restart();

      // Nullify groups after restart
      this.physicsManager.zombieGroup = null;
      this.physicsManager.bulletGroup = null;
    });

    // Reset restarting flag
    this.isRestarting = false;
  }

  update() {
    if (!this.isRestarting) {
      this.ecs.update();
      this.uiManager.update();
    }
  }
}