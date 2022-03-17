export default (anims, label) => {

    let frames;
    let repeatAmount;
    let rate;

    if (label === 'smoke') {
        frames = {start: 0, end: 35}
        repeatAmount = 3
        rate = 32
    } else if (label === 'star') {
        frames = {start: 0, end: 3}
        repeatAmount = 0
        rate = 32
    }  else if (label === 'greenSmoke') {
        frames = {start: 0, end: 35}
        repeatAmount = 0
        rate = 32
    }


    anims.create({
        key: label,
        frames: anims.generateFrameNumbers(label, frames),
        frameRate: rate,
        repeat: repeatAmount,
        hideOnComplete: true
    });
}