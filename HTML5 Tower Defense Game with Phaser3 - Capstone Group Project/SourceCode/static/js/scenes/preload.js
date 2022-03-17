
class Preload extends Phaser.Scene {
    constructor() {
        super('Preload');
    }

    preload() {
        // Canvas config
        let canvas = this.sys.game.canvas;

        // Title and other scene page assets
        this.load.html("difficulty", "../assets/html/title.html");
        this.load.image('titleBG', "../assets/backgrounds/tower_bg.jpg")
        this.load.image('turtleShell', '../assets/icons/turtle-shell.png' )
        this.load.image('turtleGuy', '../assets/icons/turtle.png' )
        this.load.image('sunnyBG', "../assets/backgrounds/sunny_bg.jpg" )
        this.load.image('snowBG', "../assets/backgrounds/snow_bg.jpg" )
        this.load.image('desertBG', "../assets/backgrounds/desert_bg.jpg" )



        // Load map assets
        this.load.tilemapTiledJSON('map01', '../assets/maps/map01.json');
        this.load.tilemapTiledJSON('map02', '../assets/maps/map02.json');
        this.load.tilemapTiledJSON('map03', '../assets/maps/map03.json');
        this.load.image('terrain', '../assets/maps/terrain.png');

        // Load icon assets
        this.load.image('towerHealth', '../assets/icons/towerHealth.png');
        this.load.image('money', '../assets/icons/money.png');
        this.load.image('buyTurret01', '../assets/icons/turret01-100v2.png');
        this.load.image('buyTurret02', '../assets/icons/turret02-300.png');
        this.load.image('buyTurret03', '../assets/icons/turret03-200.png');
        this.load.image('pcTurret01', '../assets/icons/pcTurret01v2.png');
        this.load.image('pcTurret02', '../assets/icons/pcTurret02v2.png');
        this.load.image('pcTurret03', '../assets/icons/pcTurret03v2.png');
        this.load.image('pcTurret04', '../assets/icons/pcTurret04.png');
        this.load.image('unknown', '../assets/icons/unknown.png');

        // Load enemy spritesheets
        this.load.spritesheet('pinkAlien','../assets/sprites/pinkAlienWalkingV2.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('greenAlien','../assets/sprites/greenAlienWalking.png', {frameWidth: 32, frameHeight: 32});

        this.load.spritesheet('robotGreen','../assets/sprites/spacebot-green.png', {frameWidth: 48, frameHeight: 64});
        this.load.spritesheet('robotYellow','../assets/sprites/spacebot-yellow.png', {frameWidth: 48, frameHeight: 64});

        this.load.spritesheet('marePurple','../assets/sprites/dark_minimare-001.png', {frameWidth: 48, frameHeight: 64});
        this.load.spritesheet('mareBlack','../assets/sprites/minimare_robot-002.png', {frameWidth: 48, frameHeight: 64});
        this.load.spritesheet('mareViolet','../assets/sprites/minimare-001.png', {frameWidth: 48, frameHeight: 64});

        // Load portal spritesheets
        this.load.spritesheet('purplePortal', '../assets/sprites/purplePortal.png', {frameWidth: 64, frameHeight: 64} )

        // Load explosions spritesheets
        this.load.spritesheet('explode1', '../assets/sprites/explosions/explode1.png', {frameWidth: 33, frameHeight: 33 } );
        this.load.spritesheet('explode2', '../assets/sprites/explosions/explode2.png', {frameWidth: 33, frameHeight: 33 } );
        this.load.spritesheet('explode3', '../assets/sprites/explosions/explode3.png', {frameWidth: 33, frameHeight: 33 } );
        this.load.spritesheet('explode4', '../assets/sprites/explosions/explode4.png', {frameWidth: 33, frameHeight: 33 } );
        this.load.spritesheet('explode5', '../assets/sprites/explosions/explode5.png', {frameWidth: 33, frameHeight: 33 } );

        // Other animation spritesheets
        this.load.spritesheet('smoke', '../assets/sprites/smoke.png', {frameWidth: 300, frameHeight: 300 } )
        this.load.spritesheet('greenSmoke', '../assets/sprites/greenSmoke.png', {frameWidth: 300, frameHeight: 300 } )
        this.load.spritesheet('star' , '../assets/sprites/star.png', {frameWidth: 192, frameHeight: 192 } )
        this.load.spritesheet('hitYellow' , '../assets/sprites/hit-yellow.png', {frameWidth: 1024, frameHeight: 1024 } )

        // Player assets
        this.load.image('pcTurret', '../assets/pcTurret/pcTurretCannon.png');
        this.load.image('pcTurretBase', '../assets/pcTurret/pcTurretBase.png');
        // Bullet assets
        this.load.image('bullet', '../assets/bullets/bullet.png');
        this.load.image('fireBullet', '../assets/bullets/fire.png');
        this.load.image('beeBullet', '../assets/bullets/beeBullet.png');
        this.load.image('iceBullet', '../assets/bullets/iceBullet.png');
        //AOE
        this.load.image('slowAOE','../assets/aoe/slowAOE.png');

        // Turret
        this.load.image('yellowStripedGun','assets/sprites/yellowStripedGun.png');
        this.load.image('flamethrowerTurret','assets/sprites/flamethrowerTurret.png');
        this.load.image('sniperTurret','assets/sprites/sniperTurret.png');
        this.load.image('cursor','assets/icons/cursor.png');
        this.load.image('cursorX','assets/icons/cursorX.png');
        
        // Audio
        this.load.audio('toggle', ['../assets/audio/switch20.ogg']);
        this.load.audio('flamethrower', ['../assets/audio/LEGIT_FIR_Fire_Staff 2-Audio.wav']);
        this.load.audio('normalBullet', ['../assets/audio/footstep_carpet_004.ogg']);
        this.load.audio('iceBullet', ['../assets/audio/impactGlass_heavy_000.ogg']);
        this.load.audio('poisonBullet', ['../assets/audio/LEGIT_FIR_Fire_Staff 8-Audio.wav']);
        this.load.audio('menuMusic', ['../assets/audio/chasing_theme.mp3']);
        this.load.audio('level1Music', ['../assets/audio/latin_soloist.mp3']);
        this.load.audio('level2Music', ['../assets/audio/Determination_underfirev1.mp3']);
        this.load.audio('level3Music', ['../assets/audio/Horror_Adventure_v2.mp3']);
        this.load.audio('gameOver', ['../assets/audio/game_over.wav']);
        this.load.audio('gameStart',['../assets/audio/game_start.mp3']);
        this.load.audio('victory', ['../assets/audio/Victory.mp3']);
        this.load.audio('complete', ['../assets/audio/fanfare.wav']);


        // Enemy audio
        this.load.audio('miniMareHiss', ['../assets/audio/enemies/Minimare_Hiss.wav']);
        this.load.audio('miniMareHurt', ['../assets/audio/enemies/Minimare_Hurt.wav']);
        this.load.audio('miniMareDie', ['../assets/audio/enemies/Minimare_Die.wav']);

        this.load.audio('creatureDeath', ['../assets/audio/enemies/space_creature_death.wav']);
        this.load.audio('creaturePain', ['../assets/audio/enemies/space_creature_pain.wav']);
        this.load.audio('creatureSpecial', ['../assets/audio/enemies/space_creature_special.wav']);

        this.load.audio('roboSpecial', ['../assets/audio/enemies/robo_special.wav']);
        this.load.audio('roboDeath', ['../assets/audio/enemies/robo_death.wav']);        
        this.load.audio('roboDamage', ['../assets/audio/enemies/robo_damage.wav']);

        this.load.audio('greenSpecial', ['../assets/audio/enemies/green_special.wav']);
        this.load.audio('greenDeath', ['../assets/audio/enemies/green_death.wav']);        
        this.load.audio('greenDamage', ['../assets/audio/enemies/green_damage.wav']);


    }

    create() {
        this.scene.start('Prelude');
    }

}

export default Preload;
