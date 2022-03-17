import explosionAnims from "./animations/explosions.js";

var BULLET_DAMAGE = 50;
var BULLET_SPRITE = 'bullet';
var BULLET_SPEED = 600;
var BULLET_LIFESPAN = 2000;
var BULLET_FIRERATE = 20;
var BULLET_SLOW = false;

var pcTurret;
var mouse;
var input;
var control=false;
var bullets;
var canShoot;
var slowAOEs;
var slowAOETimer = 0;

var AOE01;
var AOE02;
var AOE03;

var worldBounds;

var timer = 0;

var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, BULLET_SPRITE);
            scene.add.existing(this);
            scene.physics.add.existing(this)
            this.incX = 0;
            this.incY = 0;
            this.lifespan = 0;
            this.isSlow = BULLET_SLOW;
            this.speed = Phaser.Math.GetSpeed(BULLET_SPEED, 1);
        },

        fire: function (x, y, angle)
        {
            this.damage = BULLET_DAMAGE;
            this.setTexture(BULLET_SPRITE);
            this.speed = Phaser.Math.GetSpeed(BULLET_SPEED, 1);
            this.setActive(true);
            this.setVisible(true);
            //  Bullets fire from the middle of the screen to the given x/y
            this.setPosition(x, y);
            
        //    this.setRotation(angle);

            this.dx = Math.cos(angle);
            this.dy = Math.sin(angle);

            this.lifespan = BULLET_LIFESPAN;
        },

        update: function (time, delta)
        {
            this.lifespan -= delta;

            this.x += this.dx * (this.speed * delta);
            this.y += this.dy * (this.speed * delta);

            if (this.lifespan <= 0)
            {
                this.setActive(false);
                this.setVisible(false);
                this.destroy();
            }

            //check world bounds
            if(this.x>worldBounds.width || this.y>worldBounds.height ||this.x<0 || this.y<0){
                this.setActive(false);
                this.setVisible(false);
                this.destroy();
            }
        },

        bulletDamage: function()
        {
            return this.damage;
        },

        bulletSlow: function()
        {
            return this.isSlow;
        },

        isDestroy: function()
        {
            this.destroy();
        }

    });

    var SlowAOE = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function SlowAOE (scene)
        {
            this.mousePosX = input.x;
            this.mousePosY = input.y;
            this.sprite = Phaser.GameObjects.Image.call(this, scene, this.mousePosX, this.mousePosY, "slowAOE");
            scene.add.existing(this);
            scene.physics.add.existing(this)
            this.scene = scene;
            this.lifespan = 500;
            slowAOETimer = 500;
        },

        update: function (time, delta)
        {
            this.lifespan -= delta;

            if (this.lifespan <= 0)
            {
                this.setActive(false);
                this.setVisible(false);
                this.destroy();
            }

            //check world bounds
            if(this.x>worldBounds.width || this.y>worldBounds.height ||this.x<0 || this.y<0){
                this.setActive(false);
                this.setVisible(false);
                this.destroy();
            }
        }
    });

export default class PCTurret{ 
    constructor(scene, x, y) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.bulletGroup;
        this.create();
        this.currentBulletAudio;
        this.flamethrowerAudioFinished = true;
        this.isBullet = true;
        explosionAnims(this.scene.anims, "explode3");

    }

    create(){
        this.base = this.scene.physics.add.sprite(this.x,this.y,'pcTurretBase');
        pcTurret=this.scene.physics.add.sprite(this.x,this.y,'pcTurret');
        pcTurret.depth = 100;

        bullets = this.scene.physics.add.group({ classType: Bullet, runChildUpdate: true });
        slowAOEs = this.scene.physics.add.group({ classType: SlowAOE, runChildUpdate: true });

        this.bulletGroup = bullets;
        this.AOE01Group = slowAOEs;

        //for mouse click event
        mouse=this.scene.input.mousePointer;

        //for mouse position
        input=this.scene.input;

        //set game bounds
        worldBounds=this.scene.physics.world.bounds;    
        
        // Audio for bullet types
        this.audioFlamethrower = this.scene.sound.add('flamethrower', {loop:false});
        this.audioNormalBullet = this.scene.sound.add('normalBullet', {loop:false});
        this.audioIceBullet = this.scene.sound.add('iceBullet', {loop:false});
        this.audioPoisonBullet = this.scene.sound.add('poisonBullet', {loop:false});
        this.currentBulletAudio = this.audioNormalBullet; // Start with normal
    }

    update(){
        //angle between mouse and ball
        let angle=Phaser.Math.Angle.Between(this.x,this.y,input.x,input.y);

        //rotation pcTurret with PI/2
        pcTurret.setRotation(angle+Math.PI/2);

        //mouse clicked
        if(mouse.isDown && control==false && mouse.downX < 1088 && canShoot){
            if(this.isBullet)
            {
                addBullet(this.x, this.y, angle);
                control=true;
                // sound for flamethrower
                if (this.currentBulletAudio == this.audioFlamethrower) {
                    this.flamethrowerAudioControl();
                // sound for other bullets
                } else {
                   this.currentBulletAudio.play(); 
                }
            }
            else
            {
                if(AOE01 && slowAOETimer <= 0)
                {
                    var slowAOE = slowAOEs.get();
                    this.explodeAnim();
                    this.audioPoisonBullet.play();
                }
            }
        }

        if(control){
            timer--;
            if(timer <= 0)
            {
                control = false;
                timer = BULLET_FIRERATE;
            }
        }
        if(slowAOETimer > 0)
                slowAOETimer -= 1;
    }

    getBase() {
        return this.base;
    }

    getBulletGroup() {
        return this.bulletGroup;
    }

    getAOE01Group() {
        return this.AOE01Group;
    }

    getSlowAOETimerPercent() {
        if (slowAOETimer <= 0) {
            return 0;
        } else {
            return slowAOETimer / 500; // 500 = full cooldown time
        }
    }

    disable() {
        canShoot = false;
    }

    enable() {
        canShoot = true;
    }

    getBulletValues(bDamage, bSprite, bSpeed, bLife, bFire, bSlow)
    {
        BULLET_DAMAGE = bDamage;
        BULLET_SPRITE = bSprite;
        BULLET_SPEED = bSpeed;
        BULLET_LIFESPAN = bLife;
        BULLET_FIRERATE = bFire;
        BULLET_SLOW = bSlow;
    }

    getAOEValues(isOne, isTwo, isThree)
    {
        AOE01 = isOne;
        AOE02 = isTwo;
        AOE03 = isThree;
    }

    setBulletAudio(label) { 
        console.log(label);
        this.currentBulletAudio.stop();
        switch (label) {
            case 'flamethrower':
                this.currentBulletAudio = this.audioFlamethrower;
                break;
            case 'iceBullet':
                this.currentBulletAudio = this.audioIceBullet;
                break;
            case 'poisonBullet':
                this.currentBulletAudio = this.audioPoisonBullet;
            default:
                this.currentBulletAudio = this.audioNormalBullet;
                break;
        }
    }

    flamethrowerAudioControl() {
        if (this.flamethrowerAudioFinished == true) {
            this.flamethrowerAudioFinished = false;
            this.currentBulletAudio.play();
            setTimeout(() => {
                this.flamethrowerAudioFinished = true;
            }, 1000);
        }
    }

    isItBullet(isBullet) {
        this.isBullet = isBullet;
    }

    explodeAnim() {
        if (this.scene) {
            const explode = this.scene.add.sprite(input.x, input.y, "explode3")
            explode.setScale(7);
            explode.play('explode3', true);
            explode.once('animationcomplete', () => {
                explode.destroy();
            })
        }
    }
}

function addBullet(x, y, angle) {
    var bullet = bullets.get();
    if (bullet)
    {
        bullet.fire(x, y, angle);
    }
}

