import Phaser from 'phaser';

/**
 * Manages UI elements for GameOverScene, such as clickable rectangles and text.
 */
export default class GameOverUIManager {
  constructor(scene, ecs) {
    this.scene = scene;
    this.ecs = ecs;
    this.components = new Map();
  }

  /**
   * Initializes the UI with a centered, clickable square and "Game Over" text.
   */
  initialize() {
    this.addComponent('restartSquare', {
      width: 100,
      height: 100,
      fillColor: 0x333333,
      depth: 150,
      positionFn: () => ({
        offsetX: this.scene.game.scale.width / 2,
        offsetY: this.scene.game.scale.height / 2
      }),
      onClick: () => {
        this.ecs.emit('restartGame');
        this.scene.scene.stop();
      }
    });

    this.addComponent('gameOverText', {
      text: 'Game Over',
      font: '75px Arial',
      fill: '#02343F',
      depth: 200,
      positionFn: (obj, width, height) => ({
        offsetX: width / 2 - obj.width / 2, // Center horizontally
        offsetY: height / 2 - 100 - obj.height / 1.1 // 100px above square
      })
    });

    // New rectangle component
    this.addComponent('lowerRectangle', {
      width: 400, // Fixed width, tweak as needed
      height: 80, // Fixed height, thinner for horizontal look
      fillColor: '#E3C170', // Lighter gray
      depth: 190,
      positionFn: (obj, width, height) => ({
        offsetX: width / 1.48 - obj.width / 2, // Center horizontally
        offsetY: height / 1.4 // 100px below square
      }),
      onClick: () => {
        this.ecs.emit('restartGame');
        this.scene.scene.stop();
      }
    });

    // New text component for "Continue"
    this.addComponent('continueText', {
      text: 'Continue',
      font: '40px Arial',
      fill: '#F0EDCC',
      depth: 195,
      positionFn: (obj, width, height) => {
        const rectComponent = this.components.get('lowerRectangle');
        const rectObj = rectComponent?.obj;
        const rectPos = rectObj
          ? { x: rectObj.x, y: rectObj.y, width: rectObj.width, height: rectObj.height }
          : { x: width / 1.48 - 400 / 2, y: height / 1.4, width: 400, height: 80 };
        return {
          offsetX: rectPos.x + rectPos.width / 12 - obj.width / 1.4, // Center horizontally in rectangle
          offsetY: rectPos.y + rectPos.height / 2 - obj.height / 0.7 // Center vertically in rectangle
        };
      }
    });
  }

  /**
   * Adds a UI component (rectangle or text).
   * @param {string} id - Unique identifier for the component.
   * @param {Object} config - Configuration for the component.
   * @param {number} [config.width] - Rectangle width.
   * @param {number} [config.height] - Rectangle height.
   * @param {number} [config.fillColor] - Rectangle fill color (hex).
   * @param {string} [config.text] - Text content.
   * @param {string} [config.font] - Text font (e.g., '150px Arial').
   * @param {string} [config.fill] - Text fill color (e.g., '#000000').
   * @param {number} [config.depth=0] - Render depth.
   * @param {Function} [config.onClick] - Click handler.
   * @param {Function} [config.positionFn] - Function to compute position.
   * @returns {string} Component ID.
   */
  addComponent(id, config) {
    const {
      width,
      height,
      fillColor,
      text,
      font,
      fill,
      depth = 0,
      onClick,
      positionFn = () => ({
        offsetX: this.scene.game.scale.width / 2,
        offsetY: this.scene.game.scale.height / 2
      })
    } = config;

    let obj;
    if (text) {
      obj = this.scene.add.text(0, 0, text, { font, fill })
        .setScrollFactor(0)
        .setDepth(depth);
    } else {
      obj = this.scene.add.rectangle(0, 0, width, height, fillColor)
        .setScrollFactor(0)
        .setDepth(depth);
    }

    if (onClick) {
      obj.setInteractive();
      obj.on('pointerdown', onClick);
    }

    const { offsetX, offsetY } = positionFn(obj, this.scene.game.scale.width, this.scene.game.scale.height);
    obj.setPosition(offsetX, offsetY);

    this.components.set(id, { obj });

    return id;
  }

  /**
   * Destroys all UI components.
   */
  destroy() {
    for (const component of this.components.values()) {
      component.obj.destroy();
    }
    this.components.clear();
  }
}