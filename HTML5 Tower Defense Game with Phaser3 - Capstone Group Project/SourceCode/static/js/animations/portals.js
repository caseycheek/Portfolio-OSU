export default (anims, label) => {
    anims.create({
        key: 'idle',
        frames: anims.generateFrameNumbers('purplePortal', { start: 0, end: 7 }),
        frameRate: 8,
        repeat: 0,
    });
    anims.create({
        key: 'disappear',
        frames: anims.generateFrameNumbers('purplePortal', { start: 15, end: 23 }),
        frameRate: 8,
        repeat: 0,
        hideOnComplete: true
    });

    anims.create({
        key: 'start',
        frames: anims.generateFrameNumbers('purplePortal', { start: 8, end: 15 }),
        frameRate: 8,
        repeat: 0,
        showOnStart: true,
    });
}
