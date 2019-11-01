import annotation from './annotation';
import speaker from './speaker';
import project from './project';
import { UNDO_ACTION } from '../constants/actionTypes';

class HistoryManager {

    constructor(depth) {
        this.depth = depth;
        this.history = [];
        this.shouldSaveNext = true;
        this.startState = null;
        this.currentLookBack = 0;
        this.undoing = false;
    }

    registerStartState(state) {
        this.startState = state;
        this.shouldSaveNext = true;

        // User can call the returned function
        // to prevent it being added to the history.
        // For example we wont want to undo speaker selection
        return () => {
            this.shouldSaveNext = false;
        };
    }

    registerEndState(state) {

        if (!this.undoing) {
            const index = this.history.length-this.currentLookBack;
            this.history.splice(index);
            this.currentLookBack = 0;
        }

        this.undoing = false;

        if (!this.shouldSaveNext) {
            if (this.undoing) {
                this.currentLookBack += 1;
            }

            this.history.push(JSON.parse(JSON.stringify(state)));
            if (this.history.length > this.depth) {
                this.history.splice(0, 1);
            }
        }
        
    }

    undo() {
        const state = this.history[this.history.length-1-this.currentLookBack];


        this.currentLookBack += 1;
        this.undoing = true;

        if (!state) {
            return this.history[0];
        }

        return state;
    }

}

const UNDO_DEPTH = 30;
const history = new HistoryManager(UNDO_DEPTH);

export default (state, action) => {

    if (action.type === UNDO_ACTION) {
        return history.undo();
    }
    const preventHistory = history.registerStartState(state);

    const responses = Object.assign(...[
        annotation, speaker, project
    ]);

    if (typeof responses[action.type] === 'function') {
        const newState = responses[action.type](state, action.value, preventHistory);
        history.registerEndState(state);
        return newState;
    }

    console.error(`Unkown action type: ${action.type}`)
};

