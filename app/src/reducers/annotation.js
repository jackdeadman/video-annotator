import {
    ADD_ANNOTATION,
    UPDATE_ANNOTATION,
    MOVE_ANNOTATION_TO_FRONT,
    REMOVE_ANNOTATION,
    SET_SPEAKER_META_DATA
} from '../constants/actionTypes';

const responses = {
    
    [UPDATE_ANNOTATION](state, { index, updated }) {
        const frame = state.selectedFrame;
        const annotations = state.annotations[frame];
        
        const updatedAnnotations = Object.assign([], annotations, {
            [index]: { ...annotations[index], ...updated }
        });
        
        return {
            ...state,
            annotations: Object.assign(state.annotations, { [frame]: updatedAnnotations })
        };
    },

    [ADD_ANNOTATION](state, annotation) {
        const frame = state.selectedFrame;
        const newState = { ...state,
            annotations: Object.assign(state.annotations,
                    { [frame]: (state.annotations[frame] || []).concat([annotation])}
                )
        };
        return newState;
    },

    [MOVE_ANNOTATION_TO_FRONT](state, index, preventHistory) {
        preventHistory();
        const frame = state.selectedFrame;
        const annotations = [...state.annotations[frame]];
        annotations.push(annotations.splice(index, 1)[0]);
        
        return {
            ...state,
            annotations: Object.assign(state.annotations, { [frame]: annotations })
        };
    },

    [REMOVE_ANNOTATION](state, index) {
        const frame = state.selectedFrame;
        const annotations = [...state.annotations[frame]];

        if (index >= 0) {
            annotations.splice(index, 1);
        }

        return {
            ...state,
            annotations: Object.assign(state.annotations, { [frame]: annotations })
        };
    },

    [SET_SPEAKER_META_DATA](state, { speaker, meta }) {

        const { annotations, selectedFrame } = state;
        const selectedAnnotations = annotations[selectedFrame];
        const index = selectedAnnotations.findIndex(ann => ann.speaker.id === speaker.id);

        const updatedAnnotations = [...selectedAnnotations];
        updatedAnnotations[index] = {
            ...updatedAnnotations[index],
            meta
        };

        return {
            ...state,
            annotations: {
                ...annotations,
                [selectedFrame]: updatedAnnotations
            }
        };
    }
};

export default responses;