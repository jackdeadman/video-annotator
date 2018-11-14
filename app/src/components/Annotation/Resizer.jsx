import React from 'react';
import classNames from 'classnames';
import styles from './styles.css';

import { calcBoxStyles } from './helpers';

const Resizer = function({start, end}) {
    return (
        <div className={styles.resizer}>
            <div className={classNames(styles.handle1, styles.handle)}></div>
            <div className={classNames(styles.handle2, styles.handle)}></div>
            <div className={classNames(styles.handle3, styles.handle)}></div>
            <div className={classNames(styles.handle4, styles.handle)}></div>
        </div>
    )
};

export default Resizer;