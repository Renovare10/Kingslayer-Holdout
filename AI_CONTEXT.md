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
  - `Movement.js`: `export function createMovement(speed, velocity = { x: 0, y: 0 })` returns:
    - `speed`: Number (e.g., 200 for player, 100 for zombie, 4000 for bullet) - Movement speed in pixels per second.
    - `velocity`: Object `{ x: Number, y: Number }` - Current movement direction and magnitude.
  - `Shooting.js`: `export function createShooting(cooldown = 0.2)` returns:
    - `enabled`: Boolean - Whether shooting is active.
    - `cooldown`: Number - Time between shots in seconds (default 0.2).
    - `currentCooldown`: Number - Remaining cooldown time.
  - `Bullet.js`: `export function createBullet(damage = 10, lifespan = 5000)` returns:
    - `damage`: Number - Damage dealt on hit (default 10).
    - `createdAt`: Number - Creation timestamp (ms).
    - `lifespan`: Number - Duration before despawn (ms, default 5000).
  - `EntityType.js`: `export function createEntityType(type)` returns:
    - `type`: String (e.g., `'player'`, `'zombie'`, `'bullet'`) - Identifies entity type.
- `src/systems/`:
  - `RenderSystem.js`: Creates/updates sprites (`initEntity(ecs)`, `update(ecs)` syncs `x/y` for non-bullet entities with `!bullet` check).
  - `RotateToMouseSystem.js`: Rotates player to mouse (`update(ecs)`).
  - `PlayerMovementSystem.js`: Moves player with WASD (`update(ecs)`).
  - `ZombieSystem.js`: Spawns zombies every 2s at 800 units from player, moves them toward player at speed 100 (`update(ecs)`). `createZombie` import moved to `init`.
  - `PlayerShootingSystem.js`: Fires bullets on click (`update(ecs)`), uses event system (`ecs.emit`).
  - `BulletSystem.js`: Moves bullets, renders as 14x3 black rectangles, despawns after lifespan (`update(ecs)`).
- `src/entities/`:
  - `Player.js`: `export default function createPlayer(ecs, scene, x, y)` builds player with `'position'`, `'sprite'`, `'rotatetomouse'`, `'movement'`, `'shooting'`, `'entityType' ('player')`.
  - `Zombie.js`: `export function createZombie(ecs, scene, x, y)` builds zombie with `'position'`, `'sprite'`, `'movement'`, `'zombie'`, `'entityType' ('zombie')`.
  - `Bullet.js`: `export function createBullet(ecs, scene, x, y, velocity)` builds bullet with `'position'`, `'movement'`, `'sprite'`, `'bullet'`, `'entityType' ('bullet')`.
- `src/utils/`:
  - `ECSManager.js`: Manages ECS (`createEntity`, `addComponent`, `getComponent`, `removeComponent`, `destroyEntity`, `addSystem`, `update`, `initEntity`, `emit`, `on`).
  - `QueryManager.js`: Handles component-based queries (`getEntitiesWith(...componentNames, filter)`), maintains `componentIndex`, includes error handling.
  - `animations.js`: `createAnimations(scene)` sets up ‘idle’ animation for player.
  - `camera.js`: `setupCamera(scene, targetSprite, backgroundColor, zoom)` configures camera.

## Current State
- Player at world (500, 500), animated with 20 frames (`survivor-idle_handgun_0.png` to `_19.png`), rotates to mouse, moves with WASD (speed 200), shoots bullets on click (speed 4000, cooldown 0.2s).
- Zombies spawn every 2s, 800 units from player in a random direction, move toward player (speed 100), use `zombie.png` loaded from `assets/Zombie/zombie.png`.
- Bullets are 14x3 black rectangles, move at 4000 pixels/sec toward mouse, despawn after 5000ms.
- Static red box at (600, 600), 50x50, rendered directly in `MainScene` (not ECS).
- Camera follows player, full-screen with background `#E7C8A2`, zoom 0.4.
- Systems (`RenderSystem`, `RotateToMouseSystem`, `PlayerMovementSystem`, `ZombieSystem`, `PlayerShootingSystem`, `BulletSystem`) accept scene parameter and use `ecs.queryManager`.

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
  - `ecs.queryManager.getEntitiesWith(...names, filter)`: Returns `Set` of entity IDs with specified components, optional filter by value, throws error if not initialized.
  - `ecs.emit(eventName, data)`: Emits event to registered listeners.
  - `ecs.on(eventName, callback)`: Registers event listener.
- Separation: Logic in systems/utils, scenes stay lean, one concept per file. `QueryManager` separates querying from ECS core.
- Modern JS: ES6+ with named/default exports, factory functions or classes for components.
- Imports: Fixed to match export styles (default for `Player.js`, `Position.js`, `Sprite.js`; named for others).
- Version Control: Hosted on GitHub, `main` branch, frequent commits.

## Notes
- `PreloaderScene.js` loads: player frames (`survivor-idle_handgun_0.png` to `_19.png`), zombie (`zombie.png`).
- `MainScene.js` uses corrected paths (e.g., `../entities/Player.js`).
- Zombies use `QueryManager` for efficient player/zombie lookups.
- `ZombieSystem`: Moved `await import('../src/entities/Zombie.js')` to `init`, stored as `this.createZombie`.
- `QueryManager`: Enhanced with filter function for value-based queries (e.g., `type === 'player'`).
- `ECSManager`: Added basic event system (`emit`, `on`) for shooting triggers.
- Next feature: Bullet-zombie collisions to destroy zombies, leveraging `destroyEntity`.
- Consider: Separating event system into `EventManager.js` if it grows; adding multiple shooters (e.g., turrets) with `'shooting'` component and custom targeting.
- **Context Format**: Future updates should be provided as Markdown (`.md`) files within `<xaiArtifact>` tags for easy copy-pasting (e.g., to GitHub). To manage size, provide the latest `AI_Context.md` at thread start; updates will modify specific sections (e.g., `File Structure`, `Notes`) rather than regenerating the entire file, unless a full refresh is requested.

Start from this setup and help me [your next task].