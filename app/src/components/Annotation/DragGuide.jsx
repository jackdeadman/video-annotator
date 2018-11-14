import React from 'react';

import styles from './styles.css';
import { calcBoxStyles } from './helpers';

const DragGuide = function({ start, end, color }) {
    const customStyle = calcBoxStyles({ start, end }, color);

    return (
        <div className={styles.guide} style={customStyle}>
        </div>
    );
}

export default DragGuide