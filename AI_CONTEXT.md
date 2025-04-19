AI Context for Kingslayer Holdout
I’m working on a Phaser 3 game called "kingslayer-holdout" using Vite as the bundler. It’s a top-down survivor game with an ECS (Entity-Component-System) architecture for scalability. The project is managed on GitHub, using the main branch with frequent commits for version control.
File Structure

index.html: Full-screen setup with no margins.
src/main.js: Phaser config (AUTO, full-screen, RESIZE mode).
src/scenes/:
PreloaderScene.js: Loads assets (e.g., 20 player frames, zombie sprite).
MainScene.js: Game logic, creates player (red box), adds systems, renders static red box.


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


src/systems/:
RenderSystem.js: Syncs sprite positions for non-physics entities, sets depth.
RotateToMouseSystem.js: Rotates player to mouse, centered (no offset).
PlayerMovementSystem.js: Moves player with WASD (speed 200).
ZombieSystem.js: Spawns zombies every 2s, moves toward player (speed 100).
PlayerShootingSystem.js: Fires bullets on click, centered on player, calculates angle to mouse click in world space.
BulletSystem.js: Moves bullets toward their angle at speed 500, renders as 14x3 black rectangles.


src/entities/:
Player.js: Creates player with red box (150x150), centered physics.
Zombie.js: Creates zombie with zombie.png, movement.
Bullet.js: Creates bullet with position, angle, velocity.


src/utils/:
ECSManager.js: Core ECS (entity/component/system management, events).
QueryManager.js: Component-based queries with filtering.
animations.js: Defines ‘idle’ animation (unused for red box).
camera.js: Configures camera to follow player.



Current State

Player: At (500, 500), 150x150 red box (scene.add.rectangle), centered (setOrigin(0.5), setCircle(75), no offset). Rotates to mouse, moves with WASD (speed 200), shoots bullets on click (speed 500). Collides with static red box.
Zombies: Spawn every 2s, 800 units from player, move toward player (speed 100) using physics velocity, use zombie.png with circular collider (setCircle(125)). Collide with player and each other via physics group in MainScene.js (currently disabled).
Bullets: 14x3 black rectangles, spawn at player’s center, rotate and move toward mouse click position (speed 500, using Angle component).
Static Red Box: At (600, 600), 50x50, non-ECS physics object, collides with player.
Camera: Follows player, full-screen, background #E7C8A2, zoom 0.4.
Systems: All accept scene, use ecs.queryManager for efficient queries. ZombieSystem.js refactored for readability with smaller, single-responsibility functions.

Methodology

ECS: Entities (IDs), components (data), systems (logic).
Key ECS Functions: createEntity, addComponent, getComponent, removeComponent, destroyEntity, addSystem, update, initEntity, queryManager.getEntitiesWith, emit, on.
Design: Logic in systems/utils, lean scenes, one concept per file.
JS: ES6+, consistent imports (default for Player.js, Position.js, Sprite.js).
Version Control: GitHub, main branch, frequent commits.

Notes

Assets: PreloaderScene.js loads player frames (survivor-idle_handgun_0.png to _19.png), zombie (zombie.png).
Recent Changes:
Added Angle.js component to store bullet rotation (value in radians).
PlayerShootingSystem.js updated to calculate bullet angle in world space using camera.getWorldPoint for accurate mouse targeting.
BulletSystem.js moves bullets toward their angle at speed 500.
Player’s Position component confirmed to match sprite center (setOrigin(0.5)), ensuring zombies will chase the correct point when enabled.
Removed bullet-player collision test; bullets now spawn on click and move toward mouse.


Challenges: Sprite artwork (survivor-idle_handgun_0) not centered, required offsets for physics/position, caused rotation/bullet misalignment. Red box avoids this by being symmetric.
Future Considerations:
Separate EventManager.js for complex events.
Add multiple shooters (e.g., turrets) with 'shooting' component.
Refine collisions (e.g., health system, physics-based checks).
Revisit sprite centering by editing artwork or adjusting offsets.
Add bullet despawn logic (e.g., after 5000ms, as per original design).
Re-enable ZombieSystem.js and test zombie-player interactions.



Context Format
Updates provided as Markdown in  tags. Latest AI_CONTEXT.md included at thread start; updates modify specific sections unless full refresh requested.
