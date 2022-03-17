import Enemy from "./enemy.js";
import enemyAnims from "../animations/walkingAnims.js";
import specialAnims from "../animations/specials.js";

export default class EnemyThree extends Enemy {
    constructor(scene, path, x, y) {
        super(scene, path, x, y, 'marePurple');
        this.initAttributes();
    }
    initAttributes() {
        this.setScale(.7);
        this.speed = 22;
        this.baseHP = 400;
        this.currentHP = 400;
        this.damageSFXKey = 'miniMareHurt';
        this.deathSFXKey = 'miniMareDie';
        this.explosionKey = "explode4";
        this.specialSFXKey = 'miniMareHiss';
        this.specialsLeft = 1;
        this.specialPoint = Phaser.Math.Between(40, 80) / 100;
        this.value = 20;

        enemyAnims(this.scene.anims, this.key);
        specialAnims(this.scene.anims, 'smoke');

    }
    // Smoke screen
    async special() {
        if (this.active && this.pathTween) {
            await this.wobble();
            await this.smoke();
            this.specialsLeft -= 1;
        }
    }

    wobble() {
        return new Promise((resolve) => {
            this.scene.juice.wobble(this, {
                onStart: function() {
                    if (this.active) {
                        this.pathTween.setTimeScale(0.05)
                    }
                }.bind(this),
                onComplete: function() {
                    if (this.active) {
                        this.scene.time.addEvent({ delay: 500, callback: () => (   this.pathTween.setTimeScale(1)), callbackScope: this });
                    }

                }.bind(this),
                x: 12,
            })
            resolve();
        })
    }

    smoke() {
        return new Promise((resolve) => {
            this.pathTween.setTimeScale(1);
            const smoke = this.scene.add.sprite(this.x, this.y, "smoke");
            smoke.setDepth(2);
            smoke.play('smoke', true);
            smoke.once('animationcomplete', () => {
            smoke.destroy();
            })
            resolve();
        })

    }
}