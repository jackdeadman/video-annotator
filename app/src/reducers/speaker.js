import {
    SET_SELECTED_SPEAKER,
    SET_SPEAKER_COLOR
} from '../constants/actionTypes';

const responses = {

    [SET_SELECTED_SPEAKER](state, selectedSpeaker, preventHistory) {
        preventHistory();
        return { ...state, selectedSpeaker };
    },

    [SET_SPEAKER_COLOR](state, { index, color }) {
        const { speakers } = state;
        const speaker = speakers[index];

        const updatedSpeaker = Object.assign(speaker, { color });
        const updatedSpeakers = Object.assign([], speakers, {
            [index]: updatedSpeaker
        });

        return { ...state, speakers: updatedSpeakers};
    }
};

export default responses;