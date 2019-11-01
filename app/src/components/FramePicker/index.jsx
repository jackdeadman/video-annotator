import React, { useState, useEffect, useContext }  from 'react'
import classNames from 'classnames'

import styles from './styles.css'

import { extractFrames, loadFrames } from '../../modules/frames'
import { ProjectContext } from '../../constants/contexts'
import { LOADING } from '../../constants/symbols'

import FrameGrid from './FrameGrid'


const FramePicker = function ({ camera, onChange, frame }) {

    const { project } = useContext(ProjectContext);
    const [ images, setImages ] = useState(LOADING);

    useEffect(() => {
        (async () => {
            setImages(await project.frames(camera));
        })();
    }, [ camera ]);

    return (
        <div className={classNames(styles.main, {[styles.loading]: images == LOADING})}>
            <FrameGrid camera={camera} selected={frame} frames={images} onSelect={onChange}/>
        </div>
    );
};

export default FramePicker;