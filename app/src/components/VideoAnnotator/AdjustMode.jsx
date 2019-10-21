import React, { useState, useEffect, useContext }  from 'react'
import { ProjectContext } from '../../constants/contexts';


const AdjustMode = function ({ store }) {

    const { state, dispatch } = store;
    const {
        annotations, selectedSpeaker, selectedFrame,
        selectedCamera
    } = state;

    const selectedAnnotation = annotations[selectedFrame][0] || null;

    const { project } = useContext(ProjectContext);

    return (
        <div>
            <img src={project.frame(selectedCamera, selectedFrame)} />
            Adjusting 
        </div>
    );
};

export default AdjustMode;