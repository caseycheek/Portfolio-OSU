import Enemy from "./enemy.js";
import enemyAnims from "../animations/walkingAnims.js";

export default class EnemyOne extends Enemy {
    constructor(scene, path, x, y) {
        super(scene, path, x, y, 'pinkAlien');
        this.initAttributes();
    }
    initAttributes() {
        this.speed = 19;
        this.baseHP = 250;
        this.currentHP = 250;
        this.damageSFXKey = 'creaturePain';
        this.deathSFXKey = 'creatureDeath';
        this.explosionKey = "explode1";
        this.specialSFXKey = 'creatureSpecial';
        this.specialsLeft = 1;
        this.specialPoint = Phaser.Math.Between(25, 85) / 100;
        this.value = 10;

        enemyAnims(this.scene.anims, this.key);
    }

    // Puff up and increase value/attack and hp
    special() {
        if (this.active && this.pathTween) {
            this.scene.juice.pulse(this);
            this.specialsLeft -= 1;
            this.setScale(1.5);
            this.currentHP += 100;
            this.value += 10;
        }
    }
}