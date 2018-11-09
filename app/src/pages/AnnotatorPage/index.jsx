import React, {Component}  from 'react'
import classNames from 'classnames';
import styles from './styles.css'

export default class AnnotatorPage extends Component {

    render() {
        return (
            <div className={styles.grid}>
                <div className={classNames(styles.video, styles.box)}>A</div>
                <div className={classNames(styles.speakers, styles.box)}>B</div>
                <div className={classNames(styles.utterances, styles.box)}>C</div>
            </div>
        );
    }
}
