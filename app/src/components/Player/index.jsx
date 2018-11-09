import React, {Component}  from 'react'
import styles from './styles.css'

export default class Player extends Component {

    handlePlay(e) {
        console.log(e.target.currentTime);
        // this.props.onChange(e);
    };
    
    render() {
        const src = this.props.src;
        return (<video autoPlay src={src} ={this.handlePlay.bind(this)}></video>)
    }
}
