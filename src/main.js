import Phaser from 'phaser';
import PreloaderScene from './scenes/PreloaderScene.js';
import MainScene from './scenes/MainScene.js';
import GameOverScene from './scenes/GameOverScene.js';

const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    parent: 'game-container',
    backgroundColor: 0xff0000,
    transparent: true,
    scene: [
        // Setup Scenes
        PreloaderScene,

        // Game Scenes
        MainScene,

        // UI Scenes
        GameOverScene
    ],
    physics: { 
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

const game = new Phaser.Game(config);