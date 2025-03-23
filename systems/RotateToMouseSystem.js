export class RotateToMouseSystem {
    constructor(scene) {
      this.scene = scene;
    }
  
    update(entities, components) {
      const pointer = this.scene.input.activePointer;
      const camera = this.scene.cameras.main;
      const worldPoint = camera.getWorldPoint(pointer.x, pointer.y);
  
      for (const entityId of components.keys()) {
        const rotateToMouse = components.get(entityId)?.rotateToMouse;
        if (rotateToMouse?.enabled) {
          const position = components.get(entityId).position;
          const sprite = components.get(entityId).sprite;
          if (position && sprite && sprite.phaserSprite) {
            const angle = Phaser.Math.Angle.Between(position.x, position.y, worldPoint.x, worldPoint.y);
            sprite.phaserSprite.rotation = angle;
          }
        }
      }
    }
  }