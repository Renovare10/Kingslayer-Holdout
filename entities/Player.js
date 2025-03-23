import Position from '../components/Position.js';
import { createSprite } from '../components/Sprite.js';
import { createRotateToMouse } from '../components/RotateToMouse.js';

export default function createPlayer(ecs, scene, x, y) {
    const entityId = ecs.createEntity();
    ecs.addComponent(entityId, 'position', new Position(x, y));
    ecs.addComponent(entityId, 'sprite', createSprite('survivor-idle'));
    ecs.addComponent(entityId, 'rotateToMouse', createRotateToMouse());
    return entityId;
}