class Victory extends Phaser.Scene {
    constructor() {
        super('Victory');
    }

    create(data) {
        var textStyle = { 
            fontSize: '75px', 
            fontStyle: 'bold',
            color: '#000000',
            stroke: '#FFFFFF',
            strokeThickness: 2,
        };
        // Help from user yannick at
        // https://phaser.discourse.group/t/how-to-stretch-background-image-on-full-screen/1839
        let background = this.add.image(this.cameras.main.width / 2,  this.cameras.main.height / 2, 'sunnyBG').setOrigin(0.5);
        let scaleX = this.cameras.main.width / background.width;
        let scaleY = this.cameras.main.height / background.height;
        let scale = Math.max(scaleX, scaleY);
        background.setScale(scale).setScrollFactor(0);


        this.canvas = this.sys.game.canvas;
        const text = this.add.text(this.canvas.width / 2, this.canvas.height / 2, 'VICTORY!', textStyle).setOrigin(0.5);
        this.canvas = this.sys.game.canvas;
        this.sound.add("victory", {loop:false}).play();

        const subText = this.add.text(this.canvas.width / 2, this.canvas.height / 1.5, `TOTAL SCORE: ${data.score}`, {            
            fontSize: '50px', 
            fontStyle: 'bold',
            color: '#000000',
            stroke: '#FFFFFF',
            strokeThickness: 1}
        ).setOrigin(0.5);
    }
}

export default Victory