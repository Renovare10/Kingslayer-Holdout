import RenderSystem from '../systems/RenderSystem.js';
import RotateToMouseSystem from '../systems/RotateToMouseSystem.js';
import PlayerMovementSystem from '../systems/PlayerMovementSystem.js';
import PlayerShootingSystem from '../systems/PlayerShootingSystem.js';
import BulletSystem from '../systems/BulletSystem.js';
import HealthSystem from '../systems/HealthSystem.js';
import FlashSystem from '../systems/FlashSystem.js';
import MovementSystem from '../systems/MovementSystem.js';
import SpawnSystem from '../systems/SpawnSystem.js';
import LifecycleSystem from '../systems/LifecycleSystem.js';
import XPSystem from '../systems/XPSystem.js';
import PlayerUpgradeSystem from '../systems/PlayerUpgradeSystem.js';

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
    this.ecs.addSystem(new HealthSystem(this.scene, this.zombieGroup));
    this.ecs.addSystem(new FlashSystem(this.scene));
    this.ecs.addSystem(new SpawnSystem(this.scene, this.zombieGroup, this.gameState));
    this.ecs.addSystem(new MovementSystem(this.scene));
    this.ecs.addSystem(new LifecycleSystem(this.scene, this.zombieGroup, this.gameState));
    this.ecs.addSystem(new XPSystem(this.scene));
    this.ecs.addSystem(new PlayerUpgradeSystem(this.scene, this.ecs));
  }
}