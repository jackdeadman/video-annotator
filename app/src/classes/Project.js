import path from 'path'
import { object2array } from '../utils';
import { format } from 'util';
import { EmptyAnnotations } from './Annotations';

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

    get videoPath() {
        return this.joinBase(this.projectJSON.folders.videos);
    }

    get framePath() {
        return this.joinBase(this.projectJSON.folders.frames)
    }

    parseVideo(videoPath) {
        const filename = path.basename(videoPath);
        const [ scene, camera ] = filename.split('.')[0].split('_');
        return { scene, camera, filename, videoPath };
    }

    framePathForVideo(video) {
        const { scene, camera } = this.parseVideo(video);
        return this.joinFramePath(scene, camera);
    }

    joinVideoPath(...paths) {
        return path.join(this.videoPath, ...paths);
    }

    joinFramePath(...paths) {
        return path.join(this.framePath, ...paths);
    }

    get scenes() {
        return Object.keys(this.projectJSON.scenes);
    }

    get videos() {
        return this.scenes.map(id => `${this.joinVideoPath(id)}.mp4`);
    }

    video(scene, camera) {
        return this.joinVideoPath(`${scene}_${camera}.mp4`);
    }

    cameras(scene) {
        return this.projectJSON.scenes[scene].cameras;
    }

    camerasArray(scene) {
        return object2array(this.cameras(scene))
    }

    frame(scene, camera, frameNumber) {
        return this.joinFramePath(scene, camera, `${scene}_${camera}_${frameNumber}.jpg`)
    }

    scene(video) {
        const { scene } = this.parseVideo(video);
        return this.projectJSON.scenes[scene]; 
    }

    framesCount(video) {
        return this.scene(video).frames;
    }

    framesSpacing(video) {
        return this.scene(video).frames;
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