import React, { useState, useEffect }  from 'react'
import styles from './styles.css'
import { extractFrames } from '../../modules/frames'
import classNames from 'classnames'

const ParameterChanger = ({ frames, spacing, onChange }) => {
    // '+' used to convert '' to 0
    function changeFrames({ target }) {
        onChange({ spacing, frames: +target.value });
    }

    function changeSpacing({ target }) {
        onChange({ frames, spacing: +target.value });
    }

    return (
        <form className={styles.form}>
            <div className={styles.input}>
                <label>Frames:</label>
                <input type="number" value={frames} onChange={changeFrames}/>
            </div>

            <div className={styles.input}>
                <label>Spacing:</label>
                <input type="number" value={spacing} onChange={changeSpacing}/>
            </div>
        </form>
    );
};

const PreviewImage = ({ src }) => {
    return (<img src={src} alt="Picture of a frame" />);
};

const LOADING = Symbol.for('LOADING');

const FrameGrid = ({ frames, onSelect }) => {

    if (frames == LOADING) {
        return <div>Loading...</div>
    }

    if (frames.length === 0) {
        return <div>No frames</div>
    }

    return (
        <div className={styles.grid}>
            { frames.map((frame, index) => (
                <div onClick={onSelect.bind(this, index)} key={index}
                        className={styles.framePreview}>
                    <PreviewImage src={frame} />
                </div>
            )) }
        </div>
    );
};

const FramePicker = function ({ video, onChange }) {

    const [ params, setParams ] = useState({
        frames: 15,
        spacing: 5
    });

    const [ images, setImages ] = useState(LOADING);

    function updateParams(params) {
        // Can only adjust params once the images have been loaded.
        if (images != LOADING) {
            setParams(params);
        }
    }

    useEffect(async () => {
        setImages(LOADING)
        setImages(await extractFrames(video, params.frames));
    }, [ params ]);


    return (
        <div className={classNames(styles.main, {[styles.loading]: images == LOADING})}>
            <ParameterChanger { ...params } onChange={updateParams} />
            <FrameGrid frames={images} onSelect={onChange}/>
        </div>
    );
};

export default FramePicker;