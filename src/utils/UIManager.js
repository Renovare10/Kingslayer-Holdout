import Phaser from 'phaser';

export default class UIManager {
  constructor(scene, ecs) {
    this.scene = scene;
    this.ecs = ecs;
    this.components = new Map();
  }

  initialize() {
    // Health UI component
    this.addComponent('health', {
      text: 'Health: 100',
      position: 'top-left',
      font: '80px Arial',
      fill: '#000000',
      depth: 100,
      updateFn: (id, uiManager) => {
        uiManager.ecs.on('healthChanged', ({ health }) => {
          const component = uiManager.components.get(id);
          if (component) {
            component.text.setText(`Health: ${health}`);
          }
        });
      }
    });

    // Game over UI component (initially hidden)
    this.addComponent('gameOver', {
      text: 'Game Over',
      position: 'center',
      font: '100px Arial',
      fill: '#ff0000',
      depth: 200,
      visible: false,
      updateFn: (id, uiManager) => {
        uiManager.ecs.on('gameOver', () => {
          const component = uiManager.components.get(id);
          if (component) {
            component.text.setVisible(true);
          }
        });
      }
    });
  }

  addComponent(id, config) {
    const { text, position = 'top-left', font = '80px Arial', fill = '#000000', depth = 100, updateFn, visible = true } = config;

    // Create the Phaser text object
    const textObject = this.scene.add.text(0, 0, text, {
      font: font,
      fill: fill
    }).setScrollFactor(0).setDepth(depth);

    if (!visible) {
      textObject.setVisible(false);
    }

    // Store the component
    this.components.set(id, {
      text: textObject,
      position: position,
      update: updateFn || (() => {})
    });

    // Set initial position
    this.updateComponentPosition(id);

    // Return the component ID for reference
    return id;
  }

  updateComponentPosition(id) {
    const component = this.components.get(id);
    if (!component) return;

    const { position, text } = component;
    const width = this.scene.game.scale.width;
    const height = this.scene.game.scale.height;

    // Position based on the specified corner
    let offsetX, offsetY;
    if (position === 'top-left') {
      offsetX = -(width / 1.4) + 5;
      offsetY = -(height / 1.4) + 5;
    } else if (position === 'top-right') {
      offsetX = (width / 1.4) - text.width - 5;
      offsetY = -(height / 1.4) + 5;
    } else if (position === 'center') {
      offsetX = -(text.width / 2);
      offsetY = -(text.height / 2);
    } else {
      offsetX = 0;
      offsetY = 0;
    }

    text.setPosition(offsetX, offsetY);
  }

  update() {
    // Update all components' positions (for viewport resizing)
    for (const id of this.components.keys()) {
      this.updateComponentPosition(id);
    }

    // Call each component's update function (e.g., to handle ECS events)
    for (const [id, component] of this.components.entries()) {
      component.update(id, this);
    }
  }

  destroy() {
    // Clean up all UI components
    for (const component of this.components.values()) {
      component.text.destroy();
    }
    this.components.clear();
  }
}