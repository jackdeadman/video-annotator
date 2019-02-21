import React, { useEffect } from 'react';

import { REMOVE_ANNOTATION, SET_SELECTED_SPEAKER } from '../../constants/actionTypes';
import { DELETE, ESCAPE } from '../../constants/keycodes';
import { useKeyboard } from '../../hooks/keyboard';

const KeyBindings = ({ children, state, dispatch }) => {
    const keyPressed = useKeyboard();
    const { annotations, speaker } = state;
    const selectedAnnotations = annotations[state.selectedFrame];

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
        }
    }, [keyPressed]);

    return (<React.Fragment>{ children }</React.Fragment>);
}

export default KeyBindings;