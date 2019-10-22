import React, { useEffect } from 'react';

import { REMOVE_ANNOTATION, SET_SELECTED_SPEAKER } from '../../constants/actionTypes';
import {
    DELETE, ESCAPE, E_KEY,
    ONE_KEY, TWO_KEY, THREE_KEY, FOUR_KEY
} from '../../constants/keycodes';
import { useKeyboard } from '../../hooks/keyboard';

const KeyBindings = ({ children, state, dispatch, callbacks }) => {
    const keyPressed = useKeyboard();
    const { annotations, selectedSpeaker, speakers } = state;
    const selectedAnnotations = annotations[state.selectedFrame];
    const { onEdit } = callbacks;

    // TODO: Add keybindings to hide all but selected

    useEffect(function() {
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
            case ONE_KEY:
            case TWO_KEY:
            case THREE_KEY:
            case FOUR_KEY:
                dispatch({
                    type: SET_SELECTED_SPEAKER,
                    value: speakers[keyPressed-ONE_KEY]
                })
                break;
        }
    }, [keyPressed]);

    return (<React.Fragment>{ children }</React.Fragment>);
}

export default KeyBindings;