/**
 * Listens for level-up events and launches the UpgradeScene.
 */
export default class PlayerUpgradeSystem {
  constructor(scene, ecs) {
    this.scene = scene;
    this.ecs = ecs;
  }

  init() {
    this.ecs.on('levelChanged', () => {
      this.scene.scene.launch('UpgradeScene', { ecs: this.ecs });
    });
  }

  update() {
    // No continuous updates needed yet
  }
}