import Enemy from "./enemy.js";
import EnemySix from "./enemy06.js";
import enemyAnims from "../animations/walkingAnims.js";
import specialAnims from "../animations/specials.js";

export default class EnemySeven extends Enemy {
    constructor(scene, path, x, y) {
        super(scene, path, x, y, 'robotGreen');
        this.initAttributes();
    }
    initAttributes() {
        this.setScale(.8);
        this.speed = 28;
        this.baseHP = 800;
        this.currentHP = 800;
        this.damageSFXKey = 'roboDamage';
        this.deathSFXKey = 'roboDeath';
        this.explosionKey = "explode5";
        this.specialSFXKey = 'roboSpecial';
        this.specialsLeft = 1;
        this.specialPoint = Phaser.Math.Between(30, 80) / 100;
        this.value = 30;

        enemyAnims(this.scene.anims, this.key);
        specialAnims(this.scene.anims, 'greenSmoke');
    }

    special() {
        if (this.active && this.pathTween) {
            this.scene.time.addEvent({ delay: 500, callback: () => (this.smoke()), callbackScope: this });
            this.specialsLeft -= 1;
        } 
    }

    smoke() {
        if (this.active) {
            const smoke = this.scene.add.sprite(this.x, this.y, "greenSmoke");
            smoke.setScale(.35);
            smoke.setDepth(2);
            smoke.play('greenSmoke', true);
            smoke.once('animationcomplete', () => {
                smoke.destroy();
            });
            if (this.active) {
                this.miniWave();
            }
        }
    }

    miniWave() {
        const x = this.path.getPoint(this.specialPoint).x;
        const y = this.path.getPoint(this.specialPoint).y;

        const miniEnemies = [
            new EnemySix(this.scene, this.path, x, y),
            new EnemySix(this.scene, this.path, x, y),
        ]

        for (let i = 0; i < miniEnemies.length; i++) {
            this.scene.currentWave.add(miniEnemies[i]);
            miniEnemies[i].setScale(.6);
            miniEnemies[i].setDepth(0.5);
            
            miniEnemies[i].startFollow({
                positionOnPath: true,
                duration: this.path.getLength() * 14,
                from: this.specialPoint,
                yoyo: false,
                repeat: 0,
                rotateToPath: false,
                verticalAdjust: true,
                _delay: i * 500,
                delay: i * 500
            });
            miniEnemies[i].setVisible(true);
            miniEnemies[i].setActive(true);
        }
    }
}