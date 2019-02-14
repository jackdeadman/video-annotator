import ffmpeg from 'ffmpeg'
import fs from 'fs'
import { promisify } from 'util'
import path from 'path';

const { readdir, unlink } = {
    readdir: promisify(fs.readdir),
    unlink: promisify(fs.unlink),
}

export async function emptyDir(dir) {
    const files = await readdir(dir);
    await Promise.all(files.map(f => unlink(path.join(dir, f))));
}

export async function extractFrames(videoPath, amount) {

    // Want to change the behaviour such that no frames are
    // Shown when 0 is chosen, rather than them all.
    if (amount === 0) amount = -1;

    const video = await new ffmpeg(videoPath);
    
    const outputDir = path.join(videoPath, '../../frames');
    await emptyDir(outputDir);

    const frameFiles = await video.fnExtractFrameToJPG(outputDir, {
        number: amount
    });
    
    return frameFiles;
}
