import React, { useState } from 'react';
import classNames from 'classnames';

import styles from './styles.css';

import VideoAnnotator from '../VideoAnnotator';
import SpeakerSelector from '../SpeakerSelector';

const annotations = [
    { x: 100, y: 100, width: 50, height: 50, id: 1 },
    { x: 100, y: 100, width: 50, height: 50 , id: 2},
];

const people = [
    { id: 'Person 1', color: '#cccccc', image: 'src/assets/images/person.jpg' },
    { id: 'Person 2', color: '#cccccc', image: 'src/assets/images/person.jpg' },
    { id: 'Person 3', color: '#cccccc', image: 'src/assets/images/person.jpg' },
    { id: 'Person 4', color: '#cccccc', image: 'src/assets/images/person.jpg' }
];

const defaultPerson = people[2];


const ProjectEditor = function({ project }) {

    const [ selectedPerson, setSelectedPerson ] = useState(defaultPerson);

    return (
        <div className={styles.page}>
            <div className={classNames(styles.video, styles.box)}>
                <VideoAnnotator video={project.videos[0]} annotations={annotations} />
            </div>
            <div className={classNames(styles.speakers, styles.box)}>
                <SpeakerSelector onChange={setSelectedPerson} people={people} selectedPerson={selectedPerson} />
                <div className={classNames(styles.utterances, styles.box)}>C</div>
            </div>
        </div>
    );
};

export default ProjectEditor;