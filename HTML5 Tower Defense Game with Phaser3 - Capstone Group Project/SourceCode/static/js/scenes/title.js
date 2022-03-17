
class Title extends Phaser.Scene {
    constructor() {
        super('Title');
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
        let level = 1;

        // Help from user yannick at
        // https://phaser.discourse.group/t/how-to-stretch-background-image-on-full-screen/1839
        let background = this.add.image(this.cameras.main.width / 2,  this.cameras.main.height / 2, 'titleBG').setOrigin(0.5);
        let scaleX = this.cameras.main.width / background.width;
        let scaleY = this.cameras.main.height / background.height;
        let scale = Math.max(scaleX, scaleY);
        background.setScale(scale).setScrollFactor(0);

        this.theme = this.sound.add("gameStart", {loop:true})
        this.theme.play();

        const text1 = this.add.text(this.canvas.width / 2 , this.canvas.height / 3, 'DEFENSE', textStyle).setOrigin(0.5);
        const turtle1 = this.add.image((this.canvas.width / 2) + 175, (this.canvas.height / 3) + 50, 'turtleShell')
        turtle1.setScale(0.15);

        const turtle2 = this.add.image((this.canvas.width / 2) - 175, (this.canvas.height / 3) + 50 , 'turtleShell')
        turtle2.setScale(0.15);

        const text2 = this.add.text(this.canvas.width / 2, this.canvas.height / 2.5, 'OF THE', { 
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

        const playButton = this.add.text(this.canvas.width / 2, this.canvas.height / 1.5, 'PLAY', 
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
            this.theme.stop();
            this.scene.start('Main', {level: level});
        })

        // Help from: https://rexrainbow.github.io/phaser3-rex-notes/docs/site/domelement/ and https://www.emanueleferonato.com/2020/12/24/add-bootstrap-component-to-your-html5-games-powered-by-phaser-thanks-to-its-dom-support/
        let difficulty = this.add.dom(this.canvas.width / 2, this.canvas.height / 1.75).createFromCache("difficulty").setOrigin(0.5);

        difficulty.addListener("click");

        difficulty.on("click", function(e) {
            switch(e.target.id) {
                case "easy": 
                    level = 1;
                    break;
                case "medium":
                    level = 2;
                    break;
                case "hard":
                    level = 3;
                    break;
                default:
                    level = 1           
            }
        }, this);

    }
}

export default Title;