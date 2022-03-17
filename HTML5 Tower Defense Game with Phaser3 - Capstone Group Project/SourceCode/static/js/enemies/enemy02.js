import Enemy from "./enemy.js";
import enemyAnims from "../animations/walkingAnims.js";

export default class EnemyTwo extends Enemy {
    constructor(scene, path, x, y) {
        super(scene, path, x, y, 'greenAlien');
        this.initAttributes();
    }
    initAttributes() {
        this.setScale(1.25);
        this.speed = 16;
        this.baseHP = 300;
        this.currentHP = 300;
        this.damageSFXKey = 'greenDamage';
        this.deathSFXKey = 'greenDeath';
        this.explosionKey = "explode3";
        this.specialSFXKey = 'greenSpecial';
        this.specialsLeft = 1;
        this.specialPoint = Phaser.Math.Between(30, 80) / 100;
        this.value = 15;

        enemyAnims(this.scene.anims, this.key);
    }

    // Speed boost
    special() {
        if (this.active && this.pathTween) {
            this.pathTween.setTimeScale(2.5);
            this.scene.juice.flash(this, 250, '0xFFFF00');
            this.scene.time.addEvent({ delay: 1000, callback: () => (this.pathTween.setTimeScale(1)), callbackScope: this });
            this.specialsLeft -= 1;
        }

    }
}