import React, { useEffect } from 'react';

import styles from './styles.css';
import { calcBoxStyles, insideBox, insideBox2 } from './helpers';
import { useMouseDrag } from '../../hooks/mouse';
import { diff } from '../../utils';

const Annotation = function({ start, end, speaker, canvas, onChange }) {
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
