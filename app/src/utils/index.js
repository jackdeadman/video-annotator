import fs from 'fs';
import util from 'util';

export const slugify = function(string) {
    return string.replace(' ', '_').toLowerCase()
}

export const readFile = util.promisify(async (file, cb) => fs.readFile(file, 'utf-8', cb));
export const writeFile = util.promisify(fs.writeFile);

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
};

export const diff = function(left, right) {
    return {
        x: left.x - right.x,
        y: left.y - right.y
    }
};

export const add = function(left, right) {
    return {
        x: left.x + right.x,
        y: left.y + right.y
    }
};

export const times = function(amount, fn) {
    Array.from(Array(amount)).forEach((_, i) => fn(i));
}

export const linspace = function(start, end, size) {
    const array = [];
    const step = (end - start) / (size - 1);

    times(size, i => array.push(start + (step * i)));
    return array;
}

export const object2array = function(obj) {
    return Object.entries(obj).map(([ key, value ]) => ({ key, value }) );
};

export const identity = x => x;
export const always = value => () => value;
export const alwaysTrue = always(true);
export const alwaysFalse = always(false);