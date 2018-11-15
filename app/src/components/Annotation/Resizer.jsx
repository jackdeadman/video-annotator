import React, { useRef, useEffect } from 'react';
import classNames from 'classnames';
import styles from './styles.css';
import { useMouseDrag } from '../../hooks/mouse';

const Handle = function({index, onResize}) {
    const handle = useRef();
    const { mousePosition, dragging } = useMouseDrag(handle.current);

    console.log(mousePosition)

    useEffect(() => {
        if (!dragging) {

            // onResize(index, mousePosition);
        }
    }, dragging);

    return (
        <div ref={handle}
            className={classNames(styles['handle'+(index+1)], styles.handle)}>
        </div>
    );
};

const Resizer = function({start, end, onResize, corners=4}) {
    const resizer = useRef();

    return (
        <div className={styles.resizer}>
            { [...Array(corners).keys()].map(index => 
                <Handle key={index} index={index}
                    onResize={onResize}/>
            ) }
        </div>
    )
};

export default Resizer;