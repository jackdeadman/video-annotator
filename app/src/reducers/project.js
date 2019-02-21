import {
    SET_SELECTED_CAMERA, SET_SELECTED_FRAME,
} from '../constants/actionTypes';

const responses = {

    [SET_SELECTED_CAMERA](state, selectedCamera) {
        console.log('Called')
        return { ...state, selectedCamera };
    },

    [SET_SELECTED_FRAME](state, selectedFrame) {
        console.log('Selecting frame')
        return { ...state, selectedFrame };
    }

};

export default responses;