export class RotateToMouseSystem {
  constructor(scene) {
    this.scene = scene;
  }

  init(ecs) {
    this.ecs = ecs; // Add init to store ecs
  }

  update(ecs) {
    const pointer = this.scene.input.activePointer;
    const camera = this.scene.cameras.main;
    const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);

    const entities = ecs.queryManager.getEntitiesWith(
      'rotatetomouse', 'sprite', 'position', 'entityType',
      id => this.ecs.getComponent(id, 'entityType')?.type === 'player'
    );
    entities.forEach(entityId => {
      const rotateToMouse = ecs.getComponent(entityId, 'rotatetomouse');
      if (rotateToMouse?.enabled) {
        const position = ecs.getComponent(entityId, 'position');
        const sprite = ecs.getComponent(entityId, 'sprite').phaserSprite;
        const angle = Phaser.Math.Angle.Between(position.x, position.y, worldPoint.x, worldPoint.y);
        sprite.rotation = angle - 0.1; // Adjust offset
      }
    });
  }
}