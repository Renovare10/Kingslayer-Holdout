import Phaser from 'phaser';
import Position from '../components/Position.js';
import { createXP } from '../components/XP.js';
import SpriteFactory from '../utils/SpriteFactory.js';

export default class PhysicsManager {
  constructor(scene, ecs) {
    this.scene = scene;
    this.ecs = ecs;
    this.zombieGroup = null;
    this.bulletGroup = null;
    this.xpGroup = null;
    this.spriteFactory = new SpriteFactory(scene);
  }

  initialize() {
    this.zombieGroup = this.scene.physics.add.group();
    this.bulletGroup = this.scene.physics.add.group();
    this.xpGroup = this.scene.physics.add.group();
  }

  getZombieGroup() {
    return this.zombieGroup;
  }

  getBulletGroup() {
    return this.bulletGroup;
  }

  getXPGroup() {
    return this.xpGroup;
  }

  setupCollisions(playerSprite) {
    // Static red box
    const redBox = this.scene.physics.add.staticImage(600, 600, null).setSize(50, 50).setOrigin(0.5);
    redBox.setTint(0xff0000);
    this.scene.physics.add.collider(playerSprite, redBox);

    // Player-zombie collision
    this.scene.physics.add.collider(playerSprite, this.zombieGroup);

    // Zombie-zombie collision
    this.scene.physics.add.collider(this.zombieGroup, this.zombieGroup);

    // Bullet-zombie collision
    this.scene.physics.add.overlap(this.bulletGroup, this.zombieGroup, (bulletSprite, zombieSprite) => {
      const bulletId = bulletSprite.entityId;
      const zombieId = zombieSprite.entityId;

      if (bulletId) this.ecs.destroyEntity(bulletId);
      if (zombieId) {
        const position = this.ecs.getComponent(zombieId, 'position');
        if (!position) return;

        const xpId = this.ecs.createEntity();
        this.ecs.addComponent(xpId, 'xp', createXP());
        this.ecs.addComponent(xpId, 'position', new Position(position.x, position.y));
        const spriteData = this.spriteFactory.createXPSprite(position.x, position.y);
        spriteData.phaserSprite.entityId = xpId;
        this.ecs.addComponent(xpId, 'sprite', spriteData);
        this.ecs.addComponent(xpId, 'physicsBody', { body: this.scene.physics.add.existing(spriteData.phaserSprite).body });
        this.xpGroup.add(spriteData.phaserSprite, true);

        this.ecs.destroyEntity(zombieId);
      }
    });

    // Player-XP collision
    this.scene.physics.add.overlap(playerSprite, this.xpGroup, (playerSprite, xpSprite) => {
      const xpId = xpSprite.entityId;
      if (!xpId) {
        console.warn('PhysicsManager: XP sprite missing entityId:', xpSprite);
        return;
      }

      const xp = this.ecs.getComponent(xpId, 'xp');
      if (!xp) return;

      // Find player entity
      const playerEntities = this.ecs.queryManager.getEntitiesWith('playerXP');
      if (playerEntities.size === 0) return;

      const playerId = [...playerEntities][0];
      const playerXP = this.ecs.getComponent(playerId, 'playerXP');
      if (!playerXP) return;

      // Update player XP and check for level-up
      const leveledUp = playerXP.addXP(xp.value);
      this.ecs.emit('xpChanged', { xp: playerXP.xp, level: playerXP.level });
      if (leveledUp) {
        this.ecs.emit('levelChanged', { level: playerXP.level });
      }

      // Destroy XP entity and sprites
      const spriteData = this.ecs.getComponent(xpId, 'sprite');
      if (spriteData) {
        if (spriteData.phaserSprite) {
          this.xpGroup.remove(spriteData.phaserSprite, true, true);
          spriteData.phaserSprite.destroy();
        }
        if (spriteData.flashSprite) {
          spriteData.flashSprite.destroy();
        }
      }
      this.ecs.destroyEntity(xpId);
    });
  }
}