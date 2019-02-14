import {
    SET_SELECTED_CAMERA,
} from '../constants/actionTypes';

const responses = {

    [SET_SELECTED_CAMERA](state, selectedCamera) {
        console.log('Called')
        return { ...state, selectedCamera };
    }

};

export default responses;