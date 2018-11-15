import React from 'react';

import styles from './styles.css';
import { calcBoxStyles, clamp } from './helpers';

const DragGuide = function({ start, end, color, canvas }) {
    const customStyle = clamp(calcBoxStyles({ start, end }, color), canvas);


    return (
        <div className={styles.guide} style={customStyle}>
        </div>
    );
}

export default DragGuide