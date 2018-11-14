import React, { useEffect, useState } from 'react';

import styles from './styles.css';
import { calcBoxStyles, insideBox, insideBox2 } from './helpers';
import { useMouseDrag } from '../../hooks/mouse';
import { diff, add } from '../../utils';


const Annotation = function({ start, end, speaker, canvas, onChange }) {
    const box = { start, end };
    // State
    const { mousePosition, dragging } = useMouseDrag(canvas);
    const [ draggingThisBox, setDraggingThisBox ] = useState(isDraggingBox(dragging, box, mousePosition));

    useEffect(() => {
        // Finished when we are no longer dragging the box
        const finishedDrag = !isDraggingBox(dragging, box, mousePosition)
        
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

    return <div className={styles.annotation} style={customStyles}></div>
};


const isDraggingBox = function(dragging, box, mousePosition) {
    return dragging && insideBox(box, mousePosition.end);
}

const translateBox = function(box, mousePosition) {
    let newBox = {...box};
    const movement = diff(mousePosition.end, mousePosition.start);
    newBox.start = add(movement, { ...box.start });
    newBox.end = add(movement, box.end);
    return newBox;
}

















const Annotation2 = function({ start, end, speaker, canvas, onChange }) {
    let customStyles = calcBoxStyles(start, end, speaker.color);
    const { mousePosition, dragging } = useMouseDrag(canvas);
    // const draggingBox = dragging && insideBox({start, end}, mousePosition.end)

    let draggingBox = false;

    if (dragging) {
        if (insideBox({start, end}, mousePosition.end)) {
            draggingBox = true;
        }

        const change = diff(mousePosition.end, mousePosition.start);
        const foo = {
            ...customStyles,
            x: customStyles.left + change.x,
            y: customStyles.top + change.y
        }
        if (insideBox2(foo, mousePosition.end)) {
            draggingBox = true;
        }
    }

    useEffect(() => {
        if (draggingBox) {
            // Started drag
        } else {
            // Finished drag
            const change = diff(mousePosition.end, mousePosition.start);
            const foo = { ...customStyles,
                left: customStyles.left + change.x,
                top: customStyles.top + change.y
            };

            onChange({
                start: { x: foo.left, y: foo.top },
                end: { x: foo.left + foo.width, y: foo.top + customStyles.height },
                speaker
            })
        }
    }, [draggingBox]);

    if (draggingBox) {
        const change = diff(mousePosition.end, mousePosition.start);
        customStyles.left += change.x;
        customStyles.top += change.y;
        return <div className={styles.annotation} style={customStyles}>Moving</div>
    } else {
        return <div className={styles.annotation} style={customStyles}></div>
    }

}

export default Annotation
