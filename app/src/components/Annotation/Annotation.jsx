import React, { useEffect, useState, useRef } from 'react';

import styles from './styles.css';
import { calcBoxStyles, insideBox, resizeBox } from './helpers';
import { useMouseDrag } from '../../hooks/mouse';
import { diff, add } from '../../utils';
import Resizer from './Resizer';

const Annotation = function({ index, start, end, speaker, canvas, onChange, selectedSpeaker, onSelect }) {
    const ref = useRef();
    // We want the mouse position but not the dragging. Using the mosue
    let { mousePosition, dragging } = useMouseDrag(ref.current);
    // const [ dragging, setDragging ] = useState(false);
    const box = { start, end };
    let selected = speaker.id === (selectedSpeaker || {}).id;

    // State
    // const { mousePosition, dragging } = useMouseDrag(canvas);

    const handleResize = (box) => {
        onChange({
            ...box, speaker
        });
    };

    // if (dragging) {
    //     selected = true;
    // }

    return (
        <div
            ref={ref}
            onMouseDown={() => onSelect(index)}
            className={styles.annotation}
            // onMouseDown={handleMouseDown}
            style={calcBoxStyles(box, speaker.color)}>
            { (dragging || selected) && <Resizer {...box} onResize={handleResize}
                                                            canvas={canvas}
                                                            color={speaker.color}
                                                            translatePoints={mousePosition}
                                                            translating={dragging}/> }
        </div>
    );
};

export default Annotation
