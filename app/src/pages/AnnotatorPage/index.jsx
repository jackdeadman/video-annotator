import React, { useState, useEffect }  from 'react'
import { readFile } from '../../utils';

import ProjectEditor from '../../components/ProjectEditor';
import Project from '../../classes/Project';
import Loader from '../../components/Loader';

async function loadProject(project, projectFilePath, setProject) {
    if (project == null) {
        const file = await readFile(projectFilePath);
        const project = new Project(projectFilePath, JSON.parse(file))
        setProject(project);
    }
}

const AnnotatorPage = function({ projectFilePath }) {

    const [ project, setProject ] = useState(null);

    useEffect(function() {
        loadProject(project, projectFilePath, setProject);
    }, [ project ]);

    return (
        project == null
            ? <Loader>Loading Project</Loader>
            : <ProjectEditor project={project} />
    );

};

export default AnnotatorPage;
