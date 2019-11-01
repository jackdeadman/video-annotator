import React from 'react';

import ImageLoader from 'react-loading-image';
import classNames from 'classnames';
import styles from './styles.css';

import BarLoader from 'react-spinners/BarLoader';

const PreviewImage = ({ src, selected, frameNumber }) => {
    return (
        <div className={classNames(styles.box, { [styles.selected]: selected })}>
            <span>{ frameNumber }</span>
            <ImageLoader
                src={src}
                alt="test"
                loading={() => <BarLoader />}
            />
        </div>
    );
};

export default PreviewImage;