import { writeFile } from '../utils';

export class Annotations {

    constructor(path, json) {
        this.path = path;
        this.json = json;
    }

    get speakers() {
        return this.json.speakers;
    }

    get markers() {
        return this.json.markers;
    }

    set markers(markers) {
        this.json.markers = markers;
    }

    async save() {
        await writeFile(this.path, JSON.stringify(this.json));
    }


}

export class EmptyAnnotations extends Annotations {

    constructor(path) {
        super(path, {
            speakers: [],
            markers: []
        });
    }
}