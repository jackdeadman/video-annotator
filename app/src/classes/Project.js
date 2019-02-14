import path from 'path'
import { object2array } from '../utils';

class Project {

    constructor(projectFile, projectJSON) {
        this.projectFile = projectFile;
        this.projectJSON = projectJSON;
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

}

export default Project;