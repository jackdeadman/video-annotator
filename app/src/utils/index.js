import fs from 'fs';
import util from 'util';

export const readFile = util.promisify(async (file, cb) => fs.readFile(file, 'utf-8', cb));

export const waitFor = util.promisify(async (time, cb) => setTimeout(cb, time));