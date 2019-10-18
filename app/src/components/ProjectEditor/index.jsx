import React, { useReducer, useState } from 'react';
import classNames from 'classnames';

import styles from './styles.css';

import reducer from '../../reducers/frame';

import VideoAnnotator from '../VideoAnnotator';
import SpeakerSelector from '../SpeakerSelector';
import FramePicker from '../FramePicker';

import { ProjectContext, EditorContext } from '../../constants/contexts';
import { SET_SELECTED_CAMERA, SET_SELECTED_FRAME } from '../../constants/actionTypes';

const defaultSpeakers = [
    { id: 'Person 1', color: '#2c25d6', image: 'src/assets/images/person.jpg' },
    { id: 'Person 2', color: '#368033', image: 'src/assets/images/person.jpg' },
    { id: 'Person 3', color: '#ac2222', image: 'src/assets/images/person.jpg' },
    { id: 'Person 4', color: '#ae9218', image: 'src/assets/images/person.jpg' }
];

const CameraSelector = function({ cameras, selected, onChange }) {
    return (
        <ul className={styles.tab}>{ cameras.map(camera => 
            <li className={classNames({ [styles.selected]: camera === selected })}
                onClick={onChange.bind(this, camera)}
                key={camera}>
                { camera }
            </li>
        ) }</ul>
    );
}

const ProjectEditor = function({ project, onProjectUpdate }) {
    // Setup Project State
    const [ state, dispatch ] = useReducer(reducer, {
        annotations: project.annotations.markers,
        selectedSpeaker: null,
        speakers: defaultSpeakers,
        selectedCamera: project.cameras[0],
        selectedFrame: 0,
        project
    });

    const store = { state, dispatch };

    const { selectedScene, selectedCamera } = state;

    function setActiveFrame(frameNum) {
        dispatch({
            type: SET_SELECTED_FRAME,
            value: frameNum
        });
    }

    return (
        <ProjectContext.Provider value={{ project, setProject: onProjectUpdate }}>
            <EditorContext.Provider value={store}>
                <div className={styles.page}>
                    <div className={classNames(styles.video, styles.box)}>
                        <VideoAnnotator store={store} />
                    </div>
                    <div className={classNames(styles.speakers, styles.box)}>
                        <SpeakerSelector store={store} />
                    </div>
                    <div className={classNames(styles.frames, styles.box)}>
                        <CameraSelector
                            cameras={project.cameras}
                            selected={selectedCamera}
                            onChange={camera => dispatch({
                                type: SET_SELECTED_CAMERA,
                                value: camera
                            })}
                        />
                        <FramePicker camera={selectedCamera} onChange={setActiveFrame} />
                    </div>
                </div>
            </EditorContext.Provider>
        </ProjectContext.Provider>
    );
};

export default ProjectEditor;