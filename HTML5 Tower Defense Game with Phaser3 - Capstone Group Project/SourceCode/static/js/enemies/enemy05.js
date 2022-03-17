import Enemy from "./enemy.js";
import EnemyOne from "./enemy01.js"
import enemyAnims from "../animations/walkingAnims.js";
import portalAnims from '../animations/portals.js';


export default class EnemyFive extends Enemy {
    constructor(scene, path, x, y) {
        super(scene, path, x, y,'mareViolet');
        this.initAttributes();
    }
    initAttributes() {
        this.setScale(.7);
        this.speed = 21;
        this.baseHP = 400;
        this.currentHP = 400;
        this.damageSFXKey = 'miniMareHurt';
        this.deathSFXKey = 'miniMareDie';
        this.explosionKey = "explode4";
        this.specialSFXKey = 'miniMareHiss';
        this.specialsLeft = 1;
        this.specialPoint = Phaser.Math.Between(25, 70) / 100;
        this.value = 20;

        enemyAnims(this.scene.anims, this.key);
        portalAnims(this.scene.anims);
    }

    special() {
        if (this.active && this.pathTween) {
            this.scene.juice.flash(this, 1500, '0x4a006a');
            this.createPortal();
            this.specialsLeft -= 1;
        }
    }
    createPortal() {
        const x = this.path.getPoint(this.specialPoint).x;
        const y = this.path.getPoint(this.specialPoint).y;
        this.portal = this.scene.add.sprite(x, y, "purplePortal");
        this.portal.setScale(2, 1.25);
        this.portal.setDepth(1);
        this.portalPoint = this.pathTween.progress;
        this.summonPortal();
    }

    summonPortal() {
        // Probably need to refactor, lol
        if (this.active) {
            this.portal.play('start', true);
            this.portal.once('animationcomplete', ()=>{ 
                this.portal.play('idle');
                if (this.active) {
                    this.miniWave();
                }
                this.portal.once('animationcomplete', ()=>{
                    this.portal.play('disappear');
                    this.portal.once('animationcomplete', ()=>{ 
                        this.portal.destroy();
                    })
                })
            })
        }

    }

    miniWave() {
        const miniEnemies = [
            new EnemyOne(this.scene, this.path, this.portal.x, this.portal.y),
            new EnemyOne(this.scene, this.path, this.portal.x, this.portal.y),
            new EnemyOne(this.scene, this.path, this.portal.x, this.portal.y),
        ]

        for (let i = 0; i < miniEnemies.length; i++) {
            this.scene.currentWave.add(miniEnemies[i]);
            miniEnemies[i].setScale(.8);
            miniEnemies[i].setDepth(0.5);
            miniEnemies[i].setTint('0xFEF24E');
            
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