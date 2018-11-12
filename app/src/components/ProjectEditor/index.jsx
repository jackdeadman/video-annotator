import React from 'react';
import classNames from 'classnames';

import styles from './styles.css';

const ProjectEditor = function({ project }) {
    return (
        <div className={styles.page}>
            <div className={classNames(styles.video, styles.box)}>
                <video src={project.videos[0]} />
            </div>
            <div className={classNames(styles.speakers, styles.box)}>
                <div className={classNames(styles.person, styles.selected)}>
                    <div>
                        <h2>Person 1</h2>
                        <input type="color" name="color"/>
                    </div>
                    <img src="src/assets/images/person.jpg" alt="Example image"/>
                </div>

                <div className={classNames(styles.person)}>
                    <div>
                        <h2>Person 2</h2>
                        <input type="color" name="color"/>
                    </div>
                    <img src="src/assets/images/person.jpg" alt="Example image"/>
                </div>

                <div className={classNames(styles.person)}>
                    <div>
                        <h2>Person 3</h2>
                        <input type="color" name="color"/>
                    </div>
                    <img src="src/assets/images/person.jpg" alt="Example image"/>
                </div>

                <div className={classNames(styles.person)}>
                    <div>
                        <h2>Person 4</h2>
                        <input type="color" name="color"/>
                    </div>
                    <img src="src/assets/images/person.jpg" alt="Example image"/>
                </div>
            </div>
            <div className={classNames(styles.utterances, styles.box)}>C</div>
        </div>
    );
};

export default ProjectEditor;