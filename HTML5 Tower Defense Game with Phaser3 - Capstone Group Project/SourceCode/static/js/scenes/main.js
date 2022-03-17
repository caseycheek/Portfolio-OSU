import EnemyWave from "../enemyWave.js";
import WaveButton from "../waveButton.js";
import PCTurret from "../pcTurret.js";
import Turret from "../turret1.js";
import Turret2 from "../turret2.js";
import Turret3 from "../turret3.js";
import placementMapConfig from "../configs/map.js";
import Enemy from "../enemies/enemy.js";
import TBullet from "../bullet.js";
import hitAnims from "../animations/hit.js"

const INIT_PLAYERHP = 100;
const INIT_MONEY = 500;
const INIT_WAVECOUNT = 1;
const INIT_MAXLEVELS = 3;   // keep up to date as we add more
const INIT_MAXWAVECOUNT = 11;    // 2 for testing, should be 11 for final
const BULLET_DAMAGE = 20;

class Main extends Phaser.Scene {
    constructor() {
        super('Main');

        this.currentLevel;
        this.currentMusic;
        this.playerHP = INIT_PLAYERHP;
        this.money = INIT_MONEY;
        this.playerHPText;
        this.moneyText;
        this.levelText;
        this.priceTurret01 = 100;
        this.priceTurret02 = 300;
        this.priceTurret03 = 200;
        this.currentPCTurretToggle = null;
        this.cooldownR = 1;  // charge level percent between 0 and 1
        this.cooldownGraphicR;

        this.waveCount = INIT_WAVECOUNT;
        this.totalScore = 0;
        this.map;

        //this.cursors;

        this.nextEnemy = 0;

        this.canGetEnemy = false;
        this.isPlacingTurret = false;
        this.placementMap;
        this.cursor;
        this.cursorX;
        this.turretType;
        this.refund = 0;
        this.turretButtonArray = [];

        this.turret1 = 1;
        this.turret2 = 2;
        this.turret3 = 3;
        this.currentTurret;
    }

    //-------------------------------------------------------------------------
    create(data) {
        this.currentLevel = data.level || 1;

        switch (this.currentLevel) {
            case 1:
                this.map = this.createMap01();
                this.placementMap = placementMapConfig.grid1.map(arr => arr.slice());
                this.currentMusic = this.sound.add('level1Music', {loop: true});
                break;
            case 2:
                this.map = this.createMap02();
                this.placementMap = placementMapConfig.grid2.map(arr => arr.slice());
                this.currentMusic = this.sound.add('level2Music', {loop: true});
                break;
            case 3:
                this.map = this.createMap03();
                this.placementMap = placementMapConfig.grid3.map(arr => arr.slice());
                this.currentMusic = this.sound.add('level3Music', {loop: true});
                break;
            default:
                this.resetGameValues();
                this.scene.start('Title');
        }

        // Start background music
        this.currentMusic.play();

        // Add objects
        var mapObjectsList = this.map.getObjectLayer('gameObjects')['objects'];
        this.mapObjects = this.gameObjectsListToObject(mapObjectsList);

        // Player Controlled turrets
        this.pcTurret = new PCTurret(this, this.mapObjects.endPoint.x, this.mapObjects.endPoint.y);
        this.pcTurret.getBulletValues(50, 'bullet', 600, 2000, 20, false);

        // Add right UI bar and buttons
        this.createUI();

        // Add keyboard input events
        //this.cursors = this.input.keyboard.createCursorKeys();


        //Key command
        this.keyQ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        this.keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        //create Object
        this.createObjects();
        this.createCursor();

        // Add audio
        this.audioToggle = this.sound.add('toggle', {loop:false});

        // create camera
        this.cameras.main;

    }
    //-------------------------------------------------------------------------
    //-------------------------------------------------------------------------
    update(time, delta) {
        // If game is over, reset values and go to end scene
        if (this.playerHP <= 0) {
            this.resetGameValues(true);
            this.totalScore = 0;
            this.currentMusic.stop();
            this.scene.start('End');
        }

        // Level complete (wave 11 since we started at wave 1)
        if (this.getWaveCount() === INIT_MAXWAVECOUNT && this.currentWave.checkCompletion() === true)  {
            this.currentLevel++ ;
            this.totalScore += this.money;
            // Player won the game
            if (this.currentLevel == INIT_MAXLEVELS + 1) {
                console.log('Congratulations, You Won!');
                this.resetGameValues(true);
                this.currentMusic.stop();
                this.scene.start('Victory', {score: this.totalScore});
            }
            // Next level
            else {
                console.log('Begin level '+this.currentLevel);
                this.resetGameValues();
                this.currentMusic.stop();
                this.scene.start('Transition', {level: this.currentLevel, score: this.totalScore });
            }
        }

        this.pcTurret.update();
        // Check toggle keys for changes then set pcTurret bullets and audio
        this.toggleBulletControl();

        //Turret placement
        this.checkTurretPlacement();

        // Display updated ammo levels
        this.drawCooldown(1220, 320, this.cooldownGraphicR, this.pcTurret.getSlowAOETimerPercent());

        // Set wave count text
        this.waveText.setText("WAVE\n"+(this.waveCount - 1));
    }

    //-------------------------------------------------------------------------
    /* Other functions */
    createMap01() {
        const map = this.make.tilemap({key: 'map01'});
        map.addTilesetImage('Terrain', 'terrain');

        // Add layers (order matters!)
        map.createLayer('background', 'Terrain');
        map.createLayer('tileLayer01', 'Terrain');
        map.createLayer('tileLayer02', 'Terrain');
        map.createLayer('tileLayer03', 'Terrain');

        return map
    }

    createMap02() {
        const map = this.make.tilemap({key: 'map02'});
        map.addTilesetImage('Terrain', 'terrain');
        map.createLayer('background', 'Terrain');
        map.createLayer('tileLayer01', 'Terrain');
        map.createLayer('tileLayer02', 'Terrain');

        return map;
    }

    createMap03() {
        const map = this.make.tilemap({key: 'map03'});
        map.addTilesetImage('Terrain', 'terrain');
        map.createLayer('background', 'Terrain');
        map.createLayer('tileLayer01', 'Terrain');
        map.createLayer('tileLayer02', 'Terrain');
        map.createLayer('tileLayer03', 'Terrain');
        map.createLayer('tileLayer04', 'Terrain');

        return map;
    }

    // Converts the objects list in the game objects layer into a object
    // itself with object names as keys.
    // The purpose is to be able to access each game object by name instead of
    // by index.
    gameObjectsListToObject(list) {
        var dataObject = {};
        for (var i = 0; i < list.length; i++) {
            var objName = list[i]['name'];
            dataObject[objName] = list[i];
        }
        return dataObject;
    }

    // Set depth if not visible
    createUI() {

        var iconSide = 64;
        var iconMargin = 8;
        var UIMargin = 64;
        var col1X = 1148;
        var col2X = col1X + iconSide/2 + iconMargin;
        var col3X = col1X + iconSide + iconMargin;
        var header = 16;
        var textStyle = {
            fontSize: '32px',
            fontStyle: 'bold',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2
        };
        var smallTextStyle = {
            fontSize: '22px',
            fontStyle: 'bold',
            fill: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        }

        // Add right UI bar background
        this.add.graphics()
            .fillStyle(0x4b444c)
            .fillRoundedRect(1088, 0, 192, 704, {tl: 32, tr: 0, bl: 32, br: 0})
            .setDepth(1);
        // Add shop background
        this.add.graphics()
            .fillStyle(0x6f6970)
            .fillRoundedRect(1104, 32 + ((iconSide + iconMargin) * 2), 160, ((iconSide + iconMargin) * 5) + 8, 10)
            .setDepth(1);

        // Display player health, money, current level, shop text
        this.add.image(1128, UIMargin, 'towerHealth').setDepth(1);
        this.add.image(1128, UIMargin + iconSide + iconMargin, 'money').setDepth(1);
        this.playerHPText = this.add.text(1168, 48, (this.playerHP), textStyle).setDepth(1);
        this.moneyText = this.add.text(1168, 120, (this.money), textStyle).setDepth(1);
        this.add.text(1184, 32 + 16 + ((iconSide + iconMargin) * 2), 'Base Ammo', smallTextStyle).setOrigin(0.5).setDepth(1);
        this.add.text(1184, UIMargin + 8 + header +((iconSide + iconMargin) * 4), 'Buy Turrets', smallTextStyle).setOrigin(0.5).setDepth(1);
        this.levelText = this.add.text(1184, 660, ('Level ' + this.currentLevel), textStyle).setOrigin(0.5).setDepth(1);

        // Add toggle indicator for pcTurret
        this.QSprite = this.add.sprite(col1X, 32 + ((iconSide + iconMargin) * 3), 'pcTurret01').setDepth(1);
        this.WSprite = this.add.sprite(col3X, 32 + ((iconSide + iconMargin) * 3), 'pcTurret02').setDepth(1);
        this.ESprite = this.add.sprite(col1X, 32 + ((iconSide + iconMargin) * 4), 'pcTurret03').setDepth(1);
        this.RSprite = this.add.sprite(col3X, 32 + ((iconSide + iconMargin) * 4), 'pcTurret04').setDepth(1);
        this.WSprite.setTint(0x6b6b6b); // Q ammo type enabled first
        this.ESprite.setTint(0x6b6b6b); // Q ammo type enabled first
        this.RSprite.setTint(0x6b6b6b); // Q ammo type enabled first

        // Add pcTurret ammo level graphic
        this.cooldownGraphicR = this.add.graphics().setDepth(2);
        this.drawCooldown(col3X, 32 + ((iconSide + iconMargin) * 4), this.cooldownGraphicR, this.pcTurret.getSlowAOETimerPercent());

        // Add buyTurret buttons (more types with each level)
        this.buyTurret01 = this.createTurretButton(col1X, UIMargin + 8 +((iconSide + iconMargin) * 5), 'buyTurret01', this.priceTurret01, 'yellowStripedGun', 1);
        this.buyTurret02 = this.createTurretButton(col3X, UIMargin + 8 +((iconSide + iconMargin) * 5), 'buyTurret02', this.priceTurret02, 'flamethrowerTurret', 2);
        this.buyTurret03 = this.createTurretButton(col2X, UIMargin + 8 +((iconSide + iconMargin) * 6), 'buyTurret03', this.priceTurret03, 'sniperTurret', 3);
        this.turretButtonArray.push(this.buyTurret01, this.buyTurret02, this.buyTurret03);

        // Adjust position as need be. "Start Wave" button
        this.waveText = this.add.text(1184, 592, 'WAVE\n' + (this.waveCount - 1), smallTextStyle)
            .setOrigin(0.5)
            .setDepth(1); // sits behind the wave button
        this.waveButton = new WaveButton(this, 1184, 592, () => this.generateWave(), smallTextStyle);

        this.time.addEvent({ delay: 100, callback: () => (this.pcTurret.enable()), callbackScope: this });

    }

    // Create a button with the supplied sprite.
    // Receives x coordinate (int), y coordinate (int), image label (str), and
    // typeString which must match the turret sprite label in preload.js
    // Returns the button object
    createTurretButton(x, y, label, price, typeString, turretNumb) {
        var button = this.add.sprite(x, y, label).setDepth(1);
        var turret1 = 1;
        var turret2 = 2;
        var turret3 = 3;

        button.setInteractive();
        button.on('pointerup', () => {
            if(this.money >= price && this.isPlacingTurret == false)
            {
              if(turret1 == turretNumb)
              {
                this.currentTurret = 1;
                this.refund = price;
                this.isPlacingTurret = true;
                this.turretType = typeString;
                for (var i = 0; i < this.turretButtonArray.length; i++) {
                    if (this.turretButtonArray[i].texture.key != label) {
                        this.turretButtonArray[i].setTint(0x6b6b6b);
                    }
                }
              }
              else if(turret2 == turretNumb)
              {
                this.currentTurret = 2;
                this.refund = price;
                this.isPlacingTurret = true;
                this.turretType = typeString;
                for (var i = 0; i < this.turretButtonArray.length; i++) {
                    if (this.turretButtonArray[i].texture.key != label) {
                        this.turretButtonArray[i].setTint(0x6b6b6b);
                    }
                }
              }
              else if(turret3 == turretNumb)
              {
                this.currentTurret = 3;
                this.refund = price;
                this.isPlacingTurret = true;
                this.turretType = typeString;
                for (var i = 0; i < this.turretButtonArray.length; i++) {
                    if (this.turretButtonArray[i].texture.key != label) {
                        this.turretButtonArray[i].setTint(0x6b6b6b);
                    }
                }
              }

            }
        });
        button.on('pointerover', () => {button.setScale(1.05)}); // enlarge slightly on hover
        button.on('pointerout', () => {button.setScale(1)});

        return button;
    }

    // Currently used to test walking animations
    // Allow the player to move a sprite with directional keys. Sprite must
    // have walking animations created from walkingAnims.js
    walkingWithCursorKeys(playerSprite, labelString) {
        if (this.cursors.down.isDown) {
            playerSprite.setVelocityX(0);
            playerSprite.setVelocityY(160);
            playerSprite.anims.play(labelString+'WalkSouth', true);
        }
        else if (this.cursors.up.isDown) {
            playerSprite.setVelocityX(0);
            playerSprite.setVelocityY(-160);
            playerSprite.anims.play(labelString+'WalkNorth', true);
        }
        else if (this.cursors.left.isDown) {
            playerSprite.setVelocityY(0);
            playerSprite.setVelocityX(-160);
            playerSprite.anims.play(labelString+'WalkWest', true);
        }
        else if (this.cursors.right.isDown) {
            playerSprite.setVelocityY(0);
            playerSprite.setVelocityX(160);
            playerSprite.anims.play(labelString+'WalkEast', true);
        }
        else {
            playerSprite.setVelocityX(0);
            playerSprite.setVelocityY(0);
        }
    }

    enemyColliders() {
        this.physics.add.collider(this.currentWave, this.pcTurret.getBulletGroup(), this.goodHit, null, this);
        this.physics.add.collider(this.currentWave, this.bullets, this.goodHit, null, this);
        this.physics.add.collider(this.currentWave, this.pcTurret.getBase(), this.enemyWin, null, this);
        this.physics.add.collider(this.currentWave, this.pcTurret.getAOE01Group(), this.slowAOE, null, this);
    }

    enemyWin(enemy) {
        this.updatePlayerHP(enemy.value * -1);
        this.cameras.main.shake(150, 0.01);
        enemy.disable();
    }

    generateWave() {
        this.currentWave = new EnemyWave(this);
        this.currentWave.moveWave();
        this.waveButton.update();
        this.enemyColliders();
        this.canGetEnemy = true;
    }

    goodHit(enemy, bullet) {
        // console.log(bullet.bulletDamage());
        enemy.getHit(bullet.bulletDamage());

        if (enemy.getHP() > 0) {
            hitAnims(this.anims, "hitYellow")
            const hit = this.add.sprite(bullet.x, bullet.y, "hitYellow")
            hit.setScale(0.1);
            hit.play("hitYellow", true);
            hit.once('animationcomplete', () => {
                hit.destroy();
            })
        }

        bullet.isDestroy();

        if(bullet.bulletSlow())
        {
            // 1 is regular, > 1 fast, < 1 slow
            enemy.pathTween.setTimeScale(.25)
            enemy.setTint(0x3fa8cf);
            this.time.addEvent({ delay: 2500, callback: () => (enemy.pathTween.setTimeScale(1)), callbackScope: this });
            this.time.addEvent({ delay: 2500, callback: () => (enemy.getHit(0)), callbackScope: this });
        }

        if (enemy.getHP() <= 0) {
            this.updateMoney(enemy.value);
            enemy.disable();
        }
    }

    slowAOE(enemy, bullet) {
            enemy.pathTween.setTimeScale(.35)
            enemy.setTint(0x3fa8cf);
            this.time.addEvent({ delay: 5000, callback: () => (enemy.pathTween.setTimeScale(1)), callbackScope: this });
            this.time.addEvent({ delay: 5000, callback: () => (enemy.getHit(0)), callbackScope: this });
    }

    getCurrentLevel() {
        return this.currentLevel;
    }

    getMapObjects() {
        return this.mapObjects;
    }

    getWaveCount() {
        return this.waveCount;
    }

    updateWave() {
        this.waveCount += 1;
    }

    updateMoney(num) {
        this.money += num;
        this.moneyText.setText(this.money);
    }

    updatePlayerHP(num) {
        this.playerHP += num;
        this.playerHPText.setText(this.playerHP);
    }

    // Reset to level start
    resetGameValues(newGame=false) {
        if (newGame == true) {
            this.currentLevel = 1;
        }
        this.playerHP = INIT_PLAYERHP;
        this.money = INIT_MONEY;
        this.waveCount = INIT_WAVECOUNT;
        this.canGetEnemy = false;
        this.currentPCTurretToggle = null;
    }

    //Modified from https://academy.zenva.com/course/build-a-tower-defense-game-with-phaser-3/
    //Getter for enemy
    getEnemy(x, y, distance) {
        if(this.canGetEnemy){
            this.enemyUnits = this.currentWave.getChildren();
            for (const enemy of this.enemyUnits) {
                if (
                  enemy.active &&
                  Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y) <= distance
                ) {
                  return enemy;
                }
            }
            return false;
        }
        else
            return false;
    }

    //From https://academy.zenva.com/course/build-a-tower-defense-game-with-phaser-3/
    //objects
    createObjects() {
        this.enemies = this.physics.add.group({
            classType: Enemy,
            runChildUpdate: true
        });

        this.turrets = this.add.group({
            classType: Turret,
            runChildUpdate: true
        });

        this.bullets = this.physics.add.group({
            classType: TBullet,
            runChildUpdate: true
        });
    }

  //Modified from https://academy.zenva.com/course/build-a-tower-defense-game-with-phaser-3/
  //load bullet
  addBullet(x, y, angle, turretN, sprite) {
      this.bullet = new TBullet(this, x, y, sprite);
      this.bullet.getTBulletValues(turretN)
      this.bullets.add(this.bullet);
      this.bullet.fire(x, y, angle);
  }

// Turret Placement------------------------------------------------------------

  //Modified https://academy.zenva.com/course/build-a-tower-defense-game-with-phaser-3/
  //Cursor visual
    createCursor() {
        this.cursor = this.add.image(32, 32, "cursor");
        this.cursor.setScale(.8);
        this.cursorX = this.add.image(32, 32, "cursorX");
        this.cursorX.setScale(.125);
        this.disableCursorImage();
    }

    checkTurretPlacement() {
        if(this.isPlacingTurret == true){
            this.enableTurretPlacement();
        }
        //console.log(this.refund);
    }

    enableTurretPlacement() {
        this.pcTurret.disable();
        this.enableCursorImage();
        this.input.on('pointerdown', function (pointer) {
            // Place on left click
            if (pointer.leftButtonDown() && this.isPlacingTurret == true)
            {
                var i = Math.floor(pointer.y / 32);
                var j = Math.floor(pointer.x / 32);
                //console.log("valid_placement = "+this.valid_placement(i, j).toString());
                if (this.valid_placement(i, j)) {
                    this.isPlacingTurret = false;
                    this.placeTurret(i, j);
                    this.updateMoney(this.refund * -1);
                    this.refund = 0;
                    this.disableTurretPlacement();
                }
            }
            // Cancel on right click
            else if (pointer.rightButtonDown())
            {
                this.disableTurretPlacement();
            }
        }, this);
    }

    disableTurretPlacement() {
        this.input.on('pointerdown', function (pointer) {});
        this.isPlacingTurret = false;
        setTimeout(() => {this.pcTurret.enable();}, 500); // enable pcTurret after half second delay
        this.disableCursorImage();
        this.refund = 0;
        this.clearTurretIconTints();
    }

    enableCursorImage() {
        this.input.on("pointermove", pointer => {
            var i = Math.floor(pointer.y / 32);
            var j = Math.floor(pointer.x / 32);

            // invalid placement
            if (this.valid_placement(i, j) == false) {
            this.cursor.alpha = 0; // invisible red cursor
            this.cursorX.setPosition(j * 32+15 , i * 32+15);
            this.cursorX.alpha = .8; // visible black x
            }

            // valid placement
            else {
            this.cursorX.alpha = 0; // invisible black x
            this.cursor.setPosition(j * 32+15 , i * 32+15);
            this.cursor.alpha = .8;  // visible red cursor
            }

            // ?
            //else {this.cursor.alpha = 0;}
        });
    }

    disableCursorImage() {
        this.input.on("pointermove", pointer => {
            this.cursor.alpha = 0;
            this.cursorX.alpha = 0;
        });
    }

  //Modified from https://academy.zenva.com/course/build-a-tower-defense-game-with-phaser-3/
  //Turret placement
    placeTurret(i, j) {
        var turret;
        
        console.log(i.toString() + ", " + j.toString());
        console.log("curret turret = "+this.currentTurret.toString());
        switch (this.currentTurret) {
            // flamethrower
            case 2:
                turret = new Turret2(this, i, j, this.placementMap, this.turretType);
                turret.setTurretValues(100, 200);
                break;
            // sniper
            case 3:
                turret = new Turret3(this, i, j, this.placementMap, this.turretType);
                turret.setTurretValues(9000, 2000);
                break;
            // normal bullets
            default:
                turret = new Turret(this, i, j, this.placementMap, this.turretType);
                turret.setTurretValues(250, 750);
                break;
        }
        this.isTurret = true;
        this.turrets.add(turret);
        turret.setActive(true);
        turret.setVisible(true);
        turret.setScale(1.25);
        turret.place(i, j);
        this.placementMap[i][j] = 1;
    }

    //Modified https://academy.zenva.com/course/build-a-tower-defense-game-with-phaser-3/
    //check map for valid placement
    valid_placement(i, j) {
        if (this.placementMap[i][j] === 0){
            return true;
        }
        else {
            return false;
        }
    }

    clearTurretIconTints() {
        this.buyTurret01.clearTint();
        this.buyTurret02.clearTint();
        this.buyTurret03.clearTint();
    }
 //----------------------------------------------------------------------------

    drawCooldown(x, y, cooldownGraphic, cooldownPercent) {
        if (cooldownPercent == 1) {
            cooldownPercent = .99
        }
        var startRad = Phaser.Math.DegToRad(90);
        var endRad = Phaser.Math.DegToRad(90 + (360 * cooldownPercent));
        var color = 0xCD0000; // red

        cooldownGraphic.clear();
        cooldownGraphic.lineStyle(4, color, 1)
            .beginPath()
            .arc(x, y, 32, startRad, endRad, false)
            .strokePath()
            .setDepth(2);
    }

    toggleBulletControl() {
        if (this.keyQ.isDown || this.currentPCTurretToggle == null)
        {
           this.pcTurret.isItBullet(true);
           this.QSprite.clearTint();
           this.WSprite.setTint(0x6b6b6b);
           this.ESprite.setTint(0x6b6b6b);
           this.RSprite.setTint(0x6b6b6b);
           if (this.currentPCTurretToggle != 'Q') {
            this.audioToggle.play();
            this.pcTurret.setBulletAudio('normalBullet');
            this.currentPCTurretToggle = 'Q';
           }
           this.pcTurret.getBulletValues(50, 'bullet', 800, 2000, 20, false);
        }
        // Shoot flamethrower from pcTurret
        else if (this.keyW.isDown)
        {
            this.pcTurret.isItBullet(true);
            this.QSprite.setTint(0x6b6b6b);
            this.WSprite.clearTint();
            this.ESprite.setTint(0x6b6b6b);
            this.RSprite.setTint(0x6b6b6b);
            if (this.currentPCTurretToggle != 'W') {
                this.audioToggle.play();
                this.pcTurret.setBulletAudio('flamethrower');
                this.currentPCTurretToggle = 'W';
            }
            this.pcTurret.getBulletValues(15, 'fireBullet', 500, 375, 0.15, false);
        }
        // Shoot ice from pcTurret
        else if (this.keyE.isDown)
        {
            this.pcTurret.isItBullet(true);
            this.QSprite.setTint(0x6b6b6b);
            this.WSprite.setTint(0x6b6b6b);
            this.ESprite.clearTint();
            this.RSprite.setTint(0x6b6b6b);
            if (this.currentPCTurretToggle != 'E') {
                this.audioToggle.play();
                this.pcTurret.setBulletAudio('iceBullet');
                this.currentPCTurretToggle = 'E';
            }
            this.pcTurret.getBulletValues(10, 'iceBullet', 600, 2000, 5, true);
        }
        //creates a slow AOE at current position
        else if (this.keyR.isDown)
        {
            this.pcTurret.isItBullet(false);
            this.pcTurret.getAOEValues(true, false, false);
            this.QSprite.setTint(0x6b6b6b);
            this.WSprite.setTint(0x6b6b6b);
            this.ESprite.setTint(0x6b6b6b);
            this.RSprite.clearTint();
            if (this.currentPCTurretToggle != 'R') {
                this.audioToggle.play();
                this.pcTurret.setBulletAudio('poisonBullet');
                this.currentPCTurretToggle = 'R';
            }
        }
    }

}

export default Main;
