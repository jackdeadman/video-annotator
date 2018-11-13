import React from 'react';

import { flip } from '../../utils';
import styles from './styles.css';
import { defaultMaxListeners } from 'events';

const DragGuide = function({ start, end }) {
    const customStyle = {
        width: Math.abs(start.x - end.x),
        height: Math.abs(start.y - end.y),
        left: Math.min(start.x, end.x),
        top: Math.min(start.y, end.y)
    };
    
    return (
        <div className={styles.guide} style={customStyle}>
        </div>
    );
}

export default DragGuide
