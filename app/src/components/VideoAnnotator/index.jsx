import React, { useRef, useEffect, useContext } from 'react';
import styles from './styles.css';

import { useMouseDrag } from '../../hooks/mouse';
import { isEqualObjects } from '../../utils';

import {
    ADD_ANNOTATION, UPDATE_ANNOTATION,
    MOVE_ANNOTATION_TO_FRONT,
    SET_SELECTED_SPEAKER
} from '../../constants/actionTypes';

import { ProjectContext } from '../../constants/contexts';

import { Annotation, DragGuide, KeyBindings } from '../../components/Annotation';
import { normalise } from '../../components/Annotation/helpers';

/**
 * video: Path to the video we are editing
 * current: Position in the video
 * annotations in the video
 * speaker: person we are currently annotating (may be null)
 * onSelect: event fired when user selects an annotation
 */
const VideoAnnotator = function({ store, video, current, labels, onSelect }) {
    const { state, dispatch } = store;
    const {
        annotations, selectedSpeaker, selectedFrame,
        selectedCamera, selectedScene
    } = state;

    const canvasRef = useRef();
    const { mousePosition, dragging } = useMouseDrag(canvasRef.current, [
        // Constraints
        // - Can't annotate a person twice
        _ => !annotations.some(ann => ann.speaker === selectedSpeaker)
    ]);

    // Setup Effects
    // Add annotation after dragging
    useEffect(function() {
        // Check if it is actually a drag opposed to a click
        if (!isEqualObjects(mousePosition.start, mousePosition.end) && !dragging) {
            // Finished dragging, add annotation if speaker has been selected
            if (selectedSpeaker) {
                dispatch({
                    type: ADD_ANNOTATION,
                    value: { ...normalise(mousePosition), speaker: selectedSpeaker }
                });
            }
        }
    }, [ dragging ]);

    const updateAnnotation = function(index, updated) {
        dispatch({
            type: UPDATE_ANNOTATION,
            value: { index, updated }
        });
    }

    const handleSelect = function(selected) {
        dispatch({
            type: MOVE_ANNOTATION_TO_FRONT,
            value: selected
        })

        const annotation = annotations[selected];
        dispatch({
            type: SET_SELECTED_SPEAKER,
            value: annotation.speaker
        });
    };

    const project = useContext(ProjectContext);

    return (
        <KeyBindings state={state} dispatch={dispatch}>
            <div ref={canvasRef} className={styles.drawer}>
                { selectedSpeaker && dragging && <DragGuide { ...mousePosition } color={selectedSpeaker.color} /> }
                { annotations.map((annotation, id) => 
                    <Annotation
                        key={id} {...annotation}
                        index={id}
                        canvas={canvasRef.current}
                        selectedSpeaker={selectedSpeaker}
                        onSelect={handleSelect}
                        onChange={change => updateAnnotation(id, change)}
                    />
                ) }
                <img className={styles.frame} 
                    src={project.frame(selectedScene, selectedCamera.key, selectedFrame)} />
            </div>
        </KeyBindings>
    );
};

export default VideoAnnotator;
