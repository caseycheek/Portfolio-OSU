//Adapted from https://academy.zenva.com/course/build-a-tower-defense-game-with-phaser-3/
var turretN;


export default class TBullet extends Phaser.GameObjects.Image {
  constructor(scene, x, y, sprite) {
    //super(scene, x, y, "beeBullet");
    super(scene, x, y, sprite);
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.dx = 0;
    this.dy = 0;
    this.lifespan = 0;
    //this.speed = Phaser.Math.GetSpeed(600, 1);
    this.speed = .15;
    this.pierce = false;

    // add the bullet to our game
    this.scene.add.existing(this);
  }



  update(time, delta) {
    if (this.x >= 1072 || this.x <= 16 || this.y >= 688 || this.y <= 16) {
      this.lifespan = 0;
    }

    if(turretN == 1){
      this.lifespan -= delta;
      this.x += this.dx * (0.35 * delta);
      this.y += this.dy * (0.35 * delta);
      if (this.lifespan <= 0) {
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
      }
    }
    if(turretN == 2){
      this.lifespan -= delta;
      this.x += this.dx * (0.35 * delta);
      this.y += this.dy * (0.35 * delta);
      if (this.lifespan <= 0) {
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
      }
    }
    if(turretN == 3){
      this.lifespan -= delta;
      this.x += this.dx * (1 * delta);
      this.y += this.dy * (1 * delta);
      this.pierce = true;
      if (this.lifespan <= 0) {
        this.setActive(false);
        this.setVisible(false);
        this.destroy();
      }
    }
  }

  fire(x, y, angle) {
    if(turretN == 1){
      this.damage = 50;
      this.speed = Phaser.Math.GetSpeed(1);
      this.setActive(true);
      this.setVisible(true);
      this.dx = Math.cos(angle);
      this.dy = Math.sin(angle);
      this.lifespan = 1500;
    }
    else if(turretN == 2){
      this.damage = 5;
      this.speed = Phaser.Math.GetSpeed(1);
      this.setActive(true);
      this.setVisible(true);
      this.dx = Math.cos(angle);
      this.dy = Math.sin(angle);
      this.lifespan = 100;
    }
    else if(turretN == 3){
      this.damage = 150;
      this.speed = Phaser.Math.GetSpeed(1);
      this.setActive(true);
      this.setVisible(true);
      this.dx = Math.cos(angle);
      this.dy = Math.sin(angle);
      this.lifespan = 3000;
    }
  }

  bulletDamage()
  {
      return this.damage;
  }

  bulletSlow()
  {
      return this.isSlow;
  }

  getTBulletValues(t){
    turretN = t;
  }

  isDestroy(){
    if(!this.pierce){
      this.destroy();
    }
    else if(this.pierce && this.damage >= 50){
      this.damage -= 50;
    }
  }


}
