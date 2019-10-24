import {
    SET_SELECTED_CAMERA, SET_SELECTED_FRAME, SET_PICTURE
} from '../constants/actionTypes';

const responses = {

    [SET_SELECTED_CAMERA](state, selectedCamera) {
        return { ...state, selectedCamera };
    },

    [SET_SELECTED_FRAME](state, selectedFrame) {
        return { ...state, selectedFrame };
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