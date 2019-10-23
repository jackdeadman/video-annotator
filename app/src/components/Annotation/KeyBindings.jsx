import React, { useEffect, useContext } from 'react';

import { REMOVE_ANNOTATION, SET_SELECTED_SPEAKER, SET_PICTURE } from '../../constants/actionTypes';
import {
    DELETE, ESCAPE, E_KEY, P_KEY,
    ONE_KEY, TWO_KEY, THREE_KEY, FOUR_KEY
} from '../../constants/keycodes';
import { useKeyboard } from '../../hooks/keyboard';
import { ProjectContext } from '../../constants/contexts';
import { createSpeakerPicture } from '../../utils/project';

const KeyBindings = ({ children, state, dispatch, callbacks }) => {
    const keyPressed = useKeyboard();
    const { annotations, selectedSpeaker,
        speakers, selectedCamera, selectedFrame } = state;
    const selectedAnnotations = annotations[state.selectedFrame];
    const { onEdit } = callbacks;
    const project = useContext(ProjectContext).project;

    useEffect(() => { ( async function() {
        switch (keyPressed) {
            // Delete annotation on delete keypress
            case DELETE:
                dispatch({
                    type: REMOVE_ANNOTATION,
                    value: selectedAnnotations.findIndex(
                        ann => ann.speaker.id === selectedSpeaker.id)
                })
                break;
            // Blur
            case ESCAPE:
                dispatch({
                    type: SET_SELECTED_SPEAKER,
                    value: null
                })
                break
            case E_KEY:
                onEdit(state.selectedSpeaker);
                break;
            case P_KEY:
                console.log(project.basePath)
                const url = await createSpeakerPicture({
                    project: project.basePath,
                    speaker: selectedSpeaker,
                    picture: project.frame(selectedCamera, selectedFrame),
                    annotation: selectedAnnotations.find(
                        an => an.speaker.id === selectedSpeaker.id)
                });
                dispatch({
                    type: SET_PICTURE,
                    value: {
                        speaker: selectedSpeaker,
                        url
                    }
                })
                break;
            case ONE_KEY:
            case TWO_KEY:
            case THREE_KEY:
            case FOUR_KEY:
                dispatch({
                    type: SET_SELECTED_SPEAKER,
                    value: speakers[keyPressed - ONE_KEY]
                })
                break;
        }
    })()}, [keyPressed]);

    return (<React.Fragment>{ children }</React.Fragment>);
}

export default KeyBindings;