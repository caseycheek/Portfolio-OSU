export default (anims, label) => {
    anims.create({
        key: label,
        frames: anims.generateFrameNumbers(label, { start: 0, end: 4 }),
        frameRate: 8,
        repeat: 0,
        hideOnComplete: true
    });
}