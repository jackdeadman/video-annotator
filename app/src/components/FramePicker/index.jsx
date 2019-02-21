import React, { useState, useEffect, useContext }  from 'react'
import classNames from 'classnames'

import styles from './styles.css'

import { extractFrames, loadFrames } from '../../modules/frames'
import { ProjectContext } from '../../constants/contexts'
import { LOADING } from '../../constants/symbols'

import ParameterChanger from './PrameterChanger'
import FrameGrid from './FrameGrid'

async function loadImages(video, framesCount, framesSpacing, framePath, setImages) {
    setImages(LOADING);
    const images = await loadFrames(video, framePath);

    // Only extract the images if we don't have the expected amount
    if (images.length === framesCount) {
        setImages(images);
    } else {
        setImages(await extractFrames(video, framesCount, framesSpacing, framePath));
    }
}

const FramePicker = function ({ video, onChange, }) {

    const { project } = useContext(ProjectContext);
    const [ images, setImages ] = useState(LOADING);

    const [ params, setParams ] = useState({
        frames: project.framesCount(video),
        spacing: project.framesSpacing(video)
    });

    useEffect(() => {
        // Save the changes to the file
        project.saveFrameUpdate(video, params);
    }, [ params ]);

    function updateParams(params) {
        // Can only adjust params once the images have finished loading.
        if (images != LOADING) {
            setParams(params);
        }
    }

    const framesCount = params.frames;
    const framesSpacing = params.spacing;
    const framePath = project.framePathForVideo(video);

    useEffect(() => {
        loadImages(video, framesCount, framesSpacing, framePath, setImages);
    }, [params]);

    return (
        <div className={classNames(styles.main, {[styles.loading]: images == LOADING})}>
            <ParameterChanger { ...params } onChange={updateParams} />
            <FrameGrid frames={images} onSelect={onChange}/>
        </div>
    );
};

export default FramePicker;