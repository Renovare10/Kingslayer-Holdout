import Phaser from 'phaser';
import ECSManager from '../utils/ECSManager.js';
import GameState from '../utils/GameState.js';
import createPlayer from '../entities/Player.js';
import { createAnimations } from '../utils/animations.js';
import { setupCamera } from '../utils/camera.js';
import SystemManager from '../utils/SystemManager.js';
import PhysicsManager from '../utils/PhysicsManager.js';
import SceneManager from '../utils/SceneManager.js';
import { createSpawn } from '../components/Spawn.js';

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
    this.ecs = new ECSManager();
    this.isRestarting = false;
  }

  create() {
    this.anims.remove('idle');
    createAnimations(this);

    this.gameState = new GameState();
    const physicsManager = new PhysicsManager(this, this.ecs);
    physicsManager.initialize();

    const systemManager = new SystemManager(this, this.ecs, physicsManager.getZombieGroup(), physicsManager.getBulletGroup(), this.gameState);
    systemManager.initializeSystems();

    const spawnerId = this.ecs.createEntity();
    this.ecs.addComponent(spawnerId, 'spawn', createSpawn(this.gameState.getSettings()));

    const playerId = createPlayer(this.ecs, this, 500, 500);
    const playerSprite = this.ecs.getComponent(playerId, 'sprite').phaserSprite;
    physicsManager.setupCollisions(playerSprite);

    setupCamera(this, playerSprite, '#E7C8A2', 0.4);
    this.scene.launch('HUDScene', { ecs: this.ecs });

    this.physicsManager = physicsManager;
    this.systemManager = systemManager;
    this.sceneManager = new SceneManager(this.game);

    this.ecs.on('gameOver', () => {
      this.scene.pause();
      this.scene.launch('GameOverScene', { ecs: this.ecs, sceneManager: this.sceneManager });
    });

    this.ecs.on('restartGame', () => {
      this.isRestarting = true;
      this.sceneManager.restartScene('MainScene', {
        ecs: this.ecs,
        physicsManager: this.physicsManager,
      });
      this.isRestarting = false;
      this.gameState = new GameState();
    });
  }

  update() {
    if (!this.isRestarting) {
      this.gameState.update(this.sys.game.loop.delta);
      this.ecs.update();
    }
  }
}