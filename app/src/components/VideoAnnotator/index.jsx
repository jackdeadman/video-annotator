import React, { useState, useEffect } from 'react';
import styles from './styles.css';

import { useMouseDrag } from '../../hooks/mouse';
import { useCollection } from '../../hooks/collection';
import { isEqualObjects } from '../../utils';

import { Annotation, DragGuide } from '../../components/Annotation';
import { insideBox, normalise } from '../../components/Annotation/helpers';

const canvasRef = React.createRef();

/**
 * video: Path to the video we are editing
 * current: Position in the video
 * annotations in the video
 * speaker: person we are currently annotating (may be null)
 * onSelect: event fired when user selects an annotation
 */
const VideoAnnotator = function({ video, current, labels, speaker, onSelect }) {
    const {
        items: annotations,
        addItem: addAnnotation,
        updateItem: updateAnnotation
     } = useCollection([]);
    
    const { mousePosition, dragging } = useMouseDrag(canvasRef.current, [
        // Constraints
        // - Can't start dragging from inside a box
        position => !annotations.some(ann => insideBox(ann, position)),
        // - Can't annotate a person twice
        _ => !annotations.some(ann => ann.speaker === speaker)
    ]);

    useEffect(function() {
        // Check if it is actually a drag opposed to a click
        if (!isEqualObjects(mousePosition.start, mousePosition.end) && !dragging) {
            // Finished dragging
            if (speaker) {
                console.log(annotations.findIndex((e) => e.speaker.color === speaker.color))
                addAnnotation({ ...normalise(mousePosition), speaker });
            }
        }
    }, [ dragging ]);

    const handleAnnotationChange = function(index, updated) {
        updateAnnotation(index, updated);
    }

    return (
        <div ref={canvasRef} className={styles.drawer}>
            { speaker && dragging && <DragGuide { ...mousePosition } color={speaker.color} /> }
            { annotations.map((annotation, id) => 
                <Annotation
                    key={id} {...annotation}
                    canvas={canvasRef.current}
                    selectedSpeaker={speaker}
                    onSelect={onSelect}
                    onChange={change => handleAnnotationChange(id, change)}
                />
            ) }
            <video src={video}/>
        </div>
    );
};

export default VideoAnnotator;
