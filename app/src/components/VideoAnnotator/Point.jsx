import React, { useRef } from 'react';
import styles from './styles.css';
import { useMouseDrag } from '../../hooks/mouse';
import { useChange } from '../../hooks';


const Point = function({ x, y }) {
    return (
        <div className={styles.point} style={{ left: x, top: y }}>
        </div>);

}


export default Point;