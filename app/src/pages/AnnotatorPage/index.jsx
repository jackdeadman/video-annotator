import React, { useState, useEffect }  from 'react'
import path from 'path';
import { readFile } from '../../utils';

import ProjectEditor from '../../components/ProjectEditor';
import Project from '../../classes/Project';
import Loader from '../../components/Loader';
import { Annotations } from '../../classes/Annotations';

const PROJECT_FILE = 'project.json';
const ANNOTATIONS_FILE = 'annotations.json';

async function loadProject(project, projectBase, setProject) {
    if (project == null) {
        const projectFilePath = path.join(projectBase, PROJECT_FILE);
        const annotationsFilePath = path.join(projectBase, ANNOTATIONS_FILE);

        const file = await readFile(projectFilePath);
        const project = new Project(projectFilePath, JSON.parse(file));
        const annotationsJSON = JSON.parse(await readFile(annotationsFilePath));
        project.annotations = new Annotations(annotationsFilePath, annotationsJSON);

        setProject(project);
    }
}

const AnnotatorPage = function({ projectBase }) {
    const [ project, setProject ] = useState(null);

    useEffect(function() {
        loadProject(project, projectBase, setProject);
    }, [ project ]);

    return (
        project == null
            ? <Loader>Loading Project</Loader>
            : <ProjectEditor project={project} onProjectUpdate={setProject}/>
    );

};

export default AnnotatorPage;
