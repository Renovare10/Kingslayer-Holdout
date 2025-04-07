# AI Context for Kingslayer Holdout

I’m working on a Phaser 3 game called "kingslayer-holdout" using Vite as the bundler. It’s a top-down survivor game with an ECS (Entity-Component-System) architecture for scalability. The project is managed on GitHub, using the `main` branch with frequent commits for version control. The current codebase is:

## File Structure
- `index.html`: Full-screen setup with no margins.
- `src/main.js`: Phaser config (AUTO, full-screen, RESIZE mode).
- `src/scenes/`:
  - `PreloaderScene.js`: Loads assets (e.g., 20 player frames, zombie sprite).
  - `MainScene.js`: Game logic, creates player and zombie, adds systems, renders static box.
- `src/components/`:
  - `Position.js`: `export default class Position { constructor(x, y) { this.x = x; this.y = y; } }` - Stores entity coordinates with:
    - `x`: Number - X position in world space.
    - `y`: Number - Y position in world space.
  - `Sprite.js`: `export default class Sprite { constructor(scene, x, y, key) { ... } }` - Creates Phaser sprite, properties:
    - `phaserSprite`: Phaser.GameObjects.Sprite - The actual sprite object.
  - `RotateToMouse.js`: `export function createRotateToMouse()` returns:
    - `enabled`: Boolean - Whether the entity rotates to face the mouse.
  - `Movement.js`: `export function createMovement(speed, type)` returns:
    - `speed`: Number (e.g., 200 for player, 100 for zombie) - Movement speed in pixels per second.
    - `velocity`: Object `{ x: Number, y: Number }` - Current movement direction and magnitude.
    - `type`: String (e.g., `'player'`, `'zombie'`) - Identifies movement behavior or entity type.
- `src/systems/`:
  - `RenderSystem.js`: Creates/updates sprites (`initEntity(ecs)`, `update(ecs)` syncs `x/y`).
  - `RotateToMouseSystem.js`: Rotates player to mouse (`update(ecs)`).
  - `PlayerMovementSystem.js`: Moves player with WASD (`update(ecs)`).
  - `ZombieSystem.js`: Spawns zombies every 2s at 800 units from player, moves them toward player at speed 100 (`update(ecs)`). `createZombie` import moved to `init`.
- `src/entities/`:
  - `Player.js`: `export default function createPlayer(ecs, scene, x, y)` builds player with `Position`, `Sprite`, `RotateToMouse`, `Movement`, and `'player'` components.
  - `Zombie.js`: `export function createZombie(ecs, scene, x, y)` builds zombie with `Position`, `Sprite`, `Movement`, and `'zombie'` components.
- `src/utils/`:
  - `ECSManager.js`: Manages ECS (`createEntity`, `addComponent`, `getComponent`, `removeComponent`, `destroyEntity`, `addSystem`, `update`, `initEntity`).
  - `QueryManager.js`: Handles component-based queries (`getEntitiesWith(...componentNames)`), maintains `componentIndex`, includes error handling.
  - `animations.js`: `createAnimations(scene)` sets up ‘idle’ animation for player.
  - `camera.js`: `setupCamera(scene, targetSprite, backgroundColor, zoom)` configures camera.

## Current State
- Player at world (500, 500), animated with 20 frames (`survivor-idle_handgun_0.png` to `_19.png`), rotates to mouse, moves with WASD (speed 200).
- Zombies spawn every 2s, 800 units from player in a random direction, move toward player (speed 100), use `zombie.png` loaded from `assets/Zombie/zombie.png`.
- Static red box at (600, 600), 50x50, rendered directly in `MainScene` (not ECS).
- Camera follows player, full-screen with background #E7C8A2, zoom 0.4.
- Systems (`RenderSystem`, `RotateToMouseSystem`, `PlayerMovementSystem`, `ZombieSystem`) accept scene parameter and use `ecs.queryManager`.

## Methodology
- ECS: Entities are IDs, components are data, systems handle logic.
- Key ECS Functions:
  - `ecs.createEntity()`: Returns new ID.
  - `ecs.addComponent(id, name, data)`: Adds component, updates `queryManager.componentIndex`.
  - `ecs.getComponent(id, name)`: Retrieves component data.
  - `ecs.removeComponent(id, name)`: Removes component, updates index.
  - `ecs.destroyEntity(id)`: Deletes entity and all its components, updates index.
  - `ecs.addSystem(system)`: Adds system, calls `system.init(ecs)`.
  - `ecs.update()`: Runs `system.update(ecs)` for all systems.
  - `ecs.initEntity(id)`: Calls `system.initEntity(id, ecs)` for all systems.
  - `ecs.queryManager.getEntitiesWith(...names)`: Returns `Set` of entity IDs with all specified components, throws error if not initialized.
- Separation: Logic in systems/utils, scenes stay lean, one concept per file. `QueryManager` separates querying from ECS core.
- Modern JS: ES6+ with named/default exports, factory functions or classes for components.
- Imports: Fixed to match export styles (default for `Player.js`, `Position.js`, `Sprite.js`; named for others).
- Version Control: Hosted on GitHub, `main` branch, frequent commits.

## Notes
- `PreloaderScene.js` loads: player frames (`survivor-idle_handgun_0.png` to `_19.png`), zombie (`zombie.png`).
- `MainScene.js` uses corrected paths (e.g., `../entities/Player.js`).
- Zombies use `QueryManager` for efficient player/zombie lookups.
- `ZombieSystem`: Moved `await import('../src/entities/Zombie.js')` to `init`, stored as `this.createZombie`.
- `QueryManager`: Added error handling (`throw` if not initialized).
- Next feature: Bullets/lasers to destroy zombies, leveraging `destroyEntity`. Considering an event system (`ecs.emit`).
- **Context Format**: Future updates should be provided as Markdown (`.md`) files within `<xaiArtifact>` tags for easy copy-pasting (e.g., to GitHub). To manage size, provide the latest `AI_Context.md` at thread start; updates will modify specific sections (e.g., `File Structure`, `Notes`) rather than regenerating the entire file, unless a full refresh is requested.

Start from this setup and help me [your next task].