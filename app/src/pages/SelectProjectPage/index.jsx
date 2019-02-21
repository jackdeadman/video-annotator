import React from 'react';
import { chooseFolder } from '../../utils/UI';

const SelectProjectPage = function({ onSelect }) {

    const loadProject = async () => {
        const folder = await chooseFolder();
        console.log(folder)
        if (folder) {
            onSelect(folder);
        }
    };

    return (
        <button onClick={loadProject} className="btn">Load project</button>
    );
};


export default SelectProjectPage;