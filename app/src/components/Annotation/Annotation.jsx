import React, { useEffect, useState, useRef } from 'react';
import className from 'classnames';

import styles from './styles.css';
import { calcBoxStyles, insideBox, resizeBox } from './helpers';
import { useMouseDrag } from '../../hooks/mouse';
import { diff, add } from '../../utils';
import Resizer from './Resizer';
import { useChange } from '../../hooks';

const Annotation = function({
        index, start, end, speaker, canvas,
        onChange, selectedSpeaker, onSelect,
        mouthPos
    }) {

    const ref = useRef();
    let { mousePosition, dragging } = useMouseDrag(ref.current);
    const box = { start, end };
    let selected = speaker.id === (selectedSpeaker || {}).id;

    const handleResize = (newBox) => {

        if (JSON.stringify(box) !== JSON.stringify(newBox)) {
            onChange({
                ...newBox, speaker
            });
        }
    };


    const handleMouseDown = () => {
        onSelect(index);
    }

    return (
        <div
            ref={ref}
            onMouseDown={handleMouseDown}
            className={className({
                [styles.invisible]: dragging,
                [styles['has-mouth-position']]: mouthPos != null
            }, styles.annotation)}
            style={{
                background: '#ccc !important',
                ...calcBoxStyles(box, speaker.color)
            }}>
            { ((dragging || selected)) && <Resizer {...box} onResize={handleResize}
                                                            canvas={canvas}
                                                            color={speaker.color}
                                                            translatePoints={mousePosition}
                                                            translating={dragging}/> }
        </div>
    );
};

export default Annotation
