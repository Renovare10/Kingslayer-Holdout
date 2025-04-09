import Phaser from 'phaser';

export default class PreloaderScene extends Phaser.Scene {
    constructor() {
        super('PreloaderScene');
    }

    preload() {
        for (let i = 0; i < 20; i++) {
            this.load.image(`survivor-idle_handgun_${i}.png`, `/assets/Top_Down_Survivor/handgun/idle/survivor-idle_handgun_${i}.png`);
        }

            // Add zombie asset loading
            this.load.image('zombie', 'assets/Zombie/zombie.png');
    }

    create() {
        this.scene.start('MainScene');
    }
}