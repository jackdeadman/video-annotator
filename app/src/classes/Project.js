import path from 'path'
import { EmptyAnnotations, Annotations } from './Annotations';
import { readdir, exists } from 'fs-extra';
import { readFile } from '../utils';

const PROJECT_FILE = 'project.json';
const ANNOTATIONS_FILE = 'annotations.json';

class Project {

    static async create(projectPath) {
        const project = new Project(projectPath);
        await project.init();
        return project;
    }

    constructor(basePath) {
        this.basePath = basePath;
    }

    async init() {
        this.projectFile = this.joinBase(PROJECT_FILE);
        this.annotationsFile = this.joinBase(ANNOTATIONS_FILE);

        if (!(await exists(this.projectFile))) {
            throw new Error('No project file found: ', this.projectFile);
        }

        this.projectJSON = JSON.parse(await readFile(this.projectFile));

        if (await exists(this.annotationsFile)) {
            this.annotations = new Annotations(this.annotationsFile);
        } else {
            this.annotations = new EmptyAnnotations(this.annotationsFile);
            await this.annotations.save();
        }

        console.log('Init annotations')
        await this.annotations.init();
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

    async saveSpeakerPictureUpdate(speaker, image) {
        const index = this.annotations.speakers.findIndex(sp => sp.id === speaker.id);
        this.annotations.speakers[index] = {
            ...speaker,
            image
        };
        console.log(this.annotations.json)
        await this.annotations.save();
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