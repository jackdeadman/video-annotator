import ffmpeg from 'ffmpeg'
import fs from 'fs'
import { promisify } from 'util'
import path from 'path';

const { readdir, unlink } = {
    readdir: promisify(fs.readdir),
    unlink: promisify(fs.unlink),
}

export async function emptyDir(dir, ext) {
    const files = await readdir(dir);
    await Promise.all(files.map(f => {
        if (f.endsWith(ext)) {
            unlink(path.join(dir, f));
        }
    }));
}

const parseVideoPath = function(videoPath) {
    const filename = path.basename(videoPath);
    const [ scene, camera ] = filename.split('.')[0].split('_');
    return { scene, camera };
};

export async function extractFrames(videoPath, amount, outputDir) {
    console.log(videoPath, amount, outputDir)
    const ext = '.jpg';

    // Want to change the behaviour such that no frames are
    // Shown when 0 is chosen, rather than them all.
    if (amount === 0) amount = -1;

    const video = await new ffmpeg(videoPath);
    
    // Remove all the images in the directory
    await emptyDir(outputDir, ext);

    const frameFiles = await video.fnExtractFrameToJPG(outputDir, {
        number: amount
    });
    
    return frameFiles.filter(f => f.endsWith(ext));
}
