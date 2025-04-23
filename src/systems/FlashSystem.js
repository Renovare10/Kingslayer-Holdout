/**
 * System to handle flashing entities by toggling sprite alpha.
 */
export default class FlashSystem {
  constructor(scene) {
    this.scene = scene;
  }

  /**
   * Updates flash state and toggles sprite alpha.
   * @param {ECSManager} ecs - The ECS manager.
   */
  update(ecs) {
    const flashEntities = ecs.queryManager.getEntitiesWith('flash', 'sprite');

    flashEntities.forEach(entityId => {
      const flash = ecs.getComponent(entityId, 'flash');
      const sprite = ecs.getComponent(entityId, 'sprite')?.phaserSprite;

      // Skip if flash or sprite is missing
      if (!flash || !sprite) return;

      flash.currentTime += this.scene.game.loop.delta;

      // Toggle visibility at each interval
      if (flash.currentTime % flash.interval < this.scene.game.loop.delta) {
        flash.isVisible = !flash.isVisible;
        sprite.setAlpha(flash.isVisible ? 1 : 0.3); // Red to transparent-ish
      }

      // Remove flash component when duration is exceeded
      if (flash.currentTime >= flash.duration) {
        sprite.setAlpha(1); // Reset to full opacity
        ecs.removeComponent(entityId, 'flash');
      }
    });
  }
}