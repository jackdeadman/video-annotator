import React, { useState, useReducer } from 'react';
import classNames from 'classnames';

import styles from './styles.css';

import reducer from '../../reducers/frame';

import VideoAnnotator from '../VideoAnnotator';
import SpeakerSelector from '../SpeakerSelector';

const defaultSpeakers = [
    { id: 'Person 1', color: '#2c25d6', image: 'src/assets/images/person.jpg' },
    { id: 'Person 2', color: '#368033', image: 'src/assets/images/person.jpg' },
    { id: 'Person 3', color: '#ac2222', image: 'src/assets/images/person.jpg' },
    { id: 'Person 4', color: '#ae9218', image: 'src/assets/images/person.jpg' }
];

const ProjectEditor = function({ project }) {

    // Setup State
    const [ state, dispatch ] = useReducer(reducer, {
        annotations: [],
        selectedSpeaker: null,
        speakers: defaultSpeakers 
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
        </div>
    );
};

export default ProjectEditor;