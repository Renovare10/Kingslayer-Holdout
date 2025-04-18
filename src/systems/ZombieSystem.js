export class ZombieSystem {
  constructor(scene, zombieGroup) {
    this.scene = scene;
    this.zombieGroup = zombieGroup;
    this.ecs = null;
    this.spawnTimer = 0;
    this.spawnInterval = 2;
    this.spawnDistance = 800;
    this.zombieSpeed = 100;
  }

  async init(ecs) {
    this.ecs = ecs;
    const { createZombie } = await import('../entities/Zombie.js');
    this.createZombie = createZombie;
  }

  update(ecs) {
    const deltaSeconds = this.scene.game.loop.delta / 1000;
    this.updateSpawnTimer(deltaSeconds);
    this.moveZombiesTowardPlayer();
  }

  updateSpawnTimer(deltaSeconds) {
    this.spawnTimer += deltaSeconds;
    if (this.spawnTimer >= this.spawnInterval) {
      const playerPos = this.getPlayerPosition();
      if (playerPos) {
        this.spawnZombieAtDistance(playerPos);
        this.spawnTimer = 0;
      }
    }
  }

  getPlayerPosition() {
    const player = this.ecs.queryManager.getEntitiesWith(
      'position', 'entityType',
      id => this.ecs.getComponent(id, 'entityType')?.type === 'player'
    ).values().next().value;
    return player ? this.ecs.getComponent(player, 'position') : null;
  }

  spawnZombieAtDistance(playerPos) {
    const { x, y } = this.calculateSpawnPosition(playerPos);
    this.createZombie(this.ecs, this.scene, x, y, this.zombieGroup);
  }

  calculateSpawnPosition(playerPos) {
    const angle = Phaser.Math.FloatBetween(0, Math.PI * 2);
    return {
      x: playerPos.x + Math.cos(angle) * this.spawnDistance,
      y: playerPos.y + Math.sin(angle) * this.spawnDistance
    };
  }

  moveZombiesTowardPlayer() {
    const playerPos = this.getPlayerPosition();
    if (!playerPos) return;

    const zombies = this.getZombieEntities();
    for (const entityId of zombies) {
      this.updateZombieMovement(entityId, playerPos);
    }
  }

  getZombieEntities() {
    return this.ecs.queryManager.getEntitiesWith(
      'position', 'movement', 'entityType', 'physicsBody',
      id => this.ecs.getComponent(id, 'entityType')?.type === 'zombie'
    );
  }

  updateZombieMovement(entityId, playerPos) {
    const pos = this.ecs.getComponent(entityId, 'position');
    const move = this.ecs.getComponent(entityId, 'movement');
    const physicsBody = this.ecs.getComponent(entityId, 'physicsBody').body;

    const velocity = this.calculateZombieVelocity(pos, playerPos);
    this.applyVelocity(physicsBody, move, velocity);
    this.syncPositionWithPhysics(pos, physicsBody);
  }

  calculateZombieVelocity(zombiePos, playerPos) {
    const dx = playerPos.x - zombiePos.x;
    const dy = playerPos.y - zombiePos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance === 0) return { x: 0, y: 0 };

    return {
      x: (dx / distance) * this.zombieSpeed,
      y: (dy / distance) * this.zombieSpeed
    };
  }

  applyVelocity(physicsBody, move, velocity) {
    physicsBody.setVelocity(velocity.x, velocity.y);
    move.velocity.x = velocity.x;
    move.velocity.y = velocity.y;
  }

  syncPositionWithPhysics(pos, physicsBody) {
    pos.x = physicsBody.x;
    pos.y = physicsBody.y;
  }
}