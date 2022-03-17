class Transition extends Phaser.Scene {
    constructor() {
        super('Transition');
    }

    create(data) {
        var textStyle = { 
            fontSize: '75px', 
            fontStyle: 'bold',
            color: '#000000',
            stroke: '#FFFFFF',
            strokeThickness: 2,
        };

        this.sound.add("complete", {loop:false}).play();

        if (data.level === 2) {
            this.bg = 'snowBG'
        } else {
            this.bg = 'desertBG'
        }

        // Help from user yannick at
        // https://phaser.discourse.group/t/how-to-stretch-background-image-on-full-screen/1839
        let background = this.add.image(this.cameras.main.width / 2,  this.cameras.main.height / 2, this.bg).setOrigin(0.5);
        let scaleX = this.cameras.main.width / background.width;
        let scaleY = this.cameras.main.height / background.height;
        let scale = Math.max(scaleX, scaleY);
        background.setScale(scale).setScrollFactor(0);


        this.canvas = this.sys.game.canvas;

        const subText = this.add.text(this.canvas.width / 2, this.canvas.height / 2.5, `LEVEL ${data.level - 1} COMPLETE`, textStyle).setOrigin(0.5);

        const subText2 = this.add.text(this.canvas.width / 2, this.canvas.height / 2, `CURRENT SCORE: ${data.score}`, { 
            fontSize: '50px', 
            fontStyle: 'bold',
            color: '#000000',
            stroke: '#FFFFFF',
            strokeThickness: 2,
        }).setOrigin(0.5);

        const continueButton = this.add.text(this.canvas.width / 2, this.canvas.height / 1.5, 'CLICK TO CONTINUE', {
            fontSize: '35px',
            fontStyle: 'bold',
            color: '#000000',
            stroke: '#FFFFFF',
            strokeThickness: 2,
        }).setOrigin(0.5);
        continueButton.setPadding(10)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            const newLevel = data.level;
            console.log(newLevel);
            this.scene.start('Main', {level: newLevel});
        })

    }
}

export default Transition