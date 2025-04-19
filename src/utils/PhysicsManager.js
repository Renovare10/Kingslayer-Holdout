import Phaser from 'phaser';

export default class PhysicsManager {
  constructor(scene, ecs) {
    this.scene = scene;
    this.ecs = ecs;
    this.zombieGroup = null;
    this.bulletGroup = null;
  }

  initialize() {
    this.zombieGroup = this.scene.physics.add.group();
    this.bulletGroup = this.scene.physics.add.group();
  }

  getZombieGroup() {
    return this.zombieGroup;
  }

  getBulletGroup() {
    return this.bulletGroup;
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
      if (zombieId) this.ecs.destroyEntity(zombieId);
    });
  }
}