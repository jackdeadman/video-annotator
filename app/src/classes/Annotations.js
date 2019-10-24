import { writeFile, readFile } from '../utils';

class AnnotationSerializer {

    
    toObject(filecontents) {
        const object = JSON.parse(filecontents);
        const markers = object.markers;
        
        // Add the speaker object reference using the speaker_id field
        for (let [ frameNum, annotations ] of Object.entries(markers)) {
            markers[frameNum] = annotations.map(annotation => {
                return {
                    ...annotation,
                    speaker: object.speakers.find(sp => sp.id === annotation.speakerId)
                };
            });
        }
        console.log(object)
        return object;
    }

    toFileContents(object) {
        // naive clone
        object = JSON.parse(JSON.stringify(object));
        const markers = object.markers;
        // Remove the speaker object from the object as we just want to use the id.
        // Add the speaker object reference using the speaker_id field
        for (let [ frameNum, annotations ] of Object.entries(markers)) {
            markers[frameNum] = annotations.map(annotation => {
                // Whitelist of variables we want to store.
                const { start, end, speaker, mouthPos, meta } = annotation;
                console.log('DEBUG: ', annotations)
                return {
                    start, end, speakerId: speaker.id, mouthPos, meta: meta || {}
                };
            });
        }

        console.log(JSON.stringify(object))

        return JSON.stringify(object);
    }

}


export class Annotations {
    constructor(path) {
        this.path = path;
        this.serializer = new AnnotationSerializer();
    }

    async init() {
        const file = await readFile(this.path);
        this.json = this.serializer.toObject(file);
    }

    get speakers() {
        return this.json.speakers;
    }

    get markers() {
        console.log('JSON: ', this.json)
        return this.json.markers;
    }

    set markers(markers) {
        this.json.markers = markers;
    }

    set speakers(speakers) {
        this.json.speakers = speakers;
    }

    async save() {
        await writeFile(this.path, this.serializer.toFileContents(this.json));
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