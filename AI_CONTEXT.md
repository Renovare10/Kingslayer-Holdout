# AI Context for Kingslayer Holdout

I’m working on a Phaser 3 game called "kingslayer-holdout" using Vite as the bundler. It’s a top-down survivor game with an ECS (Entity-Component-System) architecture for scalability. The project is managed on GitHub, using the `main` branch with frequent commits for version control.

## File Structure
- `index.html`: Full-screen setup with no margins.
- `src/main.js`: Phaser config (AUTO, full-screen, RESIZE mode).
- `src/scenes/`:
  - `PreloaderScene.js`: Loads assets (e.g., 20 player frames, zombie sprite).
  - `MainScene.js`: Game logic, creates player (red box), adds systems, renders static red box.
- `src/components/`:
  - `Position.js`: Stores entity coordinates (`x`, `y`).
  - `Sprite.js`: Creates Phaser sprite or graphics (`phaserSprite`).
  - `RotateToMouse.js`: Enables mouse rotation (`enabled`).
  - `Movement.js`: Defines movement (`speed`, `velocity: { x, y }`).
  - `Shooting.js`: Manages shooting (`enabled`, `cooldown`, `currentCooldown`).
  - `Bullet.js`: Defines bullet properties (`damage`, `createdAt`, `lifespan`).
  - `EntityType.js`: Identifies entity type (`type: 'player', 'zombie', 'bullet'`).
  - `Size.js`: Stores dimensions (`width`, `height`).
- `src/systems/`:
  - `RenderSystem.js`: Syncs sprite positions for non-physics entities, sets depth.
  - `RotateToMouseSystem.js`: Rotates player to mouse, centered (no offset).
  - `PlayerMovementSystem.js`: Moves player with WASD (speed 200).
  - `ZombieSystem.js`: Spawns zombies every 2s, moves toward player (speed 100).
  - `PlayerShootingSystem.js`: Fires bullets on click, centered on player.
  - `BulletSystem.js`: Moves bullets, renders as 14x3 black rectangles, handles collisions.
- `src/entities/`:
  - `Player.js`: Creates player with red box (150x150), centered physics.
  - `Zombie.js`: Creates zombie with `zombie.png`, movement.
  - `Bullet.js`: Creates bullet with position, velocity, lifespan.
- `src/utils/`:
  - `ECSManager.js`: Core ECS (entity/component/system management, events).
  - `QueryManager.js`: Component-based queries with filtering.
  - `animations.js`: Defines ‘idle’ animation (unused for red box).
  - `camera.js`: Configures camera to follow player.

## Current State
- **Player**: At (500, 500), 150x150 red box (`scene.add.rectangle`), centered (`setOrigin(0.5)`, `setCircle(75)`, no offset). Rotates to mouse, moves with WASD (speed 200), shoots bullets on click (speed 4000, cooldown 0.2s).
- **Zombies**: Spawn every 2s, 800 units from player, move toward player (speed 100), use `zombie.png`.
- **Bullets**: 14x3 black rectangles, spawn at player’s center, move toward mouse, despawn after 5000ms, destroy zombies within 120 units.
- **Static Red Box**: At (600, 600), 50x50, non-ECS physics object.
- **Camera**: Follows player, full-screen, background `#E7C8A2`, zoom 0.4.
- **Systems**: All accept `scene`, use `ecs.queryManager` for efficient queries.

## Methodology
- **ECS**: Entities (IDs), components (data), systems (logic).
- **Key ECS Functions**: `createEntity`, `addComponent`, `getComponent`, `removeComponent`, `destroyEntity`, `addSystem`, `update`, `initEntity`, `queryManager.getEntitiesWith`, `emit`, `on`.
- **Design**: Logic in systems/utils, lean scenes, one concept per file.
- **JS**: ES6+, consistent imports (default for `Player.js`, `Position.js`, `Sprite.js`).
- **Version Control**: GitHub, `main` branch, frequent commits.

## Notes
- **Assets**: `PreloaderScene.js` loads player frames (`survivor-idle_handgun_0.png` to `_19.png`), zombie (`zombie.png`).
- **Recent Changes**:
  - Player reverted to 150x150 red box for simplicity, centered physics.
  - `RotateToMouseSystem`: Removed `-0.1` offset for accurate rotation.
  - `PlayerShootingSystem`, `BulletSystem`: Bullets spawn at player’s center (`sprite.x, sprite.y`).
  - Attempted sprite (`survivor-idle_handgun_0`) but reverted due to artwork off-centering issues.
- **Challenges**: Sprite artwork (`survivor-idle_handgun_0`) not centered, required offsets for physics/position, caused rotation/bullet misalignment. Red box avoids this by being symmetric.
- **Future Considerations**:
  - Separate `EventManager.js` for complex events.
  - Add multiple shooters (e.g., turrets) with `'shooting'` component.
  - Refine collisions (e.g., health system, physics-based checks).
  - Revisit sprite centering by editing artwork or adjusting offsets.
- **Context Format**: Updates provided as Markdown in `<xaiArtifact>` tags. Latest `AI_CONTEXT.md` included at thread start; updates modify specific sections unless full refresh requested.