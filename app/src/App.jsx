import React, { useState } from 'react';

import AnnotatorPage from './pages/AnnotatorPage';
import SelectProjectPage from './pages/SelectProjectPage';
import CreateProjectPage from './pages/CreateProjectPage';
import { setupNewProject } from './modules/project';

import { PROJECTS, PROJECT, CREATE_PROJECT, CREATING_PROJECT } from './constants/pages';



const App = function() {

    // const [ projectBase, setProjectBase ] = useState(null);
    // const [ projectBase, setProjectBase ] = useState('/home/jack/Documents/tools/example-project');
    const [ projectBase, setProjectBase ] = useState('projects/scene_21');
    // const [ projectBase, setProjectBase ] = useState(null);
    // const [ page, setPage ] = useState(CREATE_PROJECT);
    const [ creatingProject, setCreatingProject ] = useState(null);

    async function createProject(project) {
        const base = await setupNewProject('projects', project);
        setProjectBase(base);
        setCreatingProject(false);
    }

    function createNewProject() {
        setCreatingProject(true);
    }

    let page = PROJECTS;
    if (projectBase) {
        page = PROJECT;
    } else if (creatingProject) {
        page = CREATE_PROJECT;
    }

    return (
        <div>
            <h1>Video Annotator</h1>
            {(() => {
                switch(page) {
                case PROJECTS:
                    return <SelectProjectPage
                                onSelect={setProjectBase}
                                onNewProject={createNewProject} />
                case PROJECT:
                    return <AnnotatorPage projectBase={projectBase} />
                
                case CREATE_PROJECT:
                    return <CreateProjectPage onCreate={createProject}/>
                }
            })()}
        </div>
    )
};

export default App;
