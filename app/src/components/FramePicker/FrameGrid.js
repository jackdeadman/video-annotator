import React, { useContext } from 'react'
import PreviewImage from './PreviewImage';
import { LOADING } from '../../constants/symbols'

import styles from './styles.css'
import { EditorContext, ProjectContext } from '../../constants/contexts';

const FrameGrid = ({ frames, onSelect, selected }) => {

    if (frames == LOADING) {
        return <div>Loading...</div>
    }

    if (frames.length === 0) {
        return <div>No frames</div>
    }


    frames = frames.imageSets[frames.selected]
    console.log(frames)

    return (
        <div className={styles.grid}>
            { frames.map((frame) => (
                <div onClick={onSelect.bind(this, frame.number)} key={frame.number}
                        className={styles.framePreview}>
                    <PreviewImage src={`${frame.src}`}
                        frameNumber={frame.number}
                        selected={selected == frame.number}/>
                </div>
            )) }
        </div>
    );
};

export default FrameGrid;