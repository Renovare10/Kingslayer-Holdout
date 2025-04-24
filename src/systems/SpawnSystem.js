import ZombieFactory from '../utils/ZombieFactory.js';

export default class SpawnSystem {
  constructor(scene, zombieGroup, gameState) {
    this.scene = scene;
    this.zombieGroup = zombieGroup;
    this.gameState = gameState;
  }

  init(ecs) {
    this.ecs = ecs;
    this.ecs.on('spawnZombie', ({ x, y }) => {
      if (this.zombieGroup.countActive() < this.gameState.getSettings().maxZombies) {
        ZombieFactory.createRandomZombie(this.ecs, this.scene, x, y, this.zombieGroup, this.gameState);
      }
    });
  }

  update(ecs) {
    const settings = this.gameState.getSettings();
    const spawnerEntities = ecs.queryManager.getEntitiesWith('spawn');

    spawnerEntities.forEach((spawnerId) => {
      const spawn = ecs.getComponent(spawnerId, 'spawn');

      if (this.zombieGroup.countActive() >= spawn.maxZombies) return;

      spawn.timer += this.scene.sys.game.loop.delta;
      const interval = this.getSpawnInterval();
      if (spawn.timer >= interval) {
        const spawnPos = this.getSpawnPosition(ecs);
        if (spawnPos) {
          ZombieFactory.createRandomZombie(ecs, this.scene, spawnPos.x, spawnPos.y, this.zombieGroup, this.gameState);
          if (Math.random() < spawn.clusterChance) {
            this.spawnCluster(spawnPos.x, spawnPos.y, spawn, ecs);
          }
        }
        spawn.timer = 0;
      }
    });
  }

  getSpawnInterval() {
    const baseInterval = this.getBaseInterval();
    return Math.max(200, baseInterval + this.getSineWaveOffset());
  }

  getBaseInterval() {
    const quadraticFactor = this.getQuadraticFactor();
    const minInterval = 500;
    const maxInterval = 2000;
    return minInterval + (maxInterval - minInterval) * quadraticFactor;
  }

  getQuadraticFactor() {
    const maxTime = 300;
    const progress = Math.min(this.gameState.gameTime / maxTime, 1);
    return (1 - progress) ** 2;
  }

  getSineWaveOffset() {
    const period = 20;
    const amplitude = 1.25 * 1000;
    const wave = Math.sin((this.gameState.gameTime * 2 * Math.PI) / period);
    const normalized = (wave + 1) / 2;
    const scaled = Math.pow(normalized, 3);
    return (scaled * 2 - 1) * amplitude;
  }

  getPlayerPosition(ecs) {
    const playerEntities = ecs.queryManager.getEntitiesWith(
      'entityType',
      'position',
      (id) => ecs.getComponent(id, 'entityType')?.type === 'player'
    );
    if (playerEntities.size === 0) return null;
    const playerId = [...playerEntities][0];
    return ecs.getComponent(playerId, 'position');
  }

  getSpawnPosition(ecs) {
    const playerPos = this.getPlayerPosition(ecs);
    if (!playerPos) return null;
    const settings = this.gameState.getSettings();
    const distance = settings.initialSpawnDistance;
    const angle = Phaser.Math.Between(0, 360) * (Math.PI / 180);
    return {
      x: playerPos.x + Math.cos(angle) * distance,
      y: playerPos.y + Math.sin(angle) * distance,
    };
  }

  spawnCluster(baseX, baseY, spawn, ecs) {
    const availableSlots = spawn.maxZombies - this.zombieGroup.countActive();
    const clusterSize = Phaser.Math.Between(spawn.clusterSizeMin, spawn.clusterSizeMax);
    const zombiesToSpawn = Math.min(clusterSize, availableSlots);

    for (let i = 0; i < zombiesToSpawn; i++) {
      const offsetAngle = Phaser.Math.Between(0, 360) * (Math.PI / 180);
      const offsetDistance = Phaser.Math.Between(0, spawn.clusterRadius);
      const x = baseX + Math.cos(offsetAngle) * offsetDistance;
      const y = baseY + Math.sin(offsetAngle) * offsetDistance;
      ZombieFactory.createRandomZombie(ecs, this.scene, x, y, this.zombieGroup, this.gameState);
    }
  }
}