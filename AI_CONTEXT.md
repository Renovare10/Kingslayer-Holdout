AI Context for Kingslayer Holdout
I’m working on a Phaser 3 game called "kingslayer-holdout" using Vite as the bundler. It’s a top-down survivor game with an ECS (Entity-Component-System) architecture for scalability. The project is managed on GitHub, using the main branch with frequent commits for version control.
File Structure

index.html: Full-screen setup with no margins, removed Cloudflare script tags for local development.
src/main.js: Phaser config (AUTO, full-screen, RESIZE mode, autoCenter: CENTER_BOTH).
src/scenes/:
PreloaderScene.js: Loads assets (e.g., 20 player frames, zombie sprite).
MainScene.js: Game logic, creates player (red box), initializes systems via SystemManager, sets up physics via PhysicsManager, initializes UI via UIManager.


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


src/systems/:
RenderSystem.js: Syncs sprite positions with ECS Position for non-physics entities and with physics body for physics-enabled entities (e.g., zombies), sets depth.
RotateToMouseSystem.js: Rotates player to mouse, centered (no offset).
PlayerMovementSystem.js: Moves player with WASD (speed 100).
ZombieSystem.js: Spawns zombies every 2s, moves toward player (speed 60).
PlayerShootingSystem.js: Fires bullets on click or continuous mouse hold with a 0.2-second (200ms) cooldown, centered on player, calculates angle to mouse position in world space. Refactored for readability with private fields, single-responsibility functions, and JSDoc comments.
BulletSystem.js: Moves bullets toward their angle at speed 3500, renders as 14x3 black rectangles, despawns bullets after lifespan.
HealthSystem.js: Manages player health (100 HP), reduces by 10 HP per zombie collision with 1-second invincibility, emits healthChanged event.


src/entities/:
Player.js: Creates player with red box (150x150), centered physics, adds Shooting component with 200ms cooldown.
Zombie.js: Creates zombie with zombie.png, movement, square collider (250x250).
Bullet.js: Creates bullet with position, angle, velocity, lifespan.


src/utils/:
ECSManager.js: Core ECS (entity/component/system management, delegates events to EventManager).
QueryManager.js: Component-based queries with filtering.
UIManager.js: Manages UI components (e.g., health text, game over text), handles creation, positioning, and updates. Each UI text element (health, gameOver) uses a custom positionFn to compute its position independently, replacing the previous 4-quadrant positioning system.
EventManager.js: Manages event emission and subscription for complex events (e.g., healthChanged, gameOver).
SystemManager.js: Initializes and manages ECS systems.
PhysicsManager.js: Manages physics groups (zombieGroup, bulletGroup) and collision setup (player-red box, player-zombie, zombie-zombie, bullet-zombie).
animations.js: Defines ‘idle’ animation (unused for red box).
camera.js: Configures camera to follow player.



Current State

Player: At (500, 500), 150x150 red box (scene.add.rectangle), centered (setOrigin(0.5), setCircle(75), no offset). Rotates to mouse, moves with WASD (speed 100), shoots bullets on click or continuous mouse hold (speed 3500, 200ms cooldown). Collides with static red box and zombies.
Health System: Player has 100 HP, loses 10 HP per zombie collision with a 1-second invincibility period. Health is displayed via "Health: X" text in the top-left corner, managed by UIManager.
Zombies: Spawn every 2s, 800 units from player, move toward player (speed 60) using physics velocity, use zombie.png with square collider (setSize(250, 250)). Collide with player, each other, and bullets via physics groups in PhysicsManager.js.
Bullets: 14x3 black rectangles, spawn at player’s center, rotate and move toward mouse position (speed 3500, using Angle component), despawn after 1s (using Lifespan component), destroy zombies on collision via PhysicsManager.js.
Static Red Box: At (600, 600), 50x50, non-ECS physics object, collides with player.
Camera: Follows player, full-screen, background #E7C8A2, zoom 0.4.
UI: Managed by UIManager, handles "Health: X" text in the top-left corner (dynamically positioned using a custom positionFn) and "Game Over" text (vertically centered, flush right, initially hidden, activates on gameOver event using a custom positionFn).
Systems: All accept scene, use ecs.queryManager for efficient queries. ZombieSystem.js and PlayerShootingSystem.js refactored for readability with single-responsibility functions.
Collisions: Managed by PhysicsManager.js using Phaser physics groups (bulletGroup, zombieGroup) for efficient collision detection (player-red box, player-zombie, zombie-zombie, bullet-zombie).
Events: Managed by EventManager.js, handling complex events like healthChanged (emitted by HealthSystem.js, listened by UIManager.js) and gameOver (emitted by HealthSystem.js, activates "Game Over" text in UIManager.js).

Methodology

ECS: Entities (IDs), components (data), systems (logic).
Key ECS Functions: createEntity, addComponent, getComponent, removeComponent, destroyEntity, addSystem, update, initEntity, queryManager.getEntitiesWith, emit, on.
Design: Logic in systems/utils, lean scenes, one concept per file.
JS: ES6+, consistent imports (default for Player.js, Position.js, Sprite.js).
Version Control: GitHub, main branch, frequent commits.

Notes

Assets: PreloaderScene.js loads player frames (survivor-idle_handgun_0.png to _19.png), zombie (zombie.png).

Zombies
Spawn dynamically with a quadratic base interval decreasing from 2s to 0.5s over 5 minutes, modified by a sine wave (±1.25s amplitude, 20s period, non-linear scaling for slow buildup and sharp decline). 10% chance per spawn to trigger a cluster of 2–5 zombies within a 200-unit radius, capped at 150 total zombies. Zombies spawn 800 units from the player at a random angle, move toward the player (speed 60) using physics velocity, and use zombie.png with a square collider (setSize(250, 250)). Collide with player, each other, and bullets via physics groups in PhysicsManager.js. ZombieSystem.js is refactored into short, single-responsibility functions for clarity and readability.
Challenges

Revisit sprite centering by editing artwork or adjusting offsets.

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

These practices were applied in the refactoring of PlayerShootingSystem.js and should be followed for all future systems and components to maintain a consistent, high-quality codebase.
Context Format
Updates provided as Markdown in <DOCUMENT> tags. Latest AI_CONTEXT.md included at thread start; updates modify specific sections unless full refresh requested.
