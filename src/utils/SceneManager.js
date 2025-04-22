import Phaser from 'phaser';

/**
 * Manages scene lifecycle, including cleanup, restart, and transitions.
 */
export default class SceneManager {
  constructor(game) {
    this.game = game;
  }

  /**
   * Restarts a scene by cleaning up its managers and restarting it.
   * @param {string} sceneKey - The scene key (e.g., 'MainScene').
   * @param {Object} managers - Managers to clean up (ecs, physicsManager, uiManager).
   */
  restartScene(sceneKey, managers) {
    const { ecs, physicsManager, uiManager } = managers;
    const scene = this.game.scene.getScene(sceneKey);

    if (!scene) return;

    // Clean up ECS
    if (ecs) {
      ecs.entities.clear();
      ecs.components.clear();
      ecs.systems.length = 0;
      ecs.queryManager.componentIndex.clear();
      ecs.eventManager.clear();
    }

    // Clean up physics
    if (physicsManager) {
      if (physicsManager.zombieGroup && physicsManager.zombieGroup.children) {
        physicsManager.zombieGroup.clear(true, true);
      }
      if (physicsManager.bulletGroup && physicsManager.bulletGroup.children) {
        physicsManager.bulletGroup.clear(true, true);
      }
      physicsManager.zombieGroup = null;
      physicsManager.bulletGroup = null;
    }

    // Clean up UI
    if (uiManager) {
      uiManager.destroy();
    }

    // Restart scene
    scene.scene.restart();
  }

  /**
   * Stops a scene.
   * @param {string} sceneKey - The scene key (e.g., 'GameOverScene').
   */
  stopScene(sceneKey) {
    const scene = this.game.scene.getScene(sceneKey);
    if (scene) {
      scene.scene.stop();
    }
  }
}