export class PlayerMovementSystem {
  constructor(scene) {
    this.scene = scene;
  }

  init(ecs) {
    this.ecs = ecs;
  }

  update(ecs) {
    const player = ecs.queryManager.getEntitiesWith(
      'movement', 'entityType',
      id => this.ecs.getComponent(id, 'entityType')?.type === 'player'
    ).values().next().value;
    if (!player) return;

    const movement = ecs.getComponent(player, 'movement');
    const position = ecs.getComponent(player, 'position');
    const cursors = this.scene.input.keyboard.addKeys('W,A,S,D');

    movement.velocity.x = 0;
    movement.velocity.y = 0;

    if (cursors.W.isDown) movement.velocity.y = -movement.speed;
    if (cursors.S.isDown) movement.velocity.y = movement.speed;
    if (cursors.A.isDown) movement.velocity.x = -movement.speed;
    if (cursors.D.isDown) movement.velocity.x = movement.speed;

    position.x += movement.velocity.x * (this.scene.game.loop.delta / 1000);
    position.y += movement.velocity.y * (this.scene.game.loop.delta / 1000);
  }
}