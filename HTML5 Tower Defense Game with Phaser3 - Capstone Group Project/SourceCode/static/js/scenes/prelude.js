
class Prelude extends Phaser.Scene {
    constructor() {
        super('Prelude');
    }

    create() {
        var textStyle = { 
            fontSize: '55px', 
            fontStyle: 'bold',
            color: '#000000',
            stroke: '#FFFFFF',
            strokeThickness: 3,
        };

        this.canvas = this.sys.game.canvas;

        // Help from user yannick at
        // https://phaser.discourse.group/t/how-to-stretch-background-image-on-full-screen/1839
        let background = this.add.image(this.cameras.main.width / 2,  this.cameras.main.height / 2, 'titleBG').setOrigin(0.5);
        let scaleX = this.cameras.main.width / background.width;
        let scaleY = this.cameras.main.height / background.height;
        let scale = Math.max(scaleX, scaleY);
        background.setScale(scale).setScrollFactor(0);

        const text1 = this.add.text(this.canvas.width / 2, this.canvas.height / 3, 'DEFENSE', textStyle).setOrigin(0.5);
        const turtle1 = this.add.image((this.canvas.width / 2) + 175, (this.canvas.height / 3) + 50, 'turtleShell')
        turtle1.setScale(0.15);

        const turtle2 = this.add.image((this.canvas.width / 2) - 175, (this.canvas.height / 3) + 50 , 'turtleShell')
        turtle2.setScale(0.15);

        const text2 = this.add.text(this.canvas.width / 2 , this.canvas.height / 2.5, 'OF THE', { 
            fontSize: '35px', 
            fontStyle: 'bold',
            color: '#000000',
            stroke: '#FFFFFF',
            strokeThickness: 2,
        }).setOrigin(0.5);


        const text3 = this.add.text(this.canvas.width / 2, this.canvas.height / 2.15, 'TURTLE ARMY', {fontSize: '40px', 
        fontStyle: 'bold',
        color: '#000000',
        stroke: '#FFFFFF',
        strokeThickness: 2,}).setOrigin(0.5);

        const playButton = this.add.text(this.canvas.width / 2, this.canvas.height / 1.5, 'CLICK TO START', 
        {
            fontSize: '25px', 
            fontStyle: 'bold',
            color: '#000000',
            stroke: '#FFFFFF',
            strokeThickness: 3,}).
            setOrigin(0.5);

        playButton.setPadding(10)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.scene.start('Title');
        })
    }
}

export default Prelude;