import path from 'path';
import { ensureDir } from 'fs-extra'
import { writeFile, slugify, createDirs } from '../utils';

function createProjectJSON({ projectName, files }) {
    return JSON.stringify({
        project_name: projectName,
        created_at: (new Date()).toString(),
        updated_at: ((new Date()).toString()),

        folders: {
            labels: "labels",
            frames: "frames"
        },

        cameras: (() => {
            const obj = {};
            for (let cam of files) {
                obj[path.basename(cam)] = cam;
            }

            return obj;
        })()
    });
}

function createAnnotationJSON(speakers) {
    return JSON.stringify({
        // Generate speakers ids from a count
        speakers: Array(speakers).fill().map((_, i) => i+1),
        markers: {}
    });
}

export async function setupNewProject(location, project) {
    const speakers = 4;
    const base = path.join(location, slugify(project.projectName));
    await ensureDir(base);

    const filesToSave = {
        project: path.join(base, 'project.json'),
        annotations: path.join(base, 'annotations.json')
    };

    await Promise.all([
        writeFile(filesToSave.project, createProjectJSON(project)),
        writeFile(filesToSave.annotations,
            createAnnotationJSON(speakers))
    ]);
}