import Position from '../../components/Position.js';  // Default import
import Sprite from '../../components/Sprite.js';      // Default import

export function createZombie(ecs, scene, x, y) {
  const zombieId = ecs.createEntity();
  
  // Add Position component
  ecs.addComponent(zombieId, 'position', new Position(x, y));
  
  // Add Sprite component
  ecs.addComponent(zombieId, 'sprite', new Sprite(scene, x, y, 'zombie'));
  
  // Initialize the entity in the ECS
  ecs.initEntity(zombieId, ecs);
  
  return zombieId;
}