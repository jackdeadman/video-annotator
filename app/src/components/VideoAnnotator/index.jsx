import React, { useState, useEffect } from 'react';
import styles from './styles.css';

import { useMouseDrag } from '../../hooks/mouse';
import { isEqualObjects } from '../../utils';

import DragGuide from '../../components/DragGuide';

const canvasRef = React.createRef();

/**
 * Video: Path to the video we are editing
 * Current: Position in the video
 * Annotations in the video
 * Annotating: person we are currently annotating
 */
const VideoAnnotator = function({ video, current, annotations, annotating }) {
    const [ boxes, setBoxes ] = useState(generateBoxes(annotations));
    const { mousePosition, dragging } = useMouseDrag(canvasRef.current);

    useEffect(function() {
        // Check if it is actually a drag opposed to a click
        if (!isEqualObjects(mousePosition.start, mousePosition.end)) {
            // Finished dragging
        }
    }, [ dragging ]);

    return (
        <div ref={canvasRef} className={styles.drawer}>
            { dragging && <DragGuide { ...mousePosition }/> }
        </div>
    );
};

export default VideoAnnotator;

const generateBoxes = annotations => {
    return annotations;
};
