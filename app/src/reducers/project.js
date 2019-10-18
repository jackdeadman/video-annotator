import {
    SET_SELECTED_CAMERA, SET_SELECTED_FRAME,
} from '../constants/actionTypes';

const responses = {

    [SET_SELECTED_CAMERA](state, selectedCamera) {
        return { ...state, selectedCamera };
    },

    [SET_SELECTED_FRAME](state, selectedFrame) {
        return { ...state, selectedFrame };
    }

};

export default responses;