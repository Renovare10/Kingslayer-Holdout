# AI Context for Kingslayer Holdout

I’m working on a Phaser 3 game called "kingslayer-holdout" using Vite as the bundler. It’s a top-down survivor game with an ECS (Entity-Component-System) architecture for scalability. The current codebase is:

- **File Structure**:
  - `index.html`: Full-screen setup with no margins.
  - `src/main.js`: Phaser config (AUTO, full-screen, RESIZE mode).
  - `src/scenes/`:
    - `PreloaderScene.js`: Loads assets (e.g., 20 player frames, zombie sprite).
    - `MainScene.js`: Game logic, creates player and zombie, adds systems, renders static box.
  - `src/components/`:
    - `Position.js`: `export default class Position { constructor(x, y) { this.x = x; this.y = y; } }` for entity coords.
    - `Sprite.js`: `export default class Sprite { constructor(scene, x, y, key) { ... } }` creates Phaser sprite.
    - `RotateToMouse.js`: `createRotateToMouse()` returns `{ enabled: true }`.
    - `Movement.js`: `createMovement(speed, type)` returns `{ speed, velocity: { x, y }, type }`.
  - `src/systems/`:
    - `RenderSystem.js`: Creates/updates sprites (`initEntity(ecs)`, `update(ecs)` syncs `x/y`).
    - `RotateToMouseSystem.js`: Rotates player to mouse (`update(ecs)`).
    - `PlayerMovementSystem.js`: Moves player with WASD (`update(ecs)`).
  - `src/entities/`:
    - `Player.js`: `export default function createPlayer(ecs, scene, x, y)` builds player with all components.
    - `Zombie.js`: `export function createZombie(ecs, scene, x, y)` builds zombie with `Position` and `Sprite`.
  - `src/utils/`:
    - `ECSManager.js`: Manages ECS (`createEntity`, `addComponent`, `getComponent`, `addSystem`, `update`, `initEntity`).
    - `animations.js`: `createAnimations(scene)` sets up ‘idle’ animation for player.
    - `camera.js`: `setupCamera(scene, targetSprite, backgroundColor, zoom)` configures camera.

- **Current State**:
  - Player at world (500, 500), animated with 20 frames (`survivor-idle_handgun_0.png` to `_19.png`), rotates to mouse, moves with WASD (speed 200).
  - Zombie at (500, -500), static, uses `zombie.png` loaded from `assets/Zombie/zombie.png`.
  - Static red box at (600, 600), 50x50, rendered directly in `MainScene` (not ECS).
  - Camera follows player, full-screen with background #E7C8A2, zoom 0.4.
  - Systems (`RenderSystem`, `RotateToMouseSystem`, `PlayerMovementSystem`) accept scene parameter.

- **Methodology**:
  - ECS: Entities are IDs, components are data, systems handle logic.
  - Key ECS Functions: `ecs.createEntity()`, `ecs.addComponent(id, name, data)`, `ecs.getComponent(id, name)`, `ecs.addSystem(system)`, `ecs.update(ecs)` (passes `this`), `ecs.initEntity(id, ecs)` (passes `this`).
  - Separation: Logic in systems/utils, scenes stay lean, one concept per file.
  - Modern JS: ES6+ with named/default exports, factory functions or classes for components.
  - Imports: Fixed to match export styles (default for `Player.js`, `Position.js`, `Sprite.js`; named for others).

- **Notes**:
  - `PreloaderScene.js` loads: player frames (`survivor-idle_handgun_0.png` to `_19.png`), zombie (`zombie.png`).
  - `MainScene.js` uses corrected paths (e.g., `../entities/Player.js`).
  - Zombie is static for now; future plans include movement and spawning systems.

Start from this setup and help me [your next task].