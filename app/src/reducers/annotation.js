import {
    ADD_ANNOTATION,
    UPDATE_ANNOTATION,
    MOVE_ANNOTATION_TO_FRONT,
    REMOVE_ANNOTATION,
    SET_SPEAKER_META_DATA
} from '../constants/actionTypes';
import { removeItem } from '../utils/immutable';

const updateAnnotations = (state, fn) => {

    const { selectedFrame, selectedCamera, annotations } = state;
    
    let selectedAnnotations = annotations[selectedCamera][selectedFrame.number] || [];

    return {
        ...state,
        annotations: {
            ...annotations,
            [selectedCamera]: {
                ...annotations[selectedCamera],
                [selectedFrame.number]: fn(selectedAnnotations)
            }
        }
    };
}


const responses = {
    
    [UPDATE_ANNOTATION](state, { index, updated }) {
        return updateAnnotations(state, annotations => (
            Object.assign(annotations, {
                [index]: { ...annotations[index], ...updated }
            })
        ));
    },

    [ADD_ANNOTATION](state, annotation) {

        return updateAnnotations(state, annotations => {
            // Ensure a speaker does not have two annotations.
            if (annotations.find(an => an.speaker.id == annotation.speaker.id)) {
                return annotations;
            }
            
            return [ ...annotations, annotation ]
        });
    },

    [MOVE_ANNOTATION_TO_FRONT](state, index, preventHistory) {
        preventHistory();
        return updateAnnotations(state, annotations => (
            [ ...removeItem(annotations, index), annotations[index] ]
        ));
    },

    [REMOVE_ANNOTATION](state, index) {
        return updateAnnotations(state, annotations => (
            removeItem(annotations, index)
        ));
    },

    [SET_SPEAKER_META_DATA](state, { speaker, meta }) {
        return updateAnnotations(state, annotations => {
            const index = annotations.findIndex(an => an.speaker.id === speaker.id);

            return Object.assign(annotations, {
                [index]: {
                    ...annotations[index],
                    meta
                }
            });
        });
    }
};

export default responses;