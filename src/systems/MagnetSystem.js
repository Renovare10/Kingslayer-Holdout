/**
 * Manages XP magnet effect, pulling XP entities toward the player within a radius.
 */
export default class MagnetSystem {
  /**
   * @param {Phaser.Scene} scene - The Phaser scene.
   * @param {Object} physicsManager - The physics manager for accessing physics groups.
   */
  constructor(scene, physicsManager) {
    this.scene = scene;
    this.physicsManager = physicsManager;
    this.magnetCircle = null;
  }

  /**
   * Initializes the system with the ECS manager.
   * @param {Object} ecs - The ECS manager instance.
   */
  init(ecs) {
    this.ecs = ecs;
  }

  /**
   * Updates the magnet effect, applying pull to XP entities and syncing flash sprites.
   */
  update() {
    if (!this.physicsManager) return;

    const player = this.#getPlayer();
    if (!player) return;

    const { magnetUpgrade, position: playerPos } = player;
    if (!magnetUpgrade) return;

    const radius = magnetUpgrade.count * magnetUpgrade.radius;
    this.#createMagnetCircle(playerPos, radius);
    this.#processXPEntities(playerPos, radius);
  }

  /**
   * Retrieves the player entity with magnet upgrade and position components.
   * @returns {Object|null} Player data with magnetUpgrade and position, or null if not found.
   * @private
   */
  #getPlayer() {
    const player = [...this.ecs.queryManager.getEntitiesWith('entityType', 'position', 'magnetUpgrade')]
      .find(id => this.ecs.getComponent(id, 'entityType').type === 'player');
    if (!player) return null;

    const magnetUpgrade = this.ecs.getComponent(player, 'magnetUpgrade');
    const position = this.ecs.getComponent(player, 'position');
    return { magnetUpgrade, position };
  }

  /**
   * Creates or updates the magnet circle centered on the player.
   * @param {Object} playerPos - Player position with x, y coordinates.
   * @param {number} radius - Magnet circle radius.
   * @private
   */
  #createMagnetCircle(playerPos, radius) {
    if (!this.magnetCircle || this.magnetCircle.radius !== radius) {
      if (this.magnetCircle) {
        this.magnetCircle.destroy();
      }
      this.magnetCircle = this.scene.add.circle(playerPos.x, playerPos.y, radius, 0x000000, 0);
      this.scene.physics.add.existing(this.magnetCircle);
      this.magnetCircle.setOrigin(0.5);
      this.magnetCircle.body.setCircle(radius);
      this.magnetCircle.body.setImmovable(true);
      this.magnetCircle.body.setAllowGravity(false);
    }
    this.magnetCircle.setPosition(playerPos.x, playerPos.y);
  }

  /**
   * Processes XP entities, applying magnet pull and syncing flash sprites.
   * @param {Object} playerPos - Player position with x, y coordinates.
   * @param {number} radius - Magnet circle radius.
   * @private
   */
  #processXPEntities(playerPos, radius) {
    const xpEntities = this.ecs.queryManager.getEntitiesWith('xp', 'sprite', 'position', 'physicsBody');
    xpEntities.forEach(xpId => {
      const spriteData = this.ecs.getComponent(xpId, 'sprite');
      const xpSprite = spriteData.phaserSprite;
      const xpPos = this.ecs.getComponent(xpId, 'position');

      if (!this.#isInRange(playerPos, xpPos, radius)) return;

      this.#applyMagnetVelocity(playerPos, xpPos, radius, xpId);
      this.#syncFlashSprite(spriteData, xpSprite);
    });
  }

  /**
   * Checks if an XP entity is within the magnet radius.
   * @param {Object} playerPos - Player position with x, y coordinates.
   * @param {Object} xpPos - XP position with x, y coordinates.
   * @param {number} radius - Magnet circle radius.
   * @returns {boolean} True if XP is in range, false otherwise.
   * @private
   */
  #isInRange(playerPos, xpPos, radius) {
    const dx = playerPos.x - xpPos.x;
    const dy = playerPos.y - xpPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < radius * 0.99 && distance >= 1; // Threshold to reduce jitter
  }

  /**
   * Computes the pull factor for the piecewise smooth style.
   * @param {number} distance - Distance from player to XP entity.
   * @param {number} radius - Magnet circle radius.
   * @returns {number} Pull factor (0.15 to 1.0).
   * @private
   */
  #computePullFactor(distance, radius) {
    const ratio = 1 - (distance / radius); // Normalized distance (0 at edge, 1 at center)
    // Cubic spline: pullFactor = a * ratio^3 + b * ratio^2 + c * ratio + d
    // Coefficients for zones: outer (0.15 at ratio=0), middle (0.5 at ratio=1/3), inner (0.75 at ratio=2/3, 1.0 at ratio=1)
    const a = 0.45;
    const b = -0.3;
    const c = 0.55;
    const d = 0.15;
    return a * ratio ** 3 + b * ratio ** 2 + c * ratio + d;
  }

  /**
   * Applies magnet pull velocity to an XP entity.
   * @param {Object} playerPos - Player position with x, y coordinates.
   * @param {Object} xpPos - XP position with x, y coordinates.
   * @param {number} radius - Magnet circle radius.
   * @param {number} xpId - XP entity ID.
   * @private
   */
  #applyMagnetVelocity(playerPos, xpPos, radius, xpId) {
    const dx = playerPos.x - xpPos.x;
    const dy = playerPos.y - xpPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const pullFactor = this.#computePullFactor(distance, radius);
    const speed = 200 * pullFactor; // Max speed 200 for dynamic range

    const magnitude = Math.sqrt(dx * dx + dy * dy);
    const velocityX = (dx / magnitude) * speed;
    const velocityY = (dy / magnitude) * speed;

    const xpPhysics = this.ecs.getComponent(xpId, 'physicsBody').body;
    xpPhysics.setImmovable(false);
    xpPhysics.setVelocity(velocityX, velocityY);

    // Temporary debug log for testing (remove after confirmation)
    console.debug(`MagnetSystem: XP ${xpId} at distance ${distance.toFixed(2)}, pullFactor: ${pullFactor.toFixed(3)}, speed: ${speed.toFixed(2)}`);
  }

  /**
   * Syncs the flash sprite position with the main XP sprite.
   * @param {Object} spriteData - Sprite data containing phaserSprite and flashSprite.
   * @param {Object} xpSprite - The main XP sprite (phaserSprite).
   * @private
   */
  #syncFlashSprite(spriteData, xpSprite) {
    if (spriteData.flashSprite && spriteData.flashSprite.active) {
      spriteData.flashSprite.setPosition(xpSprite.x, xpSprite.y);
    }
  }
}