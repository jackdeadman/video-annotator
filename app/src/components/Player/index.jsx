import React, {Component}  from 'react'
import styles from './styles.css'

const Player = function({ video }) {
    return (
        <video autoPlay src={src} onChange={this.handlePlay.bind(this)}></video>
    );
};

export default Player;

// export default class Player extends Component {

//     handlePlay(e) {
//         console.log(e.target.currentTime);
//         // this.props.onChange(e);
//     }
    
//     render() {
//         return
//         return <div>Foo</div>
//         // const src = this.props.src;
//         // return (<video autoPlay src={src} onChange={this.handlePlay.bind(this)}></video>)
//     }
// }
