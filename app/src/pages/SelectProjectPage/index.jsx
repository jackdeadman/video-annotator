import React from 'react';
import { chooseFolder } from '../../utils/UI';

const SelectProjectPage = function({ onSelect, onNewProject }) {

    const loadProject = async () => {
        const folder = await chooseFolder();
        if (folder) {
            onSelect(folder);
        }
    };

    return (<div>
        <button onClick={loadProject} className="btn">Load project</button>
        <button onClick={onNewProject} className="btn">Create project</button>
    </div>)
};


export default SelectProjectPage;