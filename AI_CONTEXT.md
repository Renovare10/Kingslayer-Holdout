AI Context for Kingslayer Holdout
I’m working on a Phaser 3 game called "kingslayer-holdout" using Vite as the bundler. It’s a top-down survivor game with an ECS (Entity-Component-System) architecture for scalability. The project is managed on GitHub, using the main branch with frequent commits for version control.
File Structure

index.html: Full-screen setup with no margins, removed Cloudflare script tags for local development.

src/main.js: Phaser config (AUTO, full-screen, RESIZE mode, autoCenter: CENTER_BOTH, transparent: false).

src/scenes/:

PreloaderScene.js: Loads assets (e.g., 20 player frames, zombie sprite).
MainScene.js: Game logic, creates player (red box), initializes systems via SystemManager, sets up physics via PhysicsManager, launches HUDScene, manages scene transitions via SceneManager, initializes and updates GameState for dynamic settings, creates spawner entity with Spawn component, launches PauseScene on Esc key press.
GameOverScene.js: Displays game over UI (white "Game Over" text, clickable restart square, light gray rectangle with "Continue" text) using GameOverUIManager, stops itself and triggers MainScene restart via SceneManager.
HUDScene.js: Displays player HUD, initializes HealthUIManager for health display and XPUIManager for XP/level display, runs in parallel with MainScene.
UpgradeScene.js: Launched on level-up via levelChanged event, pauses MainScene, displays "Choose Your Power-Up" (50px Arial, white, y = height / 3) and up to two options (Speed Boost: 50x50 red circle, XP Magnet: 50x50 blue circle, 20px Arial titles, centered with 150px spacing at y = height * 2/3) on a semi-transparent black background (0x000000, alpha 0.7). Skips UI and resumes MainScene if both SpeedUpgrade and MagnetUpgrade are maxed (3 stacks). Applies selected upgrade (speedUpgrade or magnetUpgrade) on click, resumes MainScene and stops itself on click or Space key press. Initialized with ecs data.
PauseScene.js: Launched on Esc key press from MainScene, pauses MainScene, displays a semi-transparent grey overlay (0x333333, alpha 0.7), centered "Paused" text (50px Arial, white, scaled by width / 1920, y = height / 2.8), and a clickable light gray button (400x80, 0x666666, y = height / 1.6) with "Resume" text (40px Arial, white). Resumes MainScene and stops itself on Esc key press or button click. Handles screen resizing for dynamic positioning.


src/components/:

Position.js: Stores entity coordinates (x, y), centered to match sprite origin.
Sprite.js: Creates Phaser sprite or graphics (phaserSprite).
RotateToMouse.js: Enables mouse rotation (enabled).
Movement.js: Defines movement (speed, velocity: { x, y }).
Shooting.js: Manages shooting (enabled, cooldown, currentCooldown).
Bullet.js: Defines bullet properties (damage, createdAt, lifespan).
EntityType.js: Identifies entity type (type: 'player', 'zombie', 'bullet').
Size.js: Stores dimensions (width, height).
Angle.js: Stores angle in radians (value), used for bullet rotation.
Lifespan.js: Stores lifespan data (createdAt, duration) for entities like bullets.
Health.js: Stores health data (current, max, invincibilityTimer) for entities like the player.
Spawn.js: Defines spawning settings (interval, timer, clusterChance, clusterSizeMin, clusterSizeMax, clusterRadius, maxZombies) for spawner entities.
Lifecycle.js: Defines lifecycle settings (despawnDistance, respawnDistance, maxZombies) for zombies.
XP.js: Defines XP entities dropped by zombies (value, createdAt, lifespan).
PlayerXP.js: Tracks player XP and level (xp, level, xpToNextLevel), includes addXP method for level-up logic.
SpeedUpgrade.js: Stores speed upgrade data for the player (count: 0–3, maxStacks: 3, speedBoost: 5 for +5 speed per stack). Located in src/components/upgrades.js.
MagnetUpgrade.js: Stores magnet upgrade data for the player (count: 0–3, maxStacks: 3, radius: 150 per stack for 150/300/450, maxSpeed: 200 for XP pull speed). Located in src/components/upgrades.js.


src/systems/:

RenderSystem.js: Syncs sprite positions with ECS Position for non-physics entities and with physics body for physics-enabled entities (e.g., zombies), sets depth, includes null checks for sprite.phaserSprite.
RotateToMouseSystem.js: Rotates player to mouse, centered (no offset).
PlayerMovementSystem.js: Moves player with WASD (base speed 100, increased by speedUpgrade.speedBoost * speedUpgrade.count, e.g., 115 with 3 stacks). Normalizes diagonal movement, syncs physics body with Position component.
PlayerShootingSystem.js: Fires bullets on click or continuous mouse hold with a 0.2-second (200ms) cooldown, centered on player, calculates angle to mouse position in world space. Refactored for readability with private fields, single-responsibility functions, and JSDoc comments.
BulletSystem.js: Moves bullets toward their angle at speed 3500, renders as 14x3 black rectangles, despawns bullets after lifespan.
HealthSystem.js: Manages player health (100 HP), reduces by 10 HP per zombie collision with 1-second invincibility, emits healthChanged event.
FlashSystem.js: Adds flash effects (implementation details not specified).
MovementSystem.js: Moves zombies toward the player using Movement component (speed 60 for standard, 120 for fast), updates physics velocity, caches player ID for performance, refactored with single-responsibility functions and JSDoc.
SpawnSystem.js: Manages zombie spawning for entities with Spawn component, uses dynamic GameState settings for spawn interval (2s–0.5s with quadratic + sine wave), cluster spawns (10% chance, 2–5 zombies within 200 units), and max zombies (175, increasing over time), listens for spawnZombie events for respawns, uses ZombieFactory for creation.
LifecycleSystem.js: Manages zombie despawning and respawning for entities with Lifecycle component, despawns zombies >2000 units from player, emits spawnZombie events for respawns at 1600 units with player velocity bias, respects maxZombies, refactored with single-responsibility functions and JSDoc.
XPSystem.js: Manages XP entity despawn (10s lifespan).
PlayerUpgradeSystem.js: Listens for levelChanged events, launches UpgradeScene with ecs data. No continuous updates.
MagnetSystem.js: Manages XP magnet effect for players with MagnetUpgrade. Uses ECS XP entities (xp, sprite, position, physicsBody) to apply piecewise smooth pull velocity (outer third ~30, middle third ~100, inner third ~150–200 for radius 450), syncing lavender flash sprite with main XP sprite.


src/entities/:

Player.js: Creates player at (500, 500) with 150x150 red box, centered physics (setOrigin(0.5), setCircle(75)). Rotates to mouse, moves with WASD (base speed 100, +5 per speedUpgrade.count, max 115). Shoots bullets (speed 3500, 200ms cooldown). Collides with static red box, zombies, XP circles. Has PlayerXP for XP tracking (resets to 0 on level-up, thresholds: 100/150/200...), SpeedUpgrade for speed boosts, and MagnetUpgrade for XP pull (radius 150/300/450 with zoned speeds).
Zombie.js: Creates standard zombie with zombie.png, movement, square collider (250x250).
FastZombie.js: Creates fast zombie with zombie.png, smaller size (100x100), faster speed (120), dark yellow tint (0xCCCC00).
Bullet.js: Creates bullet with position, angle, velocity, lifespan.
BaseZombie.js: Base factory function for creating zombies with common components (Position, Size, Sprite, Movement, EntityType, PhysicsBody, Lifecycle), configurable via a config object.


src/utils/:

ECSManager.js: Core ECS (entity/component/system management, delegates events to EventManager).
QueryManager.js: Component-based queries with filtering.
UIManager.js: Manages MainScene UI (e.g., health text), handles creation, positioning, and updates with custom positionFn for dynamic placement.
HealthUIManager.js: Manages HUDScene health display (black "Health: X" text, 32px Arial), listens for healthChanged events, supports cleanup.
XPUIManager.js: Manages HUDScene XP/level display (black "XP: X | Level: Y" text, 32px Arial), listens for xpChanged and levelChanged events, supports cleanup with scale tween on level-up.
GameOverUIManager.js: Manages GameOverScene UI (white "Game Over" text, clickable restart square, light gray rectangle with "Continue" text), supports text and rectangles with positionFn.
EventManager.js: Manages event emission and subscription for complex events (e.g., healthChanged, gameOver, restartGame, spawnZombie, xpChanged, levelChanged).
SystemManager.js: Initializes and manages ECS systems, passes GameState to relevant systems (e.g., SpawnSystem, LifecycleSystem).
PhysicsManager.js: Manages physics groups (zombieGroup, bulletGroup, xpGroup) and collision setup (player-red box, player-zombie, zombie-zombie, bullet-zombie, player-XP).
SceneManager.js: Manages scene lifecycle (restart, stop), handles MainScene cleanup and restart, extensible for future scenes (e.g., PauseScene).
GameState.js: Tracks game state (gameTime, level) and manages dynamic settings (e.g., maxZombies, spawn distances, XP drop settings).
ZombieFactory.js: Centralizes zombie creation logic, supports type selection (standard, fast) with a 20% fast zombie chance, applies fade-in effect consistently.
SpriteFactory.js: Centralizes sprite creation (e.g., XP circles with flash effects), supports reusable sprite and tween logic.
animations.js: Defines ‘idle’ animation (unused for red box).
camera.js: Configures camera to follow player.



Current State

Player: At (500, 500), 150x150 red box (scene.add.rectangle), centered (setOrigin(0.5), setCircle(75), no offset). Rotates to mouse, moves with WASD (speed 100), shoots bullets on click or continuous mouse hold (speed 3500, 200ms cooldown). Collides with static red box, zombies, and XP circles. Has PlayerXP component for XP tracking (resets to 0 on level-up, next level at 100, 150, 200... XP).
Health System: Player has 100 HP, loses 10 HP per zombie collision with 1-second invincibility. Health displayed via "Health: X" text in top-left (32px Arial, black) in HUDScene.
XP System:
Collection: Player collects XP by touching XP circles (1 XP each), managed by PhysicsManager via player-XP overlap. XP resets to 0 on level-up, with xpToNextLevel increasing by 50 (100 for Level 2, 150 for Level 3, 200 for Level 4).
Drops: Zombies drop XP circles (17x17, purple #9932CC, lavender #E6E6FA flash) on death, created via SpriteFactory with 10s lifespan, managed by XPSystem for despawn.
Level-Up: Handled by PlayerXP component, emits xpChanged and levelChanged events for UI updates.


Zombies:
Managed by MovementSystem, SpawnSystem, LifecycleSystem.
Spawning: Handled by SpawnSystem via a spawner entity with Spawn component. Spawns every 2s–0.5s (quadratic base interval decreasing from 2s to 0.5s over 5 minutes, modified by a sine wave with ±1.25s amplitude, 20s period, non-linear scaling). 10% chance for cluster (2–5 zombies within 200 units), capped at 175 total zombies (increases by 10 every minute). Spawn 1500 units from player, 20% chance for fast zombies (100x100, speed 120, #CCCC00 tint). Created via ZombieFactory with 0.5s fade-in.
Movement: Handled by MovementSystem (speed 60 for standard, 120 for fast) using physics velocity.
Lifecycle: Handled by LifecycleSystem; despawn >2000 units, respawn at 1600 units with player velocity bias (via spawnZombie events). Respects maxZombies.
Collide with player, each other, and bullets via physics groups.


Bullets: 14x3 black rectangles, spawn at player’s center, move toward mouse (speed 3500, Angle component), despawn after 1s (Lifespan component), destroy zombies on collision.
Static Red Box: At (600, 600), 50x50, non-ECS physics object, collides with player.
Camera: Follows player, full-screen, background #E7C8A2, zoom 0.4.
HUD: Managed by HUDScene, displays:
Health via HealthUIManager ("Health: X", 32px Arial, black, (10, 10), scrollFactor 0).
XP/level via XPUIManager ("XP: X | Level: Y", 32px Arial, black, (10, 50), scrollFactor 0, scale tween on level-up).


Game State: Managed by GameState.js, tracks gameTime and level, provides dynamic settings (maxZombies, spawn distances, XP drop settings).

UI

MainScene: Managed by UIManager, displays legacy health text (to be phased out).
HUDScene: Managed by HealthUIManager and XPUIManager:
HealthUIManager: "Health: X" text (32px Arial, black, (10, 10), scrollFactor 0), updates via healthChanged.
XPUIManager: "XP: X | Level: Y" text (32px Arial, black, (10, 50), scrollFactor 0), updates via xpChanged, scale tween (1.2x, 200ms) on levelChanged.


GameOverScene: Managed by GameOverUIManager:
White "Game Over" text (75px Arial, depth 200, centered horizontally, ~100px above center).
Clickable dark gray square (100x100, 0x333333, depth 150, restarts game).
Clickable light gray rectangle (400x80, 0x666666, depth 190, centered horizontally, below center at height / 1.4, restarts game).
Black "Continue" text (40px Arial, depth 195, centered in rectangle).
Black background.


UpgradeScene: Managed by built-in scene logic:
Semi-transparent black background (0x000000, alpha 0.7).
"Choose Your Power-Up" text (50px Arial, white, y = height / 3).
Up to two clickable power-up options (Speed Boost: 50x50 red circle, XP Magnet: 50x50 blue circle, 20px Arial white titles, centered with 150px spacing, y = height * 2/3).
Resumes MainScene on click or Space key press.


PauseScene: Managed by built-in scene logic:
Semi-transparent grey overlay (0x333333, alpha 0.7, depth 100).
"Paused" text (50px Arial, white, y = height / 2.8, scaled by width / 1920, depth 110).
Clickable light gray button (400x80, 0x666666, y = height / 1.6, depth 190) with "Resume" text (40px Arial, white, depth 195).
Resumes MainScene and stops itself on Esc key press or button click.
Handles screen resizing for dynamic positioning.



Systems
All accept scene, use ecs.queryManager for efficient queries. MovementSystem.js, SpawnSystem.js, LifecycleSystem.js, PlayerShootingSystem.js, RenderSystem.js, and XPSystem.js refactored for readability with single-responsibility functions, JSDoc comments, and null checks.
Collisions
Managed by PhysicsManager.js using Phaser physics groups (bulletGroup, zombieGroup, xpGroup) for efficient collision detection (player-red box, player-zombie, zombie-zombie, bullet-zombie, player-XP).
Events
Managed by EventManager.js, handling complex events:

healthChanged: Emitted by HealthSystem.js, listened by HealthUIManager.js for health text.
gameOver: Emitted by HealthSystem.js, triggers MainScene pause and GameOverScene start.
restartGame: Emitted by GameOverScene.js (on square or rectangle click), triggers MainScene restart via SceneManager, resets GameState.
spawnZombie: Emitted by LifecycleSystem.js, listened by SpawnSystem.js for zombie respawns.
xpChanged: Emitted by PhysicsManager.js on XP collection, listened by XPUIManager.js for XP/level text.
levelChanged: Emitted by PhysicsManager.js on player level-up, listened by XPUIManager.js for XP/level UI updates and PlayerUpgradeSystem.js to launch UpgradeScene.

Scene Management
Managed by SceneManager.js, handles MainScene cleanup/restart (ECS, physics, UI), GameOverScene stopping, and PauseScene stopping. Extensible for future scenes.
Methodology

ECS: Entities (IDs), components (data), systems (logic).
Key ECS Functions: createEntity, addComponent, getComponent, removeComponent, destroyEntity, addSystem, update, initEntity, queryManager.getEntitiesWith, emit, on.
Design: Logic in systems/utils, lean scenes, one concept per file.
JS: ES6+, consistent imports (default for Player.js, Position.js, Sprite.js).
Version Control: GitHub, main branch, frequent commits.

Notes

Assets: PreloaderScene.js loads player frames (survivor-idle_handgun_0.png to _19.png), zombie (zombie.png).
Zombies:
Managed by MovementSystem, SpawnSystem, LifecycleSystem.
Spawn dynamically via a spawner entity with a quadratic base interval decreasing from 2s to 0.5s over 5 minutes, modified by a sine wave (±1.25s amplitude, 20s period).
10% chance for cluster (2–5 zombies, 200-unit radius), capped at 175 total zombies (increases by 10 every minute).
Spawn 1500 units from player, 20% chance for fast zombies (100x100, speed 120, #CCCC00 tint), created via ZombieFactory with 0.5s fade-in.
Move toward player (speed 60 standard, 120 fast) using physics velocity.
Despawn >2000 units, respawn at 1600 units with player velocity bias (via spawnZombie events).
Collide with player, each other, and bullets via physics groups.



Challenges

Revisit sprite centering by editing artwork or adjusting offsets.
Ensure HealthUIManager and XPUIManager cleanup during scene restarts via SceneManager.
Plan for player upgrades on level-up (e.g., speed, damage boosts).

Refactoring Best Practices
To ensure code is readable, maintainable, and aligned with modern JavaScript practices:

Private Fields and Methods: Use # prefix for private class fields and methods (e.g., #isMouseDown, #fireBullet).
Single-Responsibility Functions: Break logic into small, focused functions (e.g., #getPlayerEntities, #updateCooldown).
Modern JavaScript Features:
Use arrow functions for event handlers/callbacks.
Apply destructuring (e.g., const { phaserSprite } = sprite).
Use optional parameters/defaults.
Employ Math.max/Math.min for clamping.


JSDoc Comments: Add for classes, methods, key functions (e.g., /** Updates the shooting cooldown. @param {number} playerId */).
Consistent Naming: Verb-based for actions (e.g., #fireBullet), noun-based for data (e.g., #getPlayerEntities).
Organized Structure: Group methods logically (constructor, initialization, update, helpers).
Query Optimization: Use QueryManager for efficient component queries.
Preserve Functionality: Maintain existing behavior unless explicitly changed.
Error Handling: Check for undefined ECS/components (e.g., if (!this.#ecs) return).
Extensibility: Design for easy extension (e.g., modular functions for new effects).

These practices were applied in PlayerShootingSystem.js, RenderSystem.js, SceneManager.js, MovementSystem.js, SpawnSystem.js, LifecycleSystem.js, XPSystem.js, and PauseScene.js and should be followed for all future systems/components.
Context Format
Updates provided as Markdown in <DOCUMENT> tags. Latest AI_CONTEXT.md included at thread start; updates modify specific sections unless full refresh requested.
