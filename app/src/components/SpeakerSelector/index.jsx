import React from 'react';
import styles from './styles.css';

import classNames from 'classnames';

const handleColor = (person, onColorChange) => e => {
    const color = e.target.value;
    onColorChange(person, color);
};

const Speaker = (person, isSelected, onChange, onColorChange) => {
    return (
        <div key={person.id}
                onClick={() => onChange(person)}
                style={ { borderLeftColor: person.color } }
                className={classNames(styles.person,{ [styles.selected]: isSelected })}>
            <h2>{ person.id }</h2>
            <input type="color" name="color" value={person.color} onChange={handleColor(person, onColorChange)} />
            <img src={person.image} alt="Image of person" />
        </div>
    )
};

const SpeakerSelector = function({ selectedPerson, people, onChange, onColorChange }) {
    const isSelectedPerson = person => selectedPerson === person;
    
    return (
        <div>
            { people.map(p => Speaker(p, isSelectedPerson(p), onChange, onColorChange)) }
        </div>
    );
};

export default SpeakerSelector;