import Enemy from "./enemy.js";
import enemyAnims from "../animations/walkingAnims.js";
import specialAnims from "../animations/specials.js";

export default class EnemyFour extends Enemy {
    constructor(scene, path, x, y) {
        super(scene, path, x, y, 'mareBlack');
        this.initAttributes();
    }
    initAttributes() {
        this.setScale(.7);
        this.speed = 40;
        this.baseHP = 1000;
        this.currentHP = 1000;
        this.damageSFXKey = 'miniMareHurt';
        this.deathSFXKey = 'miniMareDie';
        this.explosionKey = "explode4";
        this.specialSFXKey = 'miniMareHiss';
        this.specialsLeft = 1;
        this.specialPoint = Phaser.Math.Between(40, 80) / 100;
        this.value = 20;

        enemyAnims(this.scene.anims, this.key);
        specialAnims(this.scene.anims, 'star');
    }
    // Biggie ability
    special() {
        if (this.pathTween) {
            const transformTime = Phaser.Math.FloatBetween(500, 3000);

            const star = this.scene.add.sprite(this.x, this.y, "star");
            star.setScale(.6);
            star.play('star', true);
            star.once('animationcomplete', () => {
                star.destroy();
                this.pathTween.setTimeScale(0.1)
                this.biggie();
            })
            this.scene.time.addEvent({ delay: transformTime , callback: () => (  this.pathTween.setTimeScale(1.25)), callbackScope: this });
            this.specialsLeft -= 1;
        }

    }

    biggie() {
        this.setScale(1);
        this.currentHP += 500;

    }
}