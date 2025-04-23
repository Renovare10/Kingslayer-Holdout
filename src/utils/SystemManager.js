import RenderSystem from '../systems/RenderSystem.js';
import RotateToMouseSystem from '../systems/RotateToMouseSystem.js';
import PlayerMovementSystem from '../systems/PlayerMovementSystem.js';
import ZombieSystem from '../systems/ZombieSystem.js';
import PlayerShootingSystem from '../systems/PlayerShootingSystem.js';
import BulletSystem from '../systems/BulletSystem.js';
import HealthSystem from '../systems/HealthSystem.js';
import FlashSystem from '../systems/FlashSystem.js';

// Initializes and manages ECS systems.
export default class SystemManager {
  constructor(scene, ecs, zombieGroup, bulletGroup, gameState) {
    this.scene = scene;
    this.ecs = ecs;
    this.zombieGroup = zombieGroup;
    this.bulletGroup = bulletGroup;
    this.gameState = gameState;
  }

  initializeSystems() {
    this.ecs.addSystem(new RenderSystem(this.scene));
    this.ecs.addSystem(new RotateToMouseSystem(this.scene));
    this.ecs.addSystem(new PlayerMovementSystem(this.scene));
    this.ecs.addSystem(new PlayerShootingSystem(this.scene, this.bulletGroup));
    this.ecs.addSystem(new BulletSystem(this.scene, this.bulletGroup));
    this.ecs.addSystem(new ZombieSystem(this.scene, this.zombieGroup, this.gameState));
    this.ecs.addSystem(new HealthSystem(this.scene, this.zombieGroup));
    this.ecs.addSystem(new FlashSystem(this.scene));
  }
}