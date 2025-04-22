import Phaser from 'phaser';

export default class UIManager {
  constructor(scene, ecs) {
    this.scene = scene;
    this.ecs = ecs;
    this.components = new Map();
  }

  initialize() {
    this.addComponent('health', {
      text: 'Health: 100',
      positionFn: (text, width, height) => {
        const offsetX = -(width / 1.4) + 5;
        const offsetY = -(height / 1.4) + 5;
        return { offsetX, offsetY };
      },
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

    this.addComponent('gameOver', {
      text: 'Game Over',
      positionFn: (text, width, height) => {
        const offsetX = width / 2 - text.width / 2; // Flush right, 10px from edge
        const offsetY = height / 8 - text.height / 2; // Center vertically
        return { offsetX, offsetY };
      },
      font: '150px Arial',
      fill: '#000000',
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
    const {
      text,
      graphics = false,
      createFn,
      positionFn = () => ({ offsetX: 0, offsetY: 0 }),
      font = '80px Arial',
      fill = '#000000',
      depth = 100,
      updateFn,
      visible = true,
      scrollFactor = 0
    } = config;

    let obj;
    if (graphics && createFn) {
      obj = createFn();
    } else {
      obj = this.scene.add.text(0, 0, text, {
        font: font,
        fill: fill
      });
    }

    obj.setScrollFactor(scrollFactor).setDepth(depth);

    if (!visible) {
      obj.setVisible(false);
    }

    this.components.set(id, {
      text: obj, // Rename to 'obj' internally for generality
      positionFn,
      update: updateFn || (() => {})
    });

    this.updateComponentPosition(id);
    return id;
  }

  updateComponentPosition(id) {
    const component = this.components.get(id);
    if (!component) return;

    const { positionFn, text } = component;
    const width = this.scene.game.scale.width;
    const height = this.scene.game.scale.height;

    const { offsetX, offsetY } = positionFn(text, width, height);
    text.setPosition(offsetX, offsetY);
  }

  update() {
    for (const id of this.components.keys()) {
      this.updateComponentPosition(id);
    }

    for (const [id, component] of this.components.entries()) {
      component.update(id, this);
    }
  }

  destroy() {
    for (const component of this.components.values()) {
      component.text.destroy();
    }
    this.components.clear();
  }
}