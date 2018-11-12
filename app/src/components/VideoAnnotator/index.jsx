import React, { useState, useEffect } from 'react';
import styles from './styles.css';

/**
 * Video: Path to the video we are editing
 * Position: Position in the video
 * Annotations in the video
 * Annotating: person we are currently annotating
 */

const generateBoxes = annotations => {
    return annotations;
};

const canvasRef = React.createRef();

const VideoAnnotator = function({ video, position, annotations, annotating }) {
    // return <video src={video} />
    const [ boxes, setBoxes ] = useState(generateBoxes(annotations));

    useEffect(function() {
        // console.log(canvasRef)
    });

    console.log('Rendering')

    return <canvas ref={canvasRef} className={styles.drawer}></canvas>
};

export default VideoAnnotator;