import Phaser from 'phaser';
import ECSManager from '../utils/ECSManager.js';
import createPlayer from '../entities/Player.js';
import { createAnimations } from '../utils/animations.js';
import { setupCamera } from '../utils/camera.js';
import SystemManager from '../utils/SystemManager.js';
import PhysicsManager from '../utils/PhysicsManager.js';
import SceneManager from '../utils/SceneManager.js';

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

    // Launch HUDScene in parallel with ECS
    this.scene.launch('HUDScene', { ecs: this.ecs });

    // Store managers for cleanup
    this.physicsManager = physicsManager;
    this.systemManager = systemManager;

    // Initialize SceneManager
    this.sceneManager = new SceneManager(this.game);

    // Pause game and start GameOverScene on game over
    this.ecs.on('gameOver', () => {
      this.scene.pause();
      this.scene.launch('GameOverScene', { ecs: this.ecs, sceneManager: this.sceneManager });
    });

    // Restart game on restartGame event
    this.ecs.on('restartGame', () => {
      this.isRestarting = true;
      this.sceneManager.restartScene('MainScene', {
        ecs: this.ecs,
        physicsManager: this.physicsManager,
      });
      this.isRestarting = false;
    });
  }

  update() {
    if (!this.isRestarting) {
      this.ecs.update();
    }
  }
}