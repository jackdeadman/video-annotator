import React from 'react'
import styles from './styles.css'
import DelayedInput from '../DelayedInput';


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

export default ParameterChanger;