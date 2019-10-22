import React, { useRef, useEffect, useContext, useState } from 'react';
import styles from './styles.css';

import { useMouseDrag } from '../../hooks/mouse';
import { isEqualObjects } from '../../utils';

import {
    ADD_ANNOTATION, UPDATE_ANNOTATION,
    MOVE_ANNOTATION_TO_FRONT,
    SET_SELECTED_SPEAKER
} from '../../constants/actionTypes';

import {
    SAVING, NEEDS_SAVING, SAVED
} from '../../constants/symbols';

import { ProjectContext, CanvasContext } from '../../constants/contexts';

import { Annotation, DragGuide, KeyBindings } from '../../components/Annotation';
import { normalise } from '../../components/Annotation/helpers';
import AdjustMode from './AdjustMode';
import { useChange } from '../../hooks/';


/**
 * video: Path to the video we are editing
 * current: Position in the video
 * annotations in the video
 * speaker: person we are currently annotating (may be null)
 * onSelect: event fired when user selects an annotation
 */
const VideoAnnotator = function({ store }) {
    const { state, dispatch } = store;
    const {
        annotations, selectedSpeaker, selectedFrame,
        selectedCamera
    } = state;

    const selectedAnnotations = annotations[selectedFrame] || [];
    const canvasRef = useRef();

    // These needs to be refs as they are used inside the closure.
    const selectedSpeakerRef = useRef(selectedSpeaker);
    const selectedAnnotationsRef = useRef(selectedAnnotations);

    const { project } = useContext(ProjectContext);
    const [ edits, setEdits ] = useState(SAVED);
    const [ adjusting, setAdjusting ] = useState(false);

    const { mousePosition, dragging } = useMouseDrag(canvasRef.current, [
        // Can only drag if you select someone
        _ => selectedSpeaker != null,
        // Constraints
        // - Can't annotate a person twice
        _ => !selectedAnnotationsRef.current.some(ann => {
                return ann.speaker.id === selectedSpeaker.id
            }
        )
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
                setEdits(NEEDS_SAVING);
            }
        }
    }, [ dragging ]);

    useEffect(() => {
        selectedSpeakerRef.current = selectedSpeaker;

        if (selectedSpeaker && selectedSpeaker !== selectedAnnotationsRef.current[0]) {
            if (selectedAnnotationsRef.current.length) {
                const index = selectedAnnotations.findIndex(
                    ann => ann.speaker.id === selectedSpeakerRef.current.id);
                dispatch({
                    type: MOVE_ANNOTATION_TO_FRONT,
                    value: index
                })
            }
        }

    }, [ selectedSpeaker ]);

    useEffect(() => {
        selectedAnnotationsRef.current = selectedAnnotations;
    }, [ selectedAnnotations ]);

    const updateAnnotation = function(index, updated) {
        dispatch({
            type: UPDATE_ANNOTATION,
            value: { index, updated }
        });
    }

    useChange(() => {
        setEdits(NEEDS_SAVING);
    }, [ selectedAnnotations ]);

    const handleSelect = function(selected) {
        const annotation = selectedAnnotations[selected];
        dispatch({
            type: SET_SELECTED_SPEAKER,
            value: annotation.speaker
        });
    };

    const handleEdit = function(speaker) {
        if (true || anyAnnotations(speaker, annotations)) {
            setAdjusting(!adjusting);
        }

    }

    const saveAnnotations = async function() {
        dispatch({
            type: SET_SELECTED_SPEAKER,
            value: null
        });
        setEdits(SAVING)
        await project.saveAnnotations();
        setEdits(SAVED);
    }
    
    return (
        <CanvasContext.Provider value={canvasRef}>
            <KeyBindings state={state} dispatch={dispatch} callbacks={ { onEdit: handleEdit } }>
                { adjusting
                    ?
                    <AdjustMode store={store}></AdjustMode>
                    :
                    <div ref={canvasRef} className={styles.drawer}>
                        { (edits != SAVED) &&
                            <button onClick={saveAnnotations} className={styles.save}>
                                { (edits == NEEDS_SAVING) && 'Save Annotations' }
                                { (edits == SAVING) && 'Saving...' }
                            </button>
                        }
                        { selectedSpeaker && dragging &&
                            <DragGuide { ...mousePosition } color={selectedSpeaker.color} /> }
                        { selectedAnnotations.map((annotation, id) => 
                            <Annotation
                                key={annotation.speaker.id} {...annotation}
                                index={id}
                                canvas={canvasRef.current}
                                selectedSpeaker={selectedSpeaker}
                                onSelect={handleSelect}
                                onChange={change => updateAnnotation(id, change)}
                            />
                        ) }
                        <img className={styles.frame}
                            src={project.frame(selectedCamera, selectedFrame)} />
                    </div>
                }
                
            </KeyBindings>
        </CanvasContext.Provider>
    );
};

export default VideoAnnotator;
