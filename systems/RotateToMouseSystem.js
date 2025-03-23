export class RotateToMouseSystem {
  constructor(scene) {
      this.scene = scene;
  }

  update(entities, components) {
      const mouseX = this.scene.input.activePointer.x;
      const mouseY = this.scene.input.activePointer.y;

      entities.forEach((_, entityId) => {
          const { position, sprite, rotateToMouse } = components.get(entityId) || {};
          if (position && sprite && sprite.phaserSprite && rotateToMouse?.enabled) {
              const angle = Phaser.Math.Angle.Between(position.x, position.y, mouseX, mouseY);
              sprite.phaserSprite.rotation = angle;
          }
      });
  }
}