//Adapted from https://academy.zenva.com/course/build-a-tower-defense-game-with-phaser-3/
import placementMapConfig from "./configs/map.js";

//var TURRET_SPRITE = 'yellowStripedGun';
var RANGE;
var FIRE_RATE;
var timer = 0;

// typeString indicates the turret type (must match the sprite label in preload.js)
export default class Turret extends Phaser.GameObjects.Image {
  constructor(scene, x, y, map, typeString) {
    super(scene, x, y, typeString);
    this.map = map;
    this.nextTick = 0;
    // add the turret to the game
    this.scene.add.existing(this);
    this.setScale(-1); // negative flips the object
    this.depth = 100;
  }

  update(time, delta) {
    // time to shoot
    if (time > this.nextTick) {
      this.fire();
      this.nextTick = time + FIRE_RATE;
    }
  }

  place(i, j) {
    this.y = i * 32 + 32/2;
    this.x = j * 32 + 32/2;
  }

  fire() {
    const enemy = this.scene.getEnemy(this.x, this.y, RANGE);
    if (enemy.isMoving) {
      const angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
      this.scene.addBullet(this.x, this.y, angle, 3, 'beeBullet');
      this.angle = Phaser.Math.RadToDeg(angle + Math.PI / 2);
    }
  }

  setTurretValues(tRange, tFireRate)
  {
    RANGE = tRange;
    FIRE_RATE = tFireRate;
  }
}
