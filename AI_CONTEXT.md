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
Lifespan.js: Stores lifespan data (createdAt, duration) for entities like bullets.


src/systems/:
RenderSystem.js: Syncs sprite positions for non-physics entities, sets depth.
RotateToMouseSystem.js: Rotates player to mouse, centered (no offset).
PlayerMovementSystem.js: Moves player with WASD (speed 200).
ZombieSystem.js: Spawns zombies every 2s, moves toward player (speed 100).
PlayerShootingSystem.js: Fires bullets on click, centered on player, calculates angle to mouse click in world space.
BulletSystem.js: Moves bullets toward their angle at speed 3500, renders as 14x3 black rectangles, handles bullet-zombie collisions, despawns bullets after lifespan.


src/entities/:
Player.js: Creates player with red box (150x150), centered physics.
Zombie.js: Creates zombie with zombie.png, movement, square collider (250x250).
Bullet.js: Creates bullet with position, angle, velocity, lifespan.


src/utils/:
ECSManager.js: Core ECS (entity/component/system management, events).
QueryManager.js: Component-based queries with filtering.
animations.js: Defines ‘idle’ animation (unused for red box).
camera.js: Configures camera to follow player.



Current State

Player: At (500, 500), 150x150 red box (scene.add.rectangle), centered (setOrigin(0.5), setCircle(75), no offset). Rotates to mouse, moves with WASD (speed 200), shoots bullets on click (speed 3500). Collides with static red box and zombies.
Zombies: Spawn every 2s, 800 units from player, move toward player (speed 100) using physics velocity, use zombie.png with square collider (setSize(250, 250)). Collide with player, each other, and bullets via physics group in MainScene.js.
Bullets: 14x3 black rectangles, spawn at player’s center, rotate and move toward mouse click position (speed 3500, using Angle component), despawn after 1s (using Lifespan component), destroy zombies on collision.
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
Bullet speed updated to 3500, now passed as a parameter to createBullet for flexibility.
Added bullet-zombie collisions in BulletSystem.js; bullets destroy zombies on hit.
Added Lifespan.js component; bullets despawn after 1s (1000ms).
Re-enabled ZombieSystem.js; zombies spawn and move toward player.
Changed zombie collider to square (setSize(250, 250)) instead of circular (setCircle(125)).


Challenges:
Separate EventManager.js for complex events.
Add multiple shooters (e.g., turrets) with 'shooting' component.
Refine collisions (e.g., health system, physics-based checks).



Context Format
Updates provided as Markdown in  tags. Latest AI_CONTEXT.md included at thread start; updates modify specific sections unless full refresh requested.
