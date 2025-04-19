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
  }

  create() {
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

    // Create UI Manager
    this.uiManager = new UIManager(this, this.ecs);

    // Add health UI component
    this.uiManager.addComponent('health', {
      text: 'Health: 100',
      position: 'top-left',
      font: '80px Arial',
      fill: '#000000',
      depth: 100,
      updateFn: (id, uiManager) => {
        // Listen for health changes
        uiManager.ecs.on('healthChanged', ({ health }) => {
          const component = uiManager.components.get(id);
          if (component) {
            component.text.setText(`Health: ${health}`);
          }
        });
      }
    });
  }

  update() {
    this.ecs.update();
    this.uiManager.update();
  }
}