import Enemy from "./enemy.js";
import enemyAnims from "../animations/walkingAnims.js";

export default class EnemySix extends Enemy {
    constructor(scene, path, x, y) {
        super(scene, path, x, y, 'robotYellow');
        this.initAttributes();
    }
    initAttributes() {
        this.setScale(.8);
        this.speed = 26;
        this.baseHP = 700;
        this.currentHP = 700;
        this.damageSFXKey = 'roboDamage';
        this.deathSFXKey = 'roboDeath';
        this.explosionKey = "explode5";
        this.specialSFXKey = 'roboSpecial';
        this.specialsLeft = 1;
        this.specialPoint = Phaser.Math.Between(30, 80) / 100;
        this.value = 30;

        enemyAnims(this.scene.anims, this.key);
    }

    special() {
        if (this.active && this.pathTween) {
            this.scene.juice.pulse(this);
            this.currentHP += 200;
            this.speed = 16;
            this.specialsLeft -= 1;
        }
    }
}