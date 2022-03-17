// Create walking animations. 
// Must use a 4x4 spritesheet based on this template:
//  [0, 1, 2, 3]  <-- facing south, key: label+'WalkSouth'
//  [4, 5, 6, 7]  <-- facing north, key: label+'WalkNorth'
//  [8, 9, 10, 11]  <-- facing west, key: label+'WalkWest'
//  [12, 13, 14, 15]  <-- facing east, key: label+'WalkEast' 

export default (anims, label) => {

    let directions = null;
    // Alien spritesheet
    if (label === 'greenAlien' || label === 'pinkAlien') {
        directions = {
            "south": { start: 0, end: 3 },
            "north": { start: 4, end: 7 },
            "west": { start: 8, end: 11 },
            "east": { start: 12, end: 15 }
        }
    // Minimare spritesheets
    } else if (label === 'mareBlack' || label === 'mareViolet' || label === 'marePurple') {
        directions = {
            "south": { start: 6, end: 8 },
            "north": { start: 0, end: 2 },
            "west": { start: 9, end: 11 },
            "east": { start: 3, end: 5 }
        }
    // Robot spritesheets
    } else {
        directions = {
        "south": { start: 0, end: 2 },
        "north": { start: 9, end: 11 },
        "west": { start: 3, end: 5 },
        "east": { start: 6, end: 8 }
        }
    }
    anims.create({
        key: label+'WalkSouth',
        frames: anims.generateFrameNumbers(label, directions.south),
        frameRate: 8,
        repeat: -1
    });

    anims.create({
        key: label+'WalkNorth',
        frames: anims.generateFrameNumbers(label, directions.north),
        frameRate: 8,
        repeat: -1
    });

    anims.create({
        key: label+'WalkWest',
        frames: anims.generateFrameNumbers(label, directions.west),
        frameRate: 8,
        repeat: -1
    });

    anims.create({
        key: label+'WalkEast',
        frames: anims.generateFrameNumbers(label, directions.east),
        frameRate: 8,
        repeat: -1
    });
}
