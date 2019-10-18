import { linspace } from '../utils';

class VideoProcess {

    constructor(videoPath) {
        this.frames = 1000;
    }

    generateFrames(amount, amount) {
        linspace(start, this.frames, amount).forEach(frame => {
            const rounded = Math.round(frame);
        });
    }

}

export default VideoProcess;