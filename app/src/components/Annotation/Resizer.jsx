import React, { useRef, useEffect, useState, useContext } from 'react';
import classNames from 'classnames';
import styles from './styles.css';
import { useMousePositionRelative } from '../../hooks/mouse';
import { isEqualObjects, diff } from '../../utils';
import { CanvasContext } from '../../constants/contexts';
import { calcResizeStyles, resizeBox, calcTranslateStyles, translateBox } from '../../components/Annotation/helpers';
import { useChange } from '../../hooks';

const Handle = function({ index, onDragStart, selected, scale }) {
    const handle = useRef();

    return (
        <div ref={handle} onMouseDown={() => onDragStart(index)}
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
    const [ selected, setSelected ] = useState(null);
    const selectedRef = useRef(selected);
    const mousePosition = useMousePositionRelative(canvas.current, scale);
    const [ dragging, setDragging ] = useState(false);
    const mouseStartRef = useRef(mousePosition)

    const dragStart = function(index) {
        setSelected(index);
        selectedRef.current = index;
        mouseStartRef.current = mousePosition;
    }

    useEffect(() => {
        setDragging(selected !== null);
    }, [selected]);

    useEffect(() => {
        function handleMouseUp() {
            setSelected(null);
        }
        window.addEventListener('mouseup', handleMouseUp);
        return () => window.removeEventListener('mouseup', handleMouseUp);
    }, []);

    useChange(() => {
        if (!dragging) {
            onResize(resizeBox({
                originalBox: { start, end },
                change: {
                    start: mouseStartRef.current,
                    end: mousePosition
                }
            }, selectedRef.current));
        }
    }, [ dragging ]);


    let customStyles = {};
    if (dragging && (selected !== null)) {
        customStyles = calcResizeStyles({
            originalBox: { start, end },
            change: {
                start: mouseStartRef.current,
                end: mousePosition
            }
        }, selected, color);
    }

    if (translating && !dragging) {
        customStyles = calcTranslateStyles({
            originalBox: { start, end },
            change: translatePoints
        }, color);
    }

    useChange(() => {
        if (!dragging) {
            onResize(translateBox({
                originalBox: { start, end },
                change: translatePoints
            }));
        }
    }, [ translating ]);

    return (
        <section className={styles.resizer} style={customStyles}>
            { [...Array(corners).keys()].map(index => 
                <Handle key={index} index={index}
                    selected={selected==index}
                    onDragStart={dragStart} scale={1/scale}/>
            ) }
        </section>
    )
};

export default Resizer;