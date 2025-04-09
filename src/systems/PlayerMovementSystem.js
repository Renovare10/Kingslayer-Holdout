export class PlayerMovementSystem {
  constructor(scene) {
    this.scene = scene;
    this.keys = scene.input.keyboard.addKeys('W,A,S,D');
  }

  update(ecs) {
    for (const entityId of ecs.components.keys()) {
      const movement = ecs.components.get(entityId)?.movement;
      if (movement && movement.type === 'player') {
        const position = ecs.components.get(entityId).position;
        movement.velocity.x = 0;
        movement.velocity.y = 0;
        if (this.keys.W.isDown) movement.velocity.y = -movement.speed;
        if (this.keys.S.isDown) movement.velocity.y = movement.speed;
        if (this.keys.A.isDown) movement.velocity.x = -movement.speed;
        if (this.keys.D.isDown) movement.velocity.x = movement.speed;
        position.x += movement.velocity.x * this.scene.game.loop.delta / 1000;
        position.y += movement.velocity.y * this.scene.game.loop.delta / 1000;
      }
    }
  }
}