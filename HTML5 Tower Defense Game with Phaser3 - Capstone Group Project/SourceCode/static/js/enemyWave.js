import EnemyOne from './enemies/enemy01.js';
import EnemyTwo from "./enemies/enemy02.js";
import EnemyThree from "./enemies/enemy03.js";
import EnemyFour from "./enemies/enemy04.js";
import EnemyFive from "./enemies/enemy05.js";
import EnemySix from "./enemies/enemy06.js";
import EnemySeven from './enemies/enemy07.js';

import MapPaths from "./configs/mapPaths.js";

export default class EnemyWave extends Phaser.GameObjects.Group {
    constructor(scene) {
        super(scene);

        scene.add.existing(this);
        // scene.physics.add.existing(this);

        this.currentLevel = this.scene.getCurrentLevel();
        this.waveCount = this.scene.getWaveCount();
        this.mapObjects = this.scene.getMapObjects();

        this.numberOfEnemies = 4 + (2 * this.waveCount);
        // this.numberOfEnemies = 4;

        // Used for enemy spawn odds
        this.enemyArray = [EnemyOne, EnemyTwo, EnemyThree, EnemyFour, EnemyFive, EnemySix, EnemySeven];

        // this.enemyArray = [EnemyFive, EnemyFive, EnemyFive, EnemyFive, EnemyFive, EnemyFive];

        this.odds = [0, 0, 0, 0, 0, 0, 0];

        this.paths = this.createEnemyPaths();
        this.spawnCreation = this.spawnPaths();
        this.createEnemies();
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        // Deletes wave and children if every enemy is inactive
        if (this.checkCompletion() === true) {
            this.clear(true, true);
            return;
        }
        
    }

    checkCompletion() {
        for (let i = 0; i < this.children.entries.length; i++) {
            if (this.children.entries[i].active === true) {
                this.scene.waveButton.disable();
                this.scene.pcTurret.enable();
                return false;
            }
        }
        this.scene.waveButton.enable();
        this.scene.pcTurret.disable();
        // this.endPortals();
        return true;
    }

    createEnemies() {
        const enemies = [];
        this.updateOdds();

        const distribution = this.createDistribution(this.enemyArray, this.odds, 1);
        for (let i = 0; i < this.numberOfEnemies; i++) {

            // From: https://thewebdev.info/2021/06/03/how-to-pick-a-random-property-from-a-javascript-object/
            // Get random spawn point
            const keys = Object.keys(this.spawnCreation);
            const randomSpawn = keys[Math.floor(Math.random() * keys.length)];

            const spawn = this.mapObjects[`${randomSpawn}`];

            // Set random path from selected spawn point
            const getPaths = this.spawnCreation[randomSpawn];
            const randomPath = Math.floor(Math.random() * this.spawnCreation[randomSpawn].length);

            // Create distribution and random enemy
            const index = this.randomIndex(distribution);
            const enemy = this.enemyArray[index];

            // Add to group
            enemies.push(new enemy(this.scene, getPaths[randomPath], spawn.x, spawn.y));
        }
        super.addMultiple(enemies);
    }

    createEnemyPaths() {
        // Add buffer to "hide" enemy group
        switch (this.currentLevel) {
            case 1:
                const map1_path1 = this.createPath(this.mapObjects.spawnPoint01.x + 40, this.mapObjects.spawnPoint01.y, MapPaths.map1.path1.xCoords, MapPaths.map1.path1.yCoords, this.mapObjects.endPoint);

                const map1_path2 = this.createPath(this.mapObjects.spawnPoint01.x + 40, this.mapObjects.spawnPoint01.y, MapPaths.map1.path2.xCoords, MapPaths.map1.path2.yCoords, this.mapObjects.endPoint);

                return [map1_path1, map1_path2];

            case 2:
                const map2_path1 = this.createPath(this.mapObjects.spawnPoint01.x - 40, this.mapObjects.spawnPoint01.y,MapPaths.map2.path1.xCoords, MapPaths.map2.path1.yCoords, this.mapObjects.endPoint);

                const map2_path2 = this.createPath(this.mapObjects.spawnPoint02.x, this.mapObjects.spawnPoint02.y - 40, MapPaths.map2.path2.xCoords, MapPaths.map2.path2.yCoords, this.mapObjects.endPoint);

                const map2_path3 = this.createPath(this.mapObjects.spawnPoint03.x, this.mapObjects.spawnPoint03.y - 40, MapPaths.map2.path3.xCoords, MapPaths.map2.path3.yCoords, this.mapObjects.endPoint);

                const map2_path4 = this.createPath(this.mapObjects.spawnPoint04.x, this.mapObjects.spawnPoint04.y + 40, MapPaths.map2.path4.xCoords, MapPaths.map2.path4.yCoords, this.mapObjects.endPoint);

                return [map2_path1, map2_path2, map2_path3, map2_path4];
                
            case 3:
                const map3_path1 = this.createPath(this.mapObjects.spawnPoint01.x - 40, this.mapObjects.spawnPoint01.y - 40,MapPaths.map3.path1.xCoords, MapPaths.map3.path1.yCoords, this.mapObjects.endPoint);

                const map3_path2 = this.createPath(this.mapObjects.spawnPoint02.x, this.mapObjects.spawnPoint02.y - 40, MapPaths.map3.path2.xCoords, MapPaths.map3.path2.yCoords, this.mapObjects.endPoint);

                const map3_path3 = this.createPath(this.mapObjects.spawnPoint03.x, this.mapObjects.spawnPoint03.y + 40, MapPaths.map3.path3.xCoords, MapPaths.map3.path3.yCoords, this.mapObjects.endPoint);

                const map3_path4 = this.createPath(this.mapObjects.spawnPoint04.x - 40, this.mapObjects.spawnPoint04.y, MapPaths.map3.path4.xCoords, MapPaths.map3.path4.yCoords, this.mapObjects.endPoint);

                return [map3_path1, map3_path2, map3_path3, map3_path4];
            default:
                return;
        }

    }

    createPath(originX, originY, xCoords, yCoords, end) {
        const tileSize = 32;

        const path = new Phaser.Curves.Path(originX, originY);

        for (let i = 1; i < xCoords.length; i++) {
            path.lineTo(xCoords[i] * tileSize, yCoords[i] * tileSize);
        }

        //  Create end property for sprite termination
        path.end = {x: end.x, y: end.y};

        // Draw opaque path line, comment out to get rid of visual path
        // const pathLine = this.scene.add.graphics();
        // pathLine.lineStyle(32, 0xffffff, .5);
        // path.draw(pathLine, 64);
        // pathLine.fillStyle(0x00ff00, 32);

        return path;
    }

    moveWave() {
        this.startWave();
    }  

    startWave() {
        for (let i = 0; i < this.children.entries.length; i++) {
            let enemy = this.children.entries[i];
            enemy.start(i);
        };
    }

    // Credit to: https://dirask.com/posts/JavaScript-random-values-from-array-with-probability-different-probability-per-item-D7Z0w1
    createDistribution(array, weights, size) {
        const distribution = [];
        const sum = weights.reduce((a, b) => a + b);
          for (let i = 0; i < array.length; ++i) {
              const count = (weights[i] / sum) * size;
              for (let j = 0; j < count; ++j) {
                  distribution.push(i);
            }
        }
          return distribution;
    };

    // Credit to: https://dirask.com/posts/JavaScript-random-values-from-array-with-probability-different-probability-per-item-D7Z0w1
    randomIndex(distribution) {
          const index = Math.floor(distribution.length * Math.random());  // random index
        return distribution[index];  
    };

    spawnPaths() {
        switch (this.currentLevel) {
            case 1:
                return {'spawnPoint01': this.paths};
            case 2:
                return {'spawnPoint01': [this.paths[0]],
                        'spawnPoint02': [this.paths[1]],
                        'spawnPoint03': [this.paths[2]],
                        'spawnPoint04': [this.paths[3]]
                        };
            case 3:
                return {'spawnPoint01': [this.paths[0]],
                        'spawnPoint02': [this.paths[1]],
                        'spawnPoint03': [this.paths[2]],
                        'spawnPoint04': [this.paths[3]]
                        };
            default:
                // Error handler
                return;
        }

    }
    // Odds of enemy spawn chance, see enemy array above
    updateOdds() {
        switch (this.waveCount) {
            case 2:
                this.odds[0] = 1;              
                return;
            case 3:
                this.odds[0] = .75;
                this.odds[1] = .25;
                return;
            case 4:
                this.odds[0] = .50;
                this.odds[1] = .40;
                this.odds[2] = .10;

                return;
            case 5:
                this.odds[0] = .40;
                this.odds[1] = .45;
                this.odds[2] = .10;
                this.odds[3] = .05;
                return;
            case 6:
                this.odds[0] = .35;
                this.odds[1] = .45;
                this.odds[2] = .10;
                this.odds[3] = .10;
                return;
            case 7:
                this.odds[0] = .35;
                this.odds[1] = .45;
                this.odds[2] = .20;
                this.odds[3] = .15;
                this.odds[4] = .05;
                return;            
            case 8:
                this.odds[0] = .25;
                this.odds[1] = .3;
                this.odds[2] = .15;
                this.odds[3] = .15;
                this.odds[4] = .1;
                this.odds[5] = .05;
                return;
            case 9:
                this.odds[0] = .20;
                this.odds[1] = .30;
                this.odds[2] = .15;
                this.odds[3] = .15;
                this.odds[4] = .1;
                this.odds[5] = .1;
                return;
            case 10:
                this.odds[0] = .15;
                this.odds[1] = .15;
                this.odds[2] = .15;
                this.odds[3] = .15;
                this.odds[4] = .15;
                this.odds[5] = .1;
                this.odds[6] = .05;
                return;
            case 11:
                this.odds[0] = .15;
                this.odds[1] = .20;
                this.odds[2] = .15;
                this.odds[3] = .15;
                this.odds[4] = .15;
                this.odds[5] = .1;
                this.odds[6] = .1;
                return;
            default:
                return;
        }

    }
}
