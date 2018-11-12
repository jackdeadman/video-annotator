import React from 'react';
import styles from './styles.css';

const Loader = function({ children }) {
    return (
        <div className={styles.loader}>{ children }...</div>
    );
};

export default Loader;