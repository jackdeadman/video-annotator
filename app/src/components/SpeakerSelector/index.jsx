import React, { useRef } from 'react';
import styles from './styles.css';

import classNames from 'classnames';
import {
    SET_SELECTED_SPEAKER,
    SET_SPEAKER_COLOR,
    SET_SPEAKER_META_DATA
} from '../../constants/actionTypes';


const Speaker = ({speaker, store, idx}) => {
    const { state, dispatch } = store;
    const { selectedSpeaker, selectedFrame, selectedCamera, annotations } = state;

    const faceElement = useRef();
    const mouthElement = useRef();
    
    let selectedAnnotations = annotations[selectedCamera][selectedFrame.number] || [];
    const isSelected = speaker.id === (selectedSpeaker || {}).id;
    const annotation = selectedAnnotations.find(ann => ann.speaker.id === speaker.id);
    const hasAnAnnotation = annotation != undefined;

    function updateMetaData() {

        dispatch({
            type: SET_SPEAKER_META_DATA,
            value: {
                speaker,
                frame: selectedFrame.number,
                meta: {
                    mouthVisible: mouthElement.current.checked,
                    faceVisible: faceElement.current.checked
                }
            }
        });
    }
    
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
                    <li><label>Face Visible?
                        <input type="checkbox"
                            checked={annotation.meta.faceVisible}
                            onChange={updateMetaData}
                            ref={faceElement}
                        /></label></li>
                    <li><label>Mouth Visible?
                        <input type="checkbox"
                            checked={annotation.meta.mouthVisible}
                            onChange={updateMetaData}
                            ref={mouthElement}
                        /></label></li>
                </ul>
            }

        </div>
    )
};

const SpeakerSelector = ({ store }) => {
    return (<div>
        { store.state.speakers.map((speaker, idx) =>
        <Speaker key={speaker.id} speaker={speaker}
                    store={store}
                    idx={idx} />) }
    </div>)
};

export default SpeakerSelector;