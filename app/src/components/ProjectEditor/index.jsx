import React, { useState } from 'react';
import classNames from 'classnames';

import styles from './styles.css';

import VideoAnnotator from '../VideoAnnotator';
import SpeakerSelector from '../SpeakerSelector';

const annotations = [
    { x: 100, y: 100, width: 50, height: 50, id: 1 },
    { x: 100, y: 100, width: 50, height: 50 , id: 2},
];

const defaultPeople = [
    { id: 'Person 1', color: '#2c25d6', image: 'src/assets/images/person.jpg' },
    { id: 'Person 2', color: '#368033', image: 'src/assets/images/person.jpg' },
    { id: 'Person 3', color: '#ac2222', image: 'src/assets/images/person.jpg' },
    { id: 'Person 4', color: '#ae9218', image: 'src/assets/images/person.jpg' }
];

// const defaultPerson = defaultPeople[0];
const defaultPerson = null;


const ProjectEditor = function({ project }) {

    const [ selectedPerson, setSelectedPerson ] = useState(defaultPerson);
    const [ people, setPeople ] = useState(defaultPeople);

    const updateColor = (person, color) => {
        const index = people.indexOf(person);
        const updated = Object.assign(person, { color });
        setPeople(Object.assign([], people, { [index]: updated }));
    };

    return (
        <div className={styles.page}>
            <div className={classNames(styles.video, styles.box)}>
                <VideoAnnotator
                    video={project.videos[0]}
                    annotations={annotations}
                    speaker={selectedPerson}
                    onSelect={setSelectedPerson}
                />
            </div>
            <div className={classNames(styles.speakers, styles.box)}>
                <SpeakerSelector onColorChange={updateColor} onChange={setSelectedPerson} people={people} selectedPerson={selectedPerson} />
                <div className={classNames(styles.utterances, styles.box)}>C</div>
            </div>
        </div>
    );
};

export default ProjectEditor;