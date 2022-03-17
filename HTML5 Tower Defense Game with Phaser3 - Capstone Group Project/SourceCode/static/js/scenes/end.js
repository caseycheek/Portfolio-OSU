class End extends Phaser.Scene {
    constructor() {
        super('End');
    }

    create() {
        var textStyle = { 
            fontSize: '75px', 
            fontStyle: 'bold',
            color: '#FFFFFF',
            stroke: '#000000',
            strokeThickness: 2,
        };

        this.canvas = this.sys.game.canvas;
        const text = this.add.text(this.canvas.width / 2, this.canvas.height / 2, 'GAME OVER', textStyle).setOrigin(0.5);
        this.sound.add("gameOver", {loop:false}).play();

        const restartButton = this.add.text(this.canvas.width / 2, this.canvas.height / 1.75, 'CLICK TO RESTART', {fontSize: '35px'}).setOrigin(0.5);
        restartButton.setPadding(10)
        .setInteractive({ useHandCursor: true })
        .on('pointerdown', () => {
            this.scene.start('Title');
        })
    }
}

export default End;