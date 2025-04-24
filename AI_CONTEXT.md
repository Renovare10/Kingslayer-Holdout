AI Context for Kingslayer Holdout
I’m working on a Phaser 3 game called "kingslayer-holdout" using Vite as the bundler. It’s a top-down survivor game with an ECS (Entity-Component-System) architecture for scalability. The project is managed on GitHub, using the main branch with frequent commits for version control.
File Structure

index.html: Full-screen setup with no margins, removed Cloudflare script tags for local development.
src/main.js: Phaser config (AUTO, full-screen, RESIZE mode, autoCenter: CENTER_BOTH, transparent: false).
src/scenes/:
PreloaderScene.js: Loads assets (e.g., 20 player frames, zombie sprite).
MainScene.js: Game logic, creates player (red box), initializes systems via SystemManager, sets up physics via PhysicsManager, initializes UI via UIManager, launches HUDScene, manages scene transitions via SceneManager, initializes and updates GameState for dynamic settings, creates spawner entity with Spawn component.
GameOverScene.js: Displays game over UI (white "Game Over" text, clickable restart square) using GameOverUIManager, stops itself and triggers MainScene restart via SceneManager.
HUDScene.js: Displays player HUD, initializes HealthUIManager for health display, runs in parallel with MainScene.


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


src/systems/:
RenderSystem.js: Syncs sprite positions with ECS Position for non-physics entities and with physics body for physics-enabled entities (e.g., zombies), sets depth, includes null checks for sprite.phaserSprite.
RotateToMouseSystem.js: Rotates player to mouse, centered (no offset).
PlayerMovementSystem.js: Moves player with WASD (speed 100).
PlayerShootingSystem.js: Fires bullets on click or continuous mouse hold with a 0.2-second (200ms) cooldown, centered on player, calculates angle to mouse position in world space. Refactored for readability with private fields, single-responsibility functions, and JSDoc comments.
BulletSystem.js: Moves bullets toward their angle at speed 3500, renders as 14x3 black rectangles, despawns bullets after lifespan.
HealthSystem.js: Manages player health (100 HP), reduces by 10 HP per zombie collision with 1-second invincibility, emits healthChanged event.
FlashSystem.js: Adds flash effects (implementation details not specified).
MovementSystem.js: Moves zombies toward the player using Movement component (speed 60 for standard, 120 for fast), updates physics velocity, caches player ID for performance, refactored with single-responsibility functions and JSDoc.
SpawnSystem.js: Manages zombie spawning for entities with Spawn component, uses dynamic GameState settings for spawn interval (2s–0.5s with quadratic + sine wave), cluster spawns (10% chance, 2–5 zombies within 200 units), and max zombies (175, increasing over time), listens for spawnZombie events for respawns, uses ZombieFactory for creation.
LifecycleSystem.js: Manages zombie despawning and respawning for entities with Lifecycle component, despawns zombies >2000 units from player, emits spawnZombie events for respawns at 1600 units with player velocity bias, respects maxZombies, refactored with single-responsibility functions and JSDoc.


src/entities/:
Player.js: Creates player with red box (150x150), centered physics, adds Shooting component with 200ms cooldown.
Zombie.js: Creates standard zombie with zombie.png, movement, square collider (250x250).
FastZombie.js: Creates fast zombie with zombie.png, smaller size (100x100), faster speed (120), dark yellow tint (0xCCCC00).
Bullet.js: Creates bullet with position, angle, velocity, lifespan.
BaseZombie.js: Base factory function for creating zombies with common components (Position, Size, Sprite, Movement, EntityType, PhysicsBody, Lifecycle), configurable via a config object.


src/utils/:
ECSManager.js: Core ECS (entity/component/system management, delegates events to EventManager).
QueryManager.js: Component-based queries with filtering.
UIManager.js: Manages MainScene UI (e.g., health text), handles creation, positioning, and updates with custom positionFn for dynamic placement.
HealthUIManager.js: Manages HUDScene health display (black "Health: X" text, 32px Arial), listens for healthChanged events, supports cleanup.
GameOverUIManager.js: Manages GameOverScene UI (white "Game Over" text, clickable restart square), supports text and rectangles with positionFn.
EventManager.js: Manages event emission and subscription for complex events (e.g., healthChanged, gameOver, restartGame, spawnZombie).
SystemManager.js: Initializes and manages ECS systems, passes GameState to relevant systems (e.g., SpawnSystem, LifecycleSystem).
PhysicsManager.js: Manages physics groups (zombieGroup, bulletGroup) and collision setup (player-red box, player-zombie, zombie-zombie, bullet-zombie).
SceneManager.js: Manages scene lifecycle (restart, stop), handles MainScene cleanup and restart, extensible for future scenes (e.g., PauseScene).
GameState.js: Tracks game state (gameTime, level) and manages dynamic settings (e.g., maxZombies starts at 175 and increases by 10 every minute, spawn distances, probabilities).
ZombieFactory.js: Centralizes zombie creation logic, supports type selection (standard, fast) with a 20% fast zombie chance, applies fade-in effect consistently.
animations.js: Defines ‘idle’ animation (unused for red box).
camera.js: Configures camera to follow player.



Current State

Player: At (500, 500), 150x150 red box (scene.add.rectangle), centered (setOrigin(0.5), setCircle(75), no offset). Rotates to mouse, moves with WASD (speed 100), shoots bullets on click or continuous mouse hold (speed 3500, 200ms cooldown). Collides with static red box and zombies. No clickable UI square (removed).
Health System: Player has 100 HP, loses 10 HP per zombie collision with a 1-second invincibility period. Health displayed via "Health: X" text in top-left corner (32px Arial, black), managed by HealthUIManager in HUDScene.
Zombies:
Managed by component-based systems (MovementSystem, SpawnSystem, LifecycleSystem).
Spawning: Handled by SpawnSystem via a spawner entity with Spawn component. Spawns every 2s–0.5s (quadratic base interval decreasing from 2s to 0.5s over 5 minutes, modified by a sine wave with ±1.25s amplitude, 20s period, non-linear scaling for slow buildup and sharp decline). 10% chance per spawn for a cluster (2–5 zombies within 200 units), capped at 175 total zombies (dynamic via GameState, increases by 10 every minute). Zombies spawn 1500 units from player at a random angle (via GameState settings), with a 20% chance to be fast zombies (smaller 100x100, speed 120, dark yellow tint 0xCCCC00). Created via ZombieFactory with a 0.5-second fade-in effect.
Movement: Handled by MovementSystem using Movement component. Zombies move toward the player (speed 60 for standard, 120 for fast) using physics velocity.
Lifecycle: Handled by LifecycleSystem using Lifecycle component. Zombies despawn if >2000 units from player, respawn at 1600 units with a heading bias based on player velocity (emits spawnZombie events, handled by SpawnSystem). Respects maxZombies limit.
Collide with player, each other, and bullets via physics groups in PhysicsManager.js.


Bullets: 14x3 black rectangles, spawn at player’s center, rotate and move toward mouse position (speed 3500, using Angle component), despawn after 1s (using Lifespan component), destroy zombies on collision via PhysicsManager.js.
Static Red Box: At (600, 600), 50x50, non-ECS physics object, collides with player.
Camera: Follows player, full-screen, background #E7C8A2, zoom 0.4.
HUD: Managed by HUDScene, displays health via HealthUIManager, runs in parallel with MainScene, listens for healthChanged events.
Game State: Managed by GameState.js, tracks gameTime (in seconds) and level (currently 1, for future XP system). Provides dynamic settings (e.g., maxZombies increases over time, spawn distances, probabilities) via getSettings().

UI

MainScene: Managed by UIManager, displays legacy health text (to be phased out).
HUDScene: Managed by HealthUIManager, displays "Health: X" text (32px Arial, black, top-left at (10, 10), scrollFactor 0), updates via healthChanged events.
GameOverScene: Managed by GameOverUIManager, displays:
White "Game Over" text (75px Arial, depth 200, centered horizontally, ~100px above center with custom offset).
Clickable dark gray square (100x100, 0x333333, depth 150, restarts game).
Clickable light gray rectangle (400x80, 0x666666, depth 190, centered horizontally with custom offset width / 1.48 - width / 2, positioned below center at height / 1.4, restarts game).
Black "Continue" text (40px Arial, depth 195, centered within the light gray rectangle).
Black background.



Systems
All accept scene, use ecs.queryManager for efficient queries. MovementSystem.js, SpawnSystem.js, LifecycleSystem.js, PlayerShootingSystem.js, and RenderSystem.js refactored for readability with single-responsibility functions, JSDoc comments, and null checks.

Collisions: Managed by PhysicsManager.js using Phaser physics groups (bulletGroup, zombieGroup) for efficient collision detection (player-red box, player-zombie, zombie-zombie, bullet-zombie).

Events: Managed by EventManager.js, handling complex events:

healthChanged: Emitted by HealthSystem.js, listened by HealthUIManager.js for health text.
gameOver: Emitted by HealthSystem.js, triggers MainScene pause and GameOverScene start.
restartGame: Emitted by GameOverScene.js (on square click), triggers MainScene restart via SceneManager, resets GameState.
spawnZombie: Emitted by LifecycleSystem.js, listened by SpawnSystem.js for zombie respawns.


Scene Management: Managed by SceneManager.js, handles MainScene cleanup/restart (ECS, physics, UI) and GameOverScene stopping, extensible for future scenes.


Methodology

ECS: Entities (IDs), components (data), systems (logic).
Key ECS Functions: createEntity, addComponent, getComponent, removeComponent, destroyEntity, addSystem, update, initEntity, queryManager.getEntitiesWith, emit, on.
Design: Logic in systems/utils, lean scenes, one concept per file.
JS: ES6+, consistent imports (default for Player.js, Position.js, Sprite.js).
Version Control: GitHub, main branch, frequent commits.

Notes

Assets: PreloaderScene.js loads player frames (survivor-idle_handgun_0.png to _19.png), zombie (zombie.png).
Zombies:
Managed by MovementSystem, SpawnSystem, and LifecycleSystem using Movement, Spawn, and Lifecycle components.
Spawn dynamically via a spawner entity with a quadratic base interval decreasing from 2s to 0.5s over 5 minutes, modified by a sine wave (±1.25s amplitude, 20s period, non-linear scaling for slow buildup and sharp decline).
10% chance per spawn to trigger a cluster of 2–5 zombies within a 200-unit radius, capped at 175 total zombies (dynamic via GameState, increases by 10 every minute).
Zombies spawn 1500 units from the player at a random angle, with a 20% chance to be fast zombies (smaller 100x100, speed 120, dark yellow tint 0xCCCC00), created via ZombieFactory with a 0.5-second fade-in effect.
Move toward the player (speed 60 for standard, 120 for fast) using physics velocity.
Despawn if farther than 2000 units from the player, respawn at 1600 units with a heading bias based on player velocity (via spawnZombie events).
Collide with player, each other, and bullets via physics groups in PhysicsManager.js.



Challenges

Revisit sprite centering by editing artwork or adjusting offsets.
Consider adding PauseScene or other GUI scenes using SceneManager.
Ensure HealthUIManager cleanup during scene restarts via SceneManager.
Plan for additional HUD elements (e.g., XP, inventory) with modular UI managers.

Refactoring Best Practices
To ensure code is readable, maintainable, and aligned with modern JavaScript practices, follow these guidelines for all new and refactored code:

Private Fields and Methods: Use # prefix for private class fields and methods to enforce encapsulation (e.g., #isMouseDown, #fireBullet). This prevents external access to internal state and clarifies implementation details.
Single-Responsibility Functions: Break logic into small, focused functions with descriptive names (e.g., #getPlayerEntities, #updateCooldown). Each function should handle one task to improve readability and testability.
Modern JavaScript Features:
Use arrow functions for concise event handlers and callbacks.
Apply destructuring for object properties (e.g., const { phaserSprite } = sprite).
Use optional parameters and default values where appropriate.
Employ Math.max/Math.min for clamping values instead of conditionals.


JSDoc Comments: Add JSDoc comments for classes, methods, and key functions, specifying parameters, return types, and purpose (e.g., /** Updates the shooting cooldown. @param {number} playerId */). This improves IDE support and documentation.
Consistent Naming: Use verb-based names for action methods (e.g., #fireBullet, #handleShoot) and noun-based names for data retrieval (e.g., #getPlayerEntities). Prefix private methods with # for clarity.
Organized Structure: Group related methods logically (e.g., constructor, initialization, update, helpers) and maintain consistent indentation and formatting.
Query Optimization: Leverage QueryManager for efficient component-based queries, fetching only necessary components to minimize performance overhead.
Preserve Functionality: Ensure refactored code maintains existing behavior unless explicitly changed, verifying against the ECS architecture and game mechanics.
Error Handling: Include checks for undefined ECS or components to prevent runtime errors (e.g., if (!this.#ecs) return).
Extensibility: Design code to be easily extended (e.g., modular functions for adding new shooting modes or effects).

These practices were applied in the refactoring of PlayerShootingSystem.js, RenderSystem.js, SceneManager.js, MovementSystem.js, SpawnSystem.js, and LifecycleSystem.js and should be followed for all future systems and components.
Context Format
Updates provided as Markdown in <DOCUMENT> tags. Latest AI_CONTEXT.md included at thread start; updates modify specific sections unless full refresh requested.
