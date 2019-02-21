import React from 'react';
import classNames from 'classnames';
import styles from './styles.css';

const PreviewImage = ({ src, selected, frameNumber }) => {
    return (
        <div className={classNames(styles.box, { [styles.selected]: selected })}>
            <span>{ frameNumber }</span>
            <img src={src} alt="Picture of a frame" />
        </div>
    );
};

export default PreviewImage;