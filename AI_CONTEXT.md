# AI Context for Kingslayer Holdout

I’m working on a Phaser 3 game called "kingslayer-holdout" using Vite as the bundler. It’s a top-down survivor game with an ECS (Entity-Component-System) architecture for scalability. The current codebase is:

- **File Structure**:
  - `index.html`: Full-screen setup with no margins.
  - `src/main.js`: Phaser config (AUTO, full-screen, RESIZE mode).
  - `src/scenes/`:
    - `PreloaderScene.js`: Loads assets (e.g., `load.image` for 20 frames).
    - `MainScene.js`: Game logic, creates player, adds systems.
  - `src/components/`:
    - `Position.js`: `new Position(x, y)` for entity coords.
    - `Sprite.js`: `createSprite(key)` for sprite data.
    - `RotateToMouse.js`: `createRotateToMouse()` flags mouse rotation.
  - `src/systems/`:
    - `RenderSystem.js`: Renders sprites (`initEntity`, `update`).
    - `RotateToMouseSystem.js`: Rotates player to mouse (`update`).
  - `src/entities/`:
    - `Player.js`: `createPlayer(ecs, scene, x, y)` builds player entity.
  - `src/utils/`:
    - `ECSManager.js`: Manages ECS (`createEntity`, `addComponent`, `getComponent`, `addSystem`, `update`, `initEntity`).
    - `animations.js`: `createAnimations(scene)` sets up ‘idle’ animation.
    - `camera.js`: `setupCamera(scene, targetSprite, backgroundColor, zoom)` configures camera.

- **Current State**:
  - Player at world (500, 500), animated with 20 frames (`survivor-idle_handgun_0.png` to `_19.png`), rotates to mouse.
  - Camera follows player, full-screen with background #E7C8A2, zoom 0.4.
  - No other entities yet (e.g., zombies planned).

- **Methodology**:
  - ECS: Entities are IDs, components are data, systems handle logic.
  - Key ECS Functions: `ecs.createEntity()`, `ecs.addComponent(id, name, data)`, `ecs.getComponent(id, name)`, `ecs.addSystem(system)`, `ecs.update()`.
  - Separation: Logic in systems/utils, scenes stay lean.
  - Modern JS: ES6+ with named exports, factory functions for components.

Start from this setup and help me [your next task].