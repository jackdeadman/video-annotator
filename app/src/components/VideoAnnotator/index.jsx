import React, { useRef, useEffect, useContext, useState } from 'react';
import classNames from 'classnames';
import styles from './styles.css';
import ImageLoader from 'react-loading-image';

import { useMouseDrag } from '../../hooks/mouse';
import { isEqualObjects } from '../../utils';

import {
    ADD_ANNOTATION, UPDATE_ANNOTATION,
    MOVE_ANNOTATION_TO_FRONT,
    SET_SELECTED_SPEAKER
} from '../../constants/actionTypes';

import {
    SAVING, NEEDS_SAVING, SAVED, LOADING, LOADED
} from '../../constants/symbols';

import { ProjectContext, CanvasContext } from '../../constants/contexts';

import { Annotation, DragGuide, KeyBindings } from '../../components/Annotation';
import { normalise, calcBoxStyles } from '../../components/Annotation/helpers';
import AdjustMode from './AdjustMode';
import { useChange } from '../../hooks/';
import ContextViewer from './ContextViewer';
import PrefetchImages from '../helpers/PrefetchImages';
import BounceLoader from 'react-spinners/BounceLoader';


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
        selectedCamera, speakers
    } = state;

    const canvasRef = useRef();
    const [ loadingState, setLoadingState ] = useState(LOADING);

    // Requires the canvas to be loaded
    function normaliseAnnotations(annotations) {
        let givenList = true;
        if (annotations.length === undefined) {
            annotations = [ annotations ];
            givenList = false;
        }

        const global = annotations.map(ann => ({
            ...ann,
            start: {
                x: ann.start.x / canvasRef.current.offsetWidth,
                y: ann.start.y / canvasRef.current.offsetHeight
            },
            end: {
                x: ann.end.x / canvasRef.current.offsetWidth,
                y: ann.end.y / canvasRef.current.offsetHeight
            }
        }));

        // Only return a list if a list was given
        return givenList ? global : global[0];
    }

    // Requires the canvas to be loaded
    function denormaliseAnnotations(annotations) {

        let givenList = true;
        if (annotations.length === undefined) {
            annotations = [ annotations ];
            givenList = false;
        }

        const global = annotations.map(ann => ({
            ...ann,
            start: {
                x: ann.start.x * canvasRef.current.offsetWidth,
                y: ann.start.y * canvasRef.current.offsetHeight
            },
            end: {
                x: ann.end.x * canvasRef.current.offsetWidth,
                y: ann.end.y * canvasRef.current.offsetHeight
            }
        }));

        // Only return a list if a list was given
        return givenList ? global : global[0];
    }
    let selectedAnnotations = [];

    if (canvasRef.current) {
        selectedAnnotations = denormaliseAnnotations(annotations[selectedCamera][selectedFrame.number] || []);
    }

    // These needs to be refs as they are used inside the closure.
    const selectedSpeakerRef = useRef(selectedSpeaker);
    const selectedAnnotationsRef = useRef(selectedAnnotations);

    const { project } = useContext(ProjectContext);
    const [ edits, setEdits ] = useState(SAVED);
    const [ adjusting, setAdjusting ] = useState(false);

    const { mousePosition, dragging } = useMouseDrag(canvasRef.current, [
        // Can only drag if you select someone
        function() {
            return selectedSpeakerRef.current != null
        },
        // Constraints
        // - Can't annotate a person twice
        _ => !selectedAnnotationsRef.current.some(ann => {
                return ann.speaker.id === selectedSpeakerRef.current.id
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
                const boxStyles = calcBoxStyles(normalise(mousePosition));
                const minSize = 15;
                if (boxStyles.width > minSize && boxStyles.height > minSize) {
                    dispatch({
                        type: ADD_ANNOTATION,
                        value: normaliseAnnotations({
                            ...normalise(mousePosition),
                            // Default these to being true when a new annotation
                            // is added. It can later be changed
                            meta: {
                                mouthVisible: true,
                                faceVisible: true
                            },
                            speaker: selectedSpeaker })
                    });
                    setEdits(NEEDS_SAVING);
                }
            }
        }
    }, [ dragging ]);

    useEffect(() => {
        selectedSpeakerRef.current = selectedSpeaker;

        if (selectedSpeaker && selectedSpeaker !== selectedAnnotationsRef.current[0]) {
            if (selectedAnnotationsRef.current.length) {
                const index = selectedAnnotations.findIndex(
                    ann => ann.speaker.id === selectedSpeakerRef.current.id);

                if (index >= 0) {
                    dispatch({
                        type: MOVE_ANNOTATION_TO_FRONT,
                        value: index
                    })
                }
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
    }, [ JSON.stringify(selectedAnnotations), JSON.stringify(speakers)]);

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
        project.update(state)
        await project.save();
        setEdits(SAVED);
    }

    useEffect(() => {
        setLoadingState(LOADING);
    }, [ selectedFrame, selectedCamera ]);

    const showContext = true;

    return (
        <CanvasContext.Provider value={canvasRef}>
            <KeyBindings state={state} dispatch={dispatch} callbacks={ { onEdit: handleEdit } }>
                { adjusting
                    ?
                    <AdjustMode store={store}
                                onChange={(id, change) => updateAnnotation(id, change)}></AdjustMode>
                    :
                    <div ref={canvasRef} className={styles.drawer}>
                        {/* Prefetch frames in all the camera for faster cam switching */}
                        { (selectedFrame.number !== null) && <PrefetchImages images={project.cameras.map(cam => {
                            return project.frameSrc(cam, selectedFrame.number)
                        })} /> }
                        { (edits != SAVED) &&
                            <button onClick={saveAnnotations} className={styles.save}>
                                { (edits == NEEDS_SAVING) && 'Save' }
                                { (edits == SAVING) && 'Saving...' }
                            </button>
                        }
                        { (loadingState == LOADED) && selectedSpeaker && dragging &&
                            <DragGuide { ...mousePosition } color={selectedSpeaker.color} /> }
                        { (loadingState == LOADED) && selectedAnnotations.map((annotation, id) => 
                            <Annotation
                                key={annotation.speaker.id} {...annotation}
                                index={id}
                                canvas={canvasRef.current}
                                selectedSpeaker={selectedSpeaker}
                                onSelect={handleSelect}
                                onChange={change => 
                                    updateAnnotation(id, normaliseAnnotations(change))}
                            />
                        ) }
                        {
                            (selectedFrame.number !== null)&&
                            <ImageLoader
                                className={styles.frame}
                                src={selectedFrame.src}
                                onLoad={() => setLoadingState(LOADED)}
                                loading={() =>
                                    <div style={{
                                        textAlign: 'center',
                                        padding: '10px',
                                        margin: 'auto'
                                    }}>
                                        <BounceLoader />
                                    </div>}
                            />
                        }
                        {/* { showContext && <ContextViewer /> } */}
                    </div>
                }
                
            </KeyBindings>
        </CanvasContext.Provider>
    );
};

export default VideoAnnotator;
