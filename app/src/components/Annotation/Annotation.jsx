import React from 'react';

import styles from './styles.css';
import { calcBoxStyles, insideBox } from './helpers';
import { useMousePositionRelative } from '../../hooks/mouse';

const Annotation = function({ start, end, speaker, canvas }) {
    let customStyles = calcBoxStyles(start, end, speaker.color);
    const position = useMousePositionRelative(canvas);

    if (insideBox({ start, end }, position)) {
        console.log('Inside');
        customStyles = { ...customStyles, cursor: 'grab' }
    }

    return (
        <div className={styles.annotation} style={customStyles}>
        </div>
    );
}

export default Annotation
