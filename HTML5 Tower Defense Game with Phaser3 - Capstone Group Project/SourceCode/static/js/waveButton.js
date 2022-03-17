// Adapted from https://www.webtips.dev/webtips/phaser/interactive-buttons-in-phaser3

// Casey's example - feel free to change style/other. Todo: refactor
export default class WaveButton {
    constructor(scene, x, y, callback, textStyle) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        this.callback = callback;
        this.textStyle = textStyle;
        this.label = `START\nWAVE\n${this.scene.waveCount}`;
        this.button = this.create()

    }

    create() {
        const button = this.scene.add.text(this.x, this.y, this.label, this.textStyle)
            .setOrigin(0.5)
            .setPadding(5)
            .setStyle({ backgroundColor: '#CD0000', fontStyle: 'bold'})
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => {
                this.scene.updateWave()
                this.callback()
                // this.button.disableInteractive();
            })
            // .on('pointerup', () => {button.visible = false})
            .on('pointerover', () => button.setStyle({ fill: '#f39c12' }))
            .on('pointerout', () => {button.setStyle({ fill: '#FFF' })})
            .setDepth(2);

        return button;
    }

    disable() {
        this.button.visible = false;
    }

    enable() {
        this.button.visible = true;
    }



    update() {
        this.label = `START\nWAVE\n${this.scene.waveCount}`;
        if (this.scene.waveCount === 10) {
            this.button.setText('LAST\nWAVE\n');
        } else if (this.scene.waveCount > 10) {
            this.button.disableInteractive();
            this.button.visible = false;
        } else {
            this.button.setText(this.label);
        }
    }


}