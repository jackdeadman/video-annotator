import React, { useEffect } from 'react';

import { REMOVE_ANNOTATION, SET_SELECTED_SPEAKER } from '../../constants/actionTypes';
import { DELETE, ESCAPE, E_KEY } from '../../constants/keycodes';
import { useKeyboard } from '../../hooks/keyboard';

const KeyBindings = ({ children, state, dispatch, callbacks }) => {
    const keyPressed = useKeyboard();
    const { annotations, speaker } = state;
    const selectedAnnotations = annotations[state.selectedFrame];
    const { onEdit } = callbacks;

    useEffect(function() {
        switch (keyPressed) {
            // Delete annotation on delete keypress
            case DELETE:
                dispatch({
                    type: REMOVE_ANNOTATION,
                    value: selectedAnnotations.findIndex(ann => ann.speaker === speaker)
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
        }
    }, [keyPressed]);

    return (<React.Fragment>{ children }</React.Fragment>);
}

export default KeyBindings;