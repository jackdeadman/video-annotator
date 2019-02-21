import React, { useContext } from 'react'
import PreviewImage from './PreviewImage';
import { LOADING } from '../../constants/symbols'

import styles from './styles.css'
import { EditorContext } from '../../constants/contexts';

const FrameGrid = ({ frames, onSelect }) => {

    const { state } = useContext(EditorContext);

    if (frames == LOADING) {
        return <div>Loading...</div>
    }

    if (frames.length === 0) {
        return <div>No frames</div>
    }

    return (
        <div className={styles.grid}>
            { frames.map((frame) => (
                <div onClick={onSelect.bind(this, frame.number)} key={frame.number}
                        className={styles.framePreview}>
                    <PreviewImage src={`${frame.src}`}
                        frameNumber={frame.number}
                        selected={state.selectedFrame.number == frame.number}/>
                </div>
            )) }
        </div>
    );
};

export default FrameGrid;