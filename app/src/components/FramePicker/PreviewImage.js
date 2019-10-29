import React from 'react';

import ImageLoader from 'react-loading-image';
import classNames from 'classnames';
import styles from './styles.css';

const PreviewImage = ({ src, selected, frameNumber }) => {
    return (
        <div className={classNames(styles.box, { [styles.selected]: selected })}>
            <span>{ frameNumber }</span>
            <ImageLoader
                src={src}
                alt="test"
                loading={() => <div></div>}
            />
        </div>
    );
};

export default PreviewImage;