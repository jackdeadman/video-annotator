import React, { useRef, useEffect, useState, useContext, useCallback } from 'react';
import classNames from 'classnames';
import styles from './styles.css';
import { useMousePositionRelative } from '../../hooks/mouse';
import { isEqualObjects, diff } from '../../utils';
import { CanvasContext } from '../../constants/contexts';
import { calcResizeStyles, resizeBox, calcTranslateStyles, translateBox } from '../../components/Annotation/helpers';
import { useChange } from '../../hooks';

const Handle = function({ index, onDragStart, selected, scale, onMouseUp }) {
    const handle = useRef();

    return (
        <div ref={handle} onMouseDown={() => onDragStart(index)} onMouseUp={onMouseUp}
            style={{ transform: `scale(${scale})` }}
            className={classNames(
                styles['handle'+(index+1)], styles.handle, {
                    [styles.selected]: selected
                })}
        >
            <div className={styles.handle__visible}></div>
        </div>
    );
};

const Resizer = function({ start, end, onResize, corners=4,
    translating, translatePoints, color, scale=1 }) {
    const canvas = useContext(CanvasContext);

    let customStyles = {};
    const [ selected, setSelected ] = useState(null);
    const mousePosition = useMousePositionRelative(canvas.current, scale)

    const [ startPos, setStartPos ] = useState(null);
    const mousePositionRef = useRef(mousePosition);

    useEffect(() => { mousePositionRef.current = mousePosition }, [ mousePosition ]);
    
    function dragStart(index) {
        setSelected(index);
        setStartPos(mousePosition)
    }


    if (selected != null) {
        customStyles = calcResizeStyles({
            originalBox: { start, end },
            change: {
                start: startPos,
                end: mousePosition
            }
        }, selected, color);
    }

    if (translating && (selected == null)) {
        customStyles = calcTranslateStyles({
            originalBox: { start, end },
            change: translatePoints
        }, color);
    }


    const handleMouseUp = useCallback(() => {
        // handle translating
        if ((selected == null) && translating) {
            onResize(translateBox({
                originalBox: { start, end },
                change: translatePoints
            }));
        // Handle resizing
        } else if (startPos) {
            onResize(resizeBox({
                originalBox: { start, end },
                change: {
                    start: startPos,
                    end: mousePosition
                }
            }, selected));
        }
        setSelected(null);
        setStartPos(null);
    }, [ selected, mousePosition, startPos, start, end, translatePoints, translating ])

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, [ selected, mousePosition, startPos, start, end, translatePoints, translating ]);


    return (
        <section className={styles.resizer} style={customStyles}
            onMouseUp={handleMouseUp}
        >
            { [...Array(corners).keys()].map(index => 
                <Handle key={index} index={index}
                    selected={selected==index}
                    onMouseUp={handleMouseUp}
                    onDragStart={dragStart} scale={1/scale}/>
            ) }
        </section>
    )
};

export default Resizer;