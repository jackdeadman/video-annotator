import path from 'path'
import { object2array } from '../utils';
import { format } from 'util';
import { EmptyAnnotations } from './Annotations';
import { readdir } from 'fs-extra';

class Project {

    constructor(projectFile, projectJSON) {
        this.projectFile = projectFile;
        this.projectJSON = projectJSON;

        const defaultLocation = path.join(this.basePath, 'annotations.json');
        this.annotations = new EmptyAnnotations(defaultLocation);
    }

    get basePath() {
        return path.dirname(this.projectFile);
    }

    joinBase(...paths) {
        return path.join(this.basePath, ...paths);
    }

    get cameras() {
        return Object.keys(this.projectJSON.cameras);
    }

    frame(camera, frameid) {
        const filename = path.join(
            this.projectJSON.cameras[camera], `${frameid}.png`
        );
        return filename;
    }

    async frames(camera) {
        const camPath = this.projectJSON.cameras[camera]
        const images = await readdir(camPath);
        const frames = images.map(im => ({
            number: Number(im.split('.')[0]),
            src: path.join(this.projectJSON.cameras[camera], im)
        })).sort((a, b) => a.number - b.number);
        return frames;
    }

    async saveFrameUpdate(video, params) {
        const { scene } = this.parseVideo(video);
        this.projectJSON.scenes[scene] = Object.assign(
            this.projectJSON.scenes[scene], params);
        
        await this.save();
    }

    async save() {
        const json = JSON.stringify(this.projectJSON);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(true);
            }, 2000);
        });
    }

    async saveAnnotations() {
        return await this.annotations.save();
    }


}

export default Project;