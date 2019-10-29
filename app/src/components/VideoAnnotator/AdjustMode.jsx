import React, { useState, useRef, useContext }  from 'react'
import { ProjectContext } from '../../constants/contexts';
import styles from './styles.css';
import { calcBoxStyles } from '../Annotation/helpers';
import Resizer from '../Annotation/Resizer';
import classNames from 'classnames';
import Point from './Point';


const AdjustMode = function ({ store, onChange }) {


    const [ scale, setScale ] = useState(4);
    // const [ mouthPos, setMouthPos ] = useState(null);

    function denormaliseAnnotations(annotations) {
        let givenList = true;
        if (!annotations.length) {
            annotations = [ annotations ];
            givenList = false;
        }

        const global = annotations.map(ann => ({
            ...ann,
            start: {
                x: ann.start.x * 1920,
                y: ann.start.y * 1080
            },
            end: {
                x: ann.end.x * 1920,
                y: ann.end.y * 1080
            }
        }));

        // Only return a list if a list was given
        return givenList ? global : global[0];
    }

    const { state, dispatch } = store;
    const {
        annotations, selectedSpeaker, selectedFrame,
        selectedCamera
    } = state;

    const canvas = useRef();
    const { project } = useContext(ProjectContext);



    if (!selectedSpeaker) {
        return (
            <div className={classNames(styles['adjust-image'], styles['no-speaker'])}>
                No speaker selected.
            </div>)
    }

    const index = annotations[selectedCamera][selectedFrame].findIndex(ann => (
        ann.speaker.id === selectedSpeaker.id
    ));

    const selectedAnnotation = annotations[selectedCamera][selectedFrame][index];

    if (!selectedAnnotation) {
        return (
            <div className={classNames(styles['adjust-image'], styles['no-speaker'])}>
                Selected speaker has no annotations to adjust.
            </div>)
    }

    const { width, height, top, left } = calcBoxStyles(selectedAnnotation);

    const cropStyles = {
        width: width * 1920,
        height: height * 1080,
        backgroundImage: `url(${project.frame(selectedCamera, selectedFrame)})`,
        backgroundPosition: `-${left*1920}px -${top*1080}px`,
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'black',
        margin: '200px auto',
        position: 'relative',
        transform: `scale(${scale})`
    };

    const handleResize = ({ start, end }) => {
        onChange(index, {
            start: { x: start.x / 1920, y: start.y / 1080 },
            end: { x: end.x / 1920, y: end.y / 1080 },
            selectedSpeaker
        });

        // Need to redo mouth position if you resize
        selectedAnnotation.mouthPos = null;
    };

    function normalise(x, y) {
        return {
            x: x / (width * 1920),
            y: y / (height * 1080)
        };
    }

    function denormalise({x, y}) {
        return {
            x: x * width * 1920,
            y: y * height * 1080
        };
    }

    function handleClick(e) {
        // Avoid being triggered by the handles
        if (e.target.tagName === 'SECTION') {
            const rect = e.target.getBoundingClientRect();
            const x = (e.clientX - rect.left) / scale;
            const y = (e.clientY - rect.top) / scale;
            selectedAnnotation.mouthPos = normalise(x, y);
        }
    };


    return (
        <div ref={canvas} className={styles['adjust-image']}>
            <div style={cropStyles} onClick={handleClick}>
                <Resizer {...denormaliseAnnotations(selectedAnnotation)}
                        onResize={handleResize}
                        canvas={canvas}
                        color={'rgba(0,0,0,0.3'}
                        translating={false}
                        scale={scale}
                        />
                { selectedAnnotation.mouthPos && <Point {...denormalise(selectedAnnotation.mouthPos)}></Point> }
            </div>
            <label>Zoom: { scale }</label><br />
            <input value={scale} type="range" min="1" max="8" step="0.1" onChange={e => setScale(e.target.value)}/>
        </div>
    );
    
};

export default AdjustMode;