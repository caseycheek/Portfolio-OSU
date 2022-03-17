import phaserJuice from "./phaserJuicePlugin.min.js";
import Main from './scenes/main.js';
import Preload from './scenes/preload.js';
import Prelude from "./scenes/prelude.js";
import Title from './scenes/title.js';
import Transition from './scenes/transition.js';
import End from './scenes/end.js';
import Victory from './scenes/victory.js';

const config = {
  	type: Phaser.AUTO,
  	width: 1280,
  	height: 704,
  	scale: {
	  	mode: Phaser.Scale.FIT,
	  	autoCenter: Phaser.Scale.CENTER_BOTH,
		parent: "game"
  	},
  	physics: {
    	default: 'arcade',
    	arcade: {
      		debug: false, // True enables pink boxes around sprites
    	}
  	},
	dom: {
		createContainer: true
	},
	plugins: {
		scene: [
			{ key: 'phaserJuice', plugin: phaserJuice, mapping: 'juice' }
		]
	},
	scene: [ new Preload(), new Prelude(), new Title(), new Main(), new End(), new Victory(), new Transition()]
}
new Phaser.Game(config);
