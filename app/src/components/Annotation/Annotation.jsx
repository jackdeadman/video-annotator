import React, { useEffect, useState } from 'react';

import styles from './styles.css';
import { calcBoxStyles, insideBox } from './helpers';
import { useMouseDrag } from '../../hooks/mouse';
import { diff, add } from '../../utils';
import Resizer from './Resizer';

const Annotation = function({ index, start, end, speaker, canvas, onChange, selectedSpeaker, onSelect }) {
    const box = { start, end };
    const selected = speaker.color === (selectedSpeaker || {}).color;

    // State
    const { mousePosition, dragging } = useMouseDrag(canvas);
    const isDraggingBox = selected && dragging && insideBox(box, mousePosition.end, 10);
    const [ draggingThisBox, setDraggingThisBox ] = useState(isDraggingBox);


    useEffect(() => {
        // Finished when we are no longer dragging the box
        const finishedDrag = !isDraggingBox;
        
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

    const handleResize = function(corner, mousePosition) {
        resizeBox(box, mousePosition, corner);
    }

    return (
        <div
            className={styles.annotation}
            style={customStyles}
            onClick={() => onSelect(index)}>
            { selected && <Resizer  {...box} onResize={handleResize} /> }
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

const CORNERS = {
    TOP_LEFT: 0,
    TOP_RIGHT: 1,
    BOTTOM_RIGHT: 2,
    BOTTOM_LEFT: 3
};

const resizeBox = function(box, mousePosition, corner) {
    let newBox = {...box};
    const movement = diff(mousePosition.end, mousePosition.start);

    switch (corner) {
        case CORNERS.TOP_LEFT:
            newBox.start = add(movement, { ...box.start });
            break;
    }


    return newBox;
}

export default Annotation
