// src/systems/PlayerMovementSystem.js
export default class PlayerMovementSystem {
  constructor(scene) {
    this.scene = scene;
  }

  init(ecs) {
    this.ecs = ecs;
  }

  update(ecs) {
    const player = ecs.queryManager.getEntitiesWith(
      'movement',
      'entityType',
      'physicsBody',
      id => ecs.getComponent(id, 'entityType')?.type === 'player'
    ).values().next().value;
    if (!player) return;

    const movement = ecs.getComponent(player, 'movement');
    const physicsBody = ecs.getComponent(player, 'physicsBody').body;
    const cursors = this.scene.input.keyboard.addKeys('W,A,S,D');

    movement.velocity.x = 0;
    movement.velocity.y = 0;

    if (cursors.W.isDown) movement.velocity.y = -movement.speed;
    if (cursors.S.isDown) movement.velocity.y = movement.speed;
    if (cursors.A.isDown) movement.velocity.x = -movement.speed;
    if (cursors.D.isDown) movement.velocity.x = movement.speed;

    // Normalize diagonal movement
    const speed = movement.speed;
    const velocity = movement.velocity;
    const magnitude = Math.sqrt(velocity.x ** 2 + velocity.y ** 2);
    if (magnitude > speed) {
      velocity.x = (velocity.x / magnitude) * speed;
      velocity.y = (velocity.y / magnitude) * speed;
    }

    // Apply velocity to physics body
    physicsBody.setVelocity(velocity.x, velocity.y);

    // Sync position component with physics body
    const position = ecs.getComponent(player, 'position');
    position.x = physicsBody.x;
    position.y = physicsBody.y;
  }
}