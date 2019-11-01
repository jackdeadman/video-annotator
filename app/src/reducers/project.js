import {
    SET_SELECTED_CAMERA, SET_SELECTED_FRAME, SET_PICTURE, PREV_FRAME, SET_FRAME_STATUS
} from '../constants/actionTypes';

const responses = {

    [SET_SELECTED_CAMERA](state, selectedCamera, preventHistory) {
        preventHistory();
        return { ...state, selectedCamera };
    },

    [SET_SELECTED_FRAME](state, selectedFrame, preventHistory) {
        preventHistory();
        return { ...state, selectedFrame };
    },

    [SET_FRAME_STATUS](state, status) {
        return {
            ...state,
            selectedFrame: {
                ...state.selectedFrame,
                completed: status
            }
        };
    },

    [SET_PICTURE](state, { speaker, url }) {
        const index = state.speakers.findIndex(sp => sp.id === speaker.id);

        return { ...state,
            speakers: Object.assign(state.speakers, { [index]: {
                ...speaker,
                image: url
            } })
        };
    }

};

export default responses;