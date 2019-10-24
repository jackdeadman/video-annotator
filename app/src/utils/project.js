import { exec as execOld} from 'child_process';
import { promisify } from 'util'

const exec = promisify(execOld)

export const createSpeakerPicture = async function({
        project, speaker, picture, annotation
    }) {

    const args = [
        project,
        picture,
        speaker.id,
        Math.round(annotation.start.x * 1920),
        Math.round(annotation.start.y * 1080),
        Math.round(annotation.end.x * 1920),
        Math.round(annotation.end.y * 1080),
    ];

    const res = await exec("save_photo '" + args.join("' '") + "'");
    return res.trim()
};