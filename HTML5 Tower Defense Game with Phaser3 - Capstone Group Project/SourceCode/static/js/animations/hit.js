export default (anims, label) => {
    anims.create({
        key: label,
        frames: anims.generateFrameNumbers(label, { start: 0, end: 15 }),
        frameRate: 16,
        repeat: 0,
        hideOnComplete: true
    });
}