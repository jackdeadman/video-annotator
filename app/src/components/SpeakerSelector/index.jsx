import React from 'react';
import styles from './styles.css';

import classNames from 'classnames';
import {
    SET_SELECTED_SPEAKER,
    SET_SPEAKER_COLOR
} from '../../constants/actionTypes';


const Speaker = (speaker, store, idx) => {
    const { state, dispatch } = store;
    const { selectedSpeaker, selectedFrame, annotations } = state;
    
    const selectedAnnotations = annotations[selectedFrame] || [];
    const isSelected = speaker.id === (selectedSpeaker || {}).id;
    const annotation = selectedAnnotations.find(ann => ann.speaker.id === speaker.id);
    const hasAnAnnotation = annotation != undefined;
    
    return (
        <div
            className={classNames(styles.speaker,{ [styles.selected]: isSelected })}
            key={speaker.id}
            onClick={() => dispatch({
               type: SET_SELECTED_SPEAKER,
               value: speaker
            })}
            style={{ borderLeftColor: speaker.color }}
        >
            
            <h2>{ speaker.id }</h2>
            <input
                type="color"
                name="color"
                value={speaker.color}
                onChange={e => dispatch({
                    type: SET_SPEAKER_COLOR,
                    value: { index: idx, color: e.target.value }
                })}
            />
            
            <img src={speaker.image} alt={`Image of speaker ${speaker.id}`} />
            
            { hasAnAnnotation &&
                <ul className={styles['checkboxes']}>
                    <li><label>Face Visible? <input type="checkbox"
                        checked={annotation.meta.faceVisible} /></label></li>
                    <li><label>Mouth Visible? <input type="checkbox"
                        checked={annotation.meta.mouthVisible}/></label></li>
                </ul>
            }

        </div>
    )
};

const SpeakerSelector = ({ store }) => {
    console.log('Selector: ', store.state.speakers)
    return (<div>
        { store.state.speakers.map((speaker, idx) => Speaker(speaker, store, idx)) }
    </div>)
};

export default SpeakerSelector;