import React from 'react';
import styles from './styles.css';

import classNames from 'classnames';

const SpeakerSelector = function({ selectedPerson, people, onChange }) {
    const isSelectedPerson = person => selectedPerson === person;
    
    return (
        <div>
            { people.map(person => (
                <div
                    key={person.id}
                    onClick={() => onChange(person)}
                    className={classNames(styles.person,{ [styles.selected]: isSelectedPerson(person) })}>
                    <h2>{ person.id }</h2>
                    <input type="color" name="color" value={person.color} />
                    <img src={person.image} alt="Image of person" />
                </div>
             ))}
        </div>
    );
};

export default SpeakerSelector;