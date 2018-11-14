import React, { useEffect, useState } from 'react';

import styles from './styles.css';
import { calcBoxStyles, insideBox, insideBox2 } from './helpers';
import { useMouseDrag } from '../../hooks/mouse';
import { diff, add } from '../../utils';
import Resizer from './Resizer';
import { setServers } from 'dns';


const Annotation = function({ start, end, speaker, canvas, onChange, selectedSpeaker, onSelect }) {
    const box = { start, end };
    const selected = speaker.color === selectedSpeaker.color;

    // State
    const { mousePosition, dragging } = useMouseDrag(canvas);
    const isDraggingBox = selected && dragging && insideBox(box, mousePosition.end);
    const [ draggingThisBox, setDraggingThisBox ] = useState(isDraggingBox);


    useEffect(() => {
        // Finished when we are no longer dragging the box
        const finishedDrag = !isDraggingBox
        
        if (finishedDrag && draggingThisBox) {
            onChange({
                ...translateBox(box, mousePosition),
                speaker
            })
        }

        // If we have not finished dragging the box, we are still dragging
        setDraggingThisBox(!finishedDrag);
    }, [ dragging ]);

    let customStyles = calcBoxStyles(box, speaker.color);

    if (draggingThisBox) {
        const updatedBox = translateBox(box, mousePosition);
        customStyles = calcBoxStyles(updatedBox, speaker.color)
    }

    return (
        <div
            className={styles.annotation}
            style={customStyles}
            onClick={() => onSelect(speaker)}>
            { selected && <Resizer  {...box} /> }
        </div>
    );
};


const translateBox = function(box, mousePosition) {
    let newBox = {...box};
    const movement = diff(mousePosition.end, mousePosition.start);
    newBox.start = add(movement, { ...box.start });
    newBox.end = add(movement, box.end);
    return newBox;
}

export default Annotation
