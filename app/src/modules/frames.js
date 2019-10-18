import ffmpeg from 'ffmpeg'
import fs, { read } from 'fs'
import { promisify } from 'util'
import path from 'path'
import { exec as execOld} from 'child_process';
import { times } from '../utils';

const EXT = '.jpg';

const { readdir, unlink, exec } = {
    readdir: promisify(fs.readdir),
    unlink: promisify(fs.unlink),
    exec: promisify(execOld),
}

const frameNumber = file => {
    const parts = file.split('_');
    const end = parts[parts.length-1];
    const number = end.split('.')[0];
    return parseInt(number);
};

const onlyImages = files => files.filter(f => f.endsWith(EXT));
const ordered = files => files.sort((a, b) => frameNumber(a) - frameNumber(b) );

export async function emptyDir(dir) {
    const files = onlyImages(await readdir(dir));

    await Promise.all(files.map(f => {
        unlink(path.join(dir, f));
    }));
}

export async function loadFrames(outputDir) {
    const files = await readdir(path.dirname(outputDir));
    return ordered(onlyImages(files));
}

const listImageFiles = async dir => {
    const files = await readdir(dir);
    const filesFull = files.map(f => path.join(dir, f));
    const normalised = ordered(onlyImages(filesFull));
    return normalised;
};

const parseImagePath = path => {
    const parts = path.split('/');
    const filename = parts[parts.length - 1].split('.')[0];
    const [ scene, camera, number ] = filename.split('_');
    return {
        src: path,
        scene, camera, number
    };
}

const generateImageFiles = async function(video, output, sampleRate) {

    // ffmpeg -i <video> -vf fps=1/0.5 ample-project/frames/S20/U01/S20_U01_%d.jpg
    // const timingUnit = 1 / options.fps;
    const pattern = path.join(output, '{frame}.png');

    // const cmd = `ffmpeg -i ${video} -vf fps=1/${everyN} ${pattern}`;
    // const cmd = `ffmpeg -i ${video} -vf "select=not(mod(n\\,${options.spacing}))" -vsync vfr -q:v 2 -vframes ${options.amount} ${pattern}`
    const cmd = `extract_frames --video ${video} --output ${pattern} --sample_rate ${sampleRate}`
    // const cmd = `ffmpeg -i ${video} -vf fps=1/${everyN} -r 1 -vframes ${options.amount} ${pattern}`;
    await exec(cmd)
    // await renameImages(outputDir, )
};

export async function extractFrames(videoPath, sampleRate, outputDir) {
    // await emptyDir(outputDir);

    try {
        await generateImageFiles(videoPath, outputDir, sampleRate);
    } catch(e) {
        return [];
    }

    const files = await listImageFiles(outputDir);
    return files.map(parseImagePath);
};

export async function extractFramesOld(videoPath, amount, spacing, outputDir) {
    // Want to change the behaviour such that no frames are
    // Shown when 0 is chosen, rather than them all.
    if (amount === 0) amount = -1;

    const video = await new ffmpeg(videoPath);
    
    // Remove all the images in the directory
    await emptyDir(outputDir, onlyImages);

    const frameFiles = await video.fnExtractFrameToJPG(outputDir, {
        number: amount,
        frame_rate: 20,
    });

    // The ffmpeg api returns all the files/directories in the directory and
    // not just the created images.
    return ordered(onlyImages(frameFiles));
}
