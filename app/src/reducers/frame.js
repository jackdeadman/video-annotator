import annotation from './annotation';
import speaker from './speaker';
import project from './project';

export default (state, action) => {
    console.log(state, action)
    const responses = Object.assign(...[
        annotation, speaker, project
    ]);

    if (typeof responses[action.type] === 'function') {
        return responses[action.type](state, action.value);
    }

    console.error(`Unkown action type: ${action.type}`)
};

