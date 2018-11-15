import annotation from './annotation';
import speaker from './speaker';

export default (state, action) => {
    const responses = Object.assign(...[
        annotation, speaker
    ]);

    if (typeof responses[action.type] === 'function') {
        return responses[action.type](state, action.value);
    }

    console.error(`Unkown action type: ${action.type}`)
};

