import path from 'path'

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

    joinVideoPath(...paths) {
        return path.join(this.videoPath, ...paths);
    }


    get videos() {
        return this.projectJSON.scenes.map(id => `${this.joinVideoPath(id)}.mp4`);
    }

}

export default Project;