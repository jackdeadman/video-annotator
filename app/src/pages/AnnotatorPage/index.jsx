import React, { useState, useEffect }  from 'react'
import path from 'path';
import { readFile } from '../../utils';

import ProjectEditor from '../../components/ProjectEditor';
import Project from '../../classes/Project';
import Loader from '../../components/Loader';
import { Annotations } from '../../classes/Annotations';

const AnnotatorPage = function({ projectBase }) {
    const [ project, setProject ] = useState(null);

    useEffect(function() {
        (async () => {
            if (project == null) {
                const project = await Project.create(projectBase);
                setProject(project);
            }
        })();
    }, [ project ]);

    return (
        project == null
            ? <Loader>Loading Project</Loader>
            : <ProjectEditor project={project} onProjectUpdate={setProject}/>
    );

};

export default AnnotatorPage;
