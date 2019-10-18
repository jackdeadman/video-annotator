import React, { useEffect, useState } from 'react';

import styles from './styles.css';
import { calcBoxStyles, insideBox, resizeBox } from './helpers';
import { useMouseDrag } from '../../hooks/mouse';
import { diff, add } from '../../utils';
import Resizer from './Resizer';

const Annotation = function({ index, start, end, speaker, canvas, onChange, selectedSpeaker, onSelect }) {
    const box = { start, end };
    const selected = speaker.id === (selectedSpeaker || {}).id;

    // State
    const { mousePosition, dragging } = useMouseDrag(canvas);

    const handleResize = (box) => {
        console.log('Box to update')
        onChange({
            ...box, speaker
        });
    };


    return (
        <div
            className={styles.annotation}
            style={calcBoxStyles(box, speaker.color)}
            onClick={() => onSelect(index)}>
            { selected && <Resizer {...box} onResize={handleResize}
                                canvas={canvas}/> }
        </div>
    );
};

const translateBox = function(box, mousePosition) {
    let newBox = {...box};
    const movement = diff(mousePosition.end, mousePosition.start);
    newBox.start = add(movement, { ...box.start });
    newBox.end = add(movement, box.end);
    console.log(box, newBox)
    return newBox;
}

export default Annotation
