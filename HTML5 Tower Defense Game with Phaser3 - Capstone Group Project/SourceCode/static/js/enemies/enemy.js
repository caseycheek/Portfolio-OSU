import explosionAnims from "../animations/explosions.js";
// import hitAnims from "../animations/hit.js"

export default class Enemy extends Phaser.GameObjects.PathFollower {
    constructor(scene, path, x, y, key) {
        super(scene, path, x, y, key);

        scene.add.existing(this);
        scene.physics.add.existing(this)
        
        this.init(key);
    }
    // Base values
    init(key) {
        this.speed = 0;
        this.baseHP = 0;
        this.currentHP = 0;
        this.damageSFXKey;
        this.deathSFXKey;
        this.explosionKey;
        this.isMoving;
        this.key = key;
        this.specialPoint = 0;
        this.specialsLeft = 0;
        this.value = 0;
        this.coords = this.getCurrentLocation();

        this.setActive(false);
        this.setVisible(false);

    }
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if ((this.specialPoint ===  Phaser.Math.FloorTo(this.pathTween.progress, -2) && this.specialsLeft > 0)) {
            this.scene.sound.add(this.specialSFXKey, {loop:false, volume: 0.4}).play();
            this.special();
        }

        this.newCoords = this.getCurrentLocation();

        const orientationRads = Phaser.Math.Angle.Between(
            this.coords.x, this.coords.y, this.newCoords.x, this.newCoords.y
        );
        const degrees = Phaser.Math.RadToDeg(orientationRads);

        // Movement
        if (degrees > -135 && degrees > 135 ) {
            this.play(this.key+'WalkWest', true);
            this.isMoving = true;
        } else if (degrees >= -135 && degrees <= -45) {
            this.play(this.key+'WalkNorth', true);
            this.isMoving = true;
        } else if (degrees > -45 && degrees < 45) {
            this.play(this.key+'WalkEast', true);
            this.isMoving = true;
        } else if (degrees >= 45 && degrees <= 135) {
            this.play(this.key+'WalkSouth', true);
        } else {
            this.isMoving = false;

        }
        this.coords = this.newCoords;
    }

    disable() {
        this.setActive(false);
        this.setVisible(false);
        this.deathSFX();
        this.deathAnim();
        this.destroy();
    }

    damageSFX() {
        if (this.scene) {
            this.scene.sound.add(this.damageSFXKey, {loop:false,  volume: 0.4}).play();   
        }
    }


    deathSFX() {
        if (this.scene) {
            this.scene.sound.add(this.deathSFXKey, {loop:false,  volume: 0.4}).play();
        }
    }

    deathAnim() {
        if (this.scene) {
            explosionAnims(this.scene.anims, this.explosionKey);
            const explode = this.scene.add.sprite(this.x, this.y, this.explosionKey);
            explode.setScale(2.5);
            explode.play(this.explosionKey, true);
            explode.once('animationcomplete', () => {
                explode.destroy();
            })
        }
    }

    getHit(damage) {
        // if (this.getHP() > 0) {
        //     hitAnims(this.scene.anims, "hitYellow")
        //     const hit = this.scene.add.sprite(this.x, this.y, "hitYellow")
        //     hit.setScale(0.1);
        //     hit.play("hitYellow", true);
        //     hit.once('animationcomplete', () => {
        //         hit.destroy();
        //     })
        // }
        console.log("damage = "+ damage.toString());
        console.log("("+this.currentHP.toString()+" / "+this.baseHP.toString());
        if (damage >= 0 && this.isMoving === true) {
            this.currentHP -= damage;
        }
        
        // this.damageSFX();

        // Color change at 75+, 50+, 0+  health percentiles
        if (this.getHP() >= (this.getBaseHP() * .75)) {
            this.setTint(0xffb5b7);
        } else if (this.getHP() >= (this.getBaseHP() * .50)) {
            this.setTint(0xff9194);
        } else {
            this.setTint(0xff595e);
        } 
    }

    getBaseHP() {
        return this.baseHP;
    }

    getHP() {
        return this.currentHP;
    }

    getCurrentLocation() {
        return {
            x: this.x,
            y: this.y
        }
    }

    // Start follow modified from https://phaser.io/examples/v3/view/paths/followers/mass-followers
    start(i) {
        this.enemyNumber = i;
        this.startFollow({
            positionOnPath: true,
            duration: this.path.getLength() * this.speed,
            yoyo: false,
            repeat: 0,
            rotateToPath: false,
            verticalAdjust: true,
            _delay: i * 500,
            delay: i * 500
        });
        this.setVisible(true);
        this.setActive(true);
    }
}