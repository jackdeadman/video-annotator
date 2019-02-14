import React, { useReducer, useState } from 'react';
import classNames from 'classnames';

import styles from './styles.css';

import reducer from '../../reducers/frame';

import VideoAnnotator from '../VideoAnnotator';
import SpeakerSelector from '../SpeakerSelector';
import FramePicker from '../FramePicker';
import { SET_CURRENT_CAMERA } from '../../constants/actionTypes';

const defaultSpeakers = [
    { id: 'Person 1', color: '#2c25d6', image: 'src/assets/images/person.jpg' },
    { id: 'Person 2', color: '#368033', image: 'src/assets/images/person.jpg' },
    { id: 'Person 3', color: '#ac2222', image: 'src/assets/images/person.jpg' },
    { id: 'Person 4', color: '#ae9218', image: 'src/assets/images/person.jpg' }
];

const CameraSelector = function({ cameras, selected }) {
    console.log(cameras, selected)
    return (
        <ul className={styles.tab}>{ cameras.map(camera => 
            <li className={classNames({ [styles.selected]: camera.key === selected.key })}
                key={camera.key}>
                { camera.key }
            </li>
        ) }</ul>
    );
}

const ProjectEditor = function({ project }) {
    // Setup Project State
    const [ state, dispatch ] = useReducer(reducer, {
        annotations: [],
        selectedSpeaker: null,
        speakers: defaultSpeakers,
        currentScene: project.scenes[0],
        currentCamera: project.camerasArray(project.scenes[0])[0],
        currentFrame: 0
    });

    const store = { state, dispatch };

    return (
        <div className={styles.page}>
            <div className={classNames(styles.video, styles.box)}>
                <VideoAnnotator store={store} video={project.videos[0]}/>
            </div>
            <div className={classNames(styles.speakers, styles.box)}>
                <SpeakerSelector store={store}/>
                {/* <div className={classNames(styles.utterances, styles.box)}>C</div> */}
            </div>
            <div className={classNames(styles.frames, styles.box)}>
                <CameraSelector
                    cameras={project.camerasArray(state.currentScene)}
                    selected={state.currentCamera}
                    onChange={camera => dispatch({
                        type: SET_CURRENT_CAMERA,
                        value: camera
                    })}
                />
                <FramePicker video={project.videos[0]} onChange={console.log} />
            </div>
        </div>
    );
};

export default ProjectEditor;