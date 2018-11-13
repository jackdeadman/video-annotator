import fs from 'fs';
import util from 'util';

export const readFile = util.promisify(async (file, cb) => fs.readFile(file, 'utf-8', cb));

export const waitFor = util.promisify(async (time, cb) => setTimeout(cb, time));
export const isEqualObjects = function(obj1, obj2) {
    const keys = Object.keys;
    const entries = Object.entries;

    // Check if they have the same amount of keys
    if (keys(obj1).length !== keys(obj2).length) {
        return false;
    }

    // Check if all the keys are identical
    for (let [ key, value ] of entries(obj1)) {
        if (obj2[key] !== value) {
            return false
        }
    }

    return true;
};

export const flip = function(fn) {
    return function(...args) {
        args.reverse();
        return fn(...args)
    }
}