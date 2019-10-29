import React, { useEffect, useContext } from 'react';

import { REMOVE_ANNOTATION, SET_SELECTED_SPEAKER, SET_PICTURE, UNDO_ACTION, SET_SELECTED_FRAME } from '../../constants/actionTypes';
import {
    DELETE, ESCAPE, E_KEY, P_KEY,
    ONE_KEY, TWO_KEY, THREE_KEY, FOUR_KEY, Z_KEY, LEFT_KEY, RIGHT_KEY, S_KEY
} from '../../constants/keycodes';
import { useKeyboard } from '../../hooks/keyboard';
import { ProjectContext } from '../../constants/contexts';
import { createSpeakerPicture } from '../../utils/project';
import path from 'path';

const KeyBindings = ({ children, state, dispatch, callbacks }) => {
    const { keyCode, ctrlKey } = useKeyboard();
    const { annotations, selectedSpeaker,
        speakers, selectedCamera, selectedFrame } = state;
    const selectedAnnotations = annotations[selectedCamera][selectedFrame];
    const { onEdit } = callbacks;
    const project = useContext(ProjectContext).project;

    useEffect(() => { ( async function() {


        if (ctrlKey) {

            switch (keyCode) {
                
                case Z_KEY:
                    dispatch({ type: UNDO_ACTION });
                    break
                
                case S_KEY:
                    await project.save();
                    alert('Saved...')
                    break
            }

        } else {
            switch (keyCode) {
                // Delete annotation on delete keypress
                case DELETE:
                    const index = selectedAnnotations.findIndex(
                        ann => ann.speaker.id === selectedSpeaker.id);
                    if (index >= 0) {
                        dispatch({
                            type: REMOVE_ANNOTATION,
                            value: index
                        })
                    }
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
                    const url = await createSpeakerPicture({
                        project: project.basePath,
                        speaker: selectedSpeaker,
                        picture: project.frame(selectedCamera, selectedFrame),
                        annotation: selectedAnnotations.find(
                            an => an.speaker.id === selectedSpeaker.id)
                    });

                    await project.saveSpeakerPictureUpdate(selectedSpeaker, url);

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
                        value: speakers[keyCode - ONE_KEY]
                    })
                    break;
                case LEFT_KEY:
                    var frames = await project.frames(selectedCamera)
                    var frameIndex = frames.findIndex(f => f.number === selectedFrame);

                    var newFrame = Math.max(0, frameIndex-1);

                    dispatch({
                        type: SET_SELECTED_FRAME,
                        value: frames[newFrame].number
                    });
                    break

                case RIGHT_KEY:
                    var frames = await project.frames(selectedCamera)
                    var frameIndex = frames.findIndex(f => f.number === selectedFrame);

                    var newFrame = Math.min(frames.length-1, frameIndex+1);

                    dispatch({
                        type: SET_SELECTED_FRAME,
                        value: frames[newFrame].number
                    });
                    break
            }
        }
    })()}, [keyCode]);

    return (<React.Fragment>{ children }</React.Fragment>);
}

export default KeyBindings;