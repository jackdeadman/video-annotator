import {
    ADD_ANNOTATION,
    UPDATE_ANNOTATION,
    MOVE_ANNOTATION_TO_FRONT,
    REMOVE_ANNOTATION
} from '../constants/actionTypes';

const responses = {
    
    [UPDATE_ANNOTATION](state, { index, updated }) {
        const annotations = state.annotations;
        const updatedAnnotations = Object.assign([], annotations, {
            [index]: { ...annotations[index], ...updated }
        });
        return { ...state, annotations: updatedAnnotations };
    },

    [ADD_ANNOTATION](state, annotation) {
        return { ...state,
            annotations: (state.annotations || []).concat([annotation]) };
    },

    [MOVE_ANNOTATION_TO_FRONT](state, index) {
        const annotations = [...state.annotations];
        annotations.push(annotations.splice(index, 1)[0]);
        
        return { ...state, annotations };
    },

    [REMOVE_ANNOTATION](state, index) {
        const annotations = [...state.annotations];
        annotations.splice(index, 1);

        return { ...state, annotations };
    }

};

export default responses;