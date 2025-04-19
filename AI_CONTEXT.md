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
PlayerShootingSystem.js: Fires bullets on click, centered on player, calculates angle to mouse click in world space.
BulletSystem.js: Moves bullets toward their angle at speed 3500, renders as 14x3 black rectangles, despawns bullets after lifespan.
HealthSystem.js: Manages player health (100 HP), reduces by 10 HP per zombie collision with 1-second invincibility, emits healthChanged event.


src/entities/:
Player.js: Creates player with red box (150x150), centered physics.
Zombie.js: Creates zombie with zombie.png, movement, square collider (250x250).
Bullet.js: Creates bullet with position, angle, velocity, lifespan.


src/utils/:
ECSManager.js: Core ECS (entity/component/system management, delegates events to EventManager).
QueryManager.js: Component-based queries with filtering.
UIManager.js: Manages UI components (e.g., health text, game over placeholder), handles creation, positioning, and updates.
EventManager.js: Manages event emission and subscription for complex events (e.g., healthChanged, gameOver).
SystemManager.js: Initializes and manages ECS systems.
PhysicsManager.js: Manages physics groups (zombieGroup, bulletGroup) and collision setup (player-red box, player-zombie, zombie-zombie, bullet-zombie).
animations.js: Defines ‘idle’ animation (unused for red box).
camera.js: Configures camera to follow player.



Current State

Player: At (500, 500), 150x150 red box (scene.add.rectangle), centered (setOrigin(0.5), setCircle(75), no offset). Rotates to mouse, moves with WASD (speed 100), shoots bullets on click (speed 3500). Collides with static red box and zombies.
Health System: Player has 100 HP, loses 10 HP per zombie collision with a 1-second invincibility period. Health is displayed via "Health: X" text in the top-left corner, managed by UIManager.
Zombies: Spawn every 2s, 800 units from player, move toward player (speed 60) using physics velocity, use zombie.png with square collider (setSize(250, 250)). Collide with player, each other, and bullets via physics groups in PhysicsManager.js.
Bullets: 14x3 black rectangles, spawn at player’s center, rotate and move toward mouse click position (speed 3500, using Angle component), despawn after 1s (using Lifespan component), destroy zombies on collision via PhysicsManager.js.
Static Red Box: At (600, 600), 50x50, non-ECS physics object, collides with player.
Camera: Follows player, full-screen, background #E7C8A2, zoom 0.4.
UI: Managed by UIManager, handles "Health: X" text in the top-left corner (dynamically positioned for viewport resizing) and a placeholder for "Game Over" text (center, initially hidden, activates on gameOver event).
Systems: All accept scene, use ecs.queryManager for efficient queries. ZombieSystem.js refactored for readability with single-responsibility functions.
Collisions: Managed by PhysicsManager.js using Phaser physics groups (bulletGroup, zombieGroup) for efficient collision detection (player-red box, player-zombie, zombie-zombie, bullet-zombie).
Events: Managed by EventManager.js, handling complex events like healthChanged (emitted by HealthSystem.js, listened by UIManager.js) and supporting future events like gameOver.

Methodology

ECS: Entities (IDs), components (data), systems (logic).
Key ECS Functions: createEntity, addComponent, getComponent, removeComponent, destroyEntity, addSystem, update, initEntity, queryManager.getEntitiesWith, emit, on.
Design: Logic in systems/utils, lean scenes, one concept per file.
JS: ES6+, consistent imports (default for Player.js, Position.js, Sprite.js).
Version Control: GitHub, main branch, frequent commits.

Notes

Assets: PreloaderScene.js loads player frames (survivor-idle_handgun_0.png to _19.png), zombie (zombie.png).
Recent Changes:
Moved UI component initialization (health text, game over placeholder) from MainScene.js to UIManager.js, keeping MainScene.js lean.
Added EventManager.js to handle complex events (e.g., healthChanged, gameOver), replacing basic event handling in ECSManager.js.
Moved bullet-zombie collision handling from BulletSystem.js to PhysicsManager.js, improving efficiency with a single physics.add.overlap call.
Fixed ECS query syntax in PlayerShootingSystem.js, BulletSystem.js, and ZombieSystem.js to pass component names as separate strings, resolving empty query results.
Updated ZombieSystem.js to correctly pass zombieGroup to createZombie, fixing zombie spawning.
Updated player movement speed to 100 (was 200).
Updated zombie movement speed to 60 (was 100).
Set bullet speed to 3500, passed as a parameter to createBullet.
Added Lifespan.js component; bullets despawn after 1s (1000ms).
Changed zombie collider to square (setSize(250, 250)) instead of circular (setCircle(125)).
Added Health.js component and HealthSystem.js for player health (100 HP, 10 HP damage per zombie collision, 1-second invincibility).
Added UIManager.js for UI components; health text dynamically positioned in top-left corner.
Added SystemManager.js to initialize ECS systems.
Added PhysicsManager.js to manage physics groups and collisions.
Removed Cloudflare script tags from index.html, resolving 404 errors for /cdn-cgi/challenge-platform/scripts/jsd/main.js.
Removed debug console logs from MainScene.js, PlayerShootingSystem.js, BulletSystem.js, QueryManager.js, and PhysicsManager.js.



Challenges:

Add shooting cooldown (0.2s, as per original design) to PlayerShootingSystem.js.
Add game over condition when health reaches 0 (emit gameOver event in HealthSystem.js, display "Game Over" text in UIManager.js).
Add multiple shooters (e.g., turrets) with 'shooting' component.
Revisit sprite centering by editing artwork or adjusting offsets.

Context Format
Updates provided as Markdown in  tags. Latest AI_CONTEXT.md included at thread start; updates modify specific sections unless full refresh requested.
