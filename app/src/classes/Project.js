import path from 'path'
import { EmptyAnnotations, Annotations } from './Annotations';
import { readdir, exists } from 'fs-extra';
import { readFile, writeFile } from '../utils';

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

        await this.annotations.init();
    }

    joinBase(...paths) {
        return path.join(this.basePath, ...paths);
    }

    get cameras() {
        return Object.keys(this.projectJSON.cameras);
    }

    frameSrc(camera, frameid) {
        const filename = path.join(
            this.projectJSON.cameras[camera], `${frameid}.png`
        );
        return filename;
    }

    async frames(camera) {
        const imageSets = {};

        for (let [ camera, cameraPath ] of Object.entries(this.projectJSON.cameras)) {
            imageSets[camera] = (await readdir(cameraPath)).map(im => ({
                number: Number(im.split('.')[0]),
                src: path.join(this.projectJSON.cameras[camera], im)
            })).sort((a, b) => a.number - b.number);
        }

        return {
            selected: camera,
            imageSets
        };
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
        await this.annotations.save();
    }

    async save() {
        // Save the two files at the same time.
        return Promise.all([
            this.saveProject(),
            this.saveAnnotations()
        ]);
    }

    async saveProject() {
        const json = JSON.stringify(this.projectJSON);
        return writeFile(this.projectFile, json);
    }

    async saveAnnotations() {
        return await this.annotations.save();
    }

    update({ annotations }) {
        this.annotations.update(annotations);
    }


}

export default Project;