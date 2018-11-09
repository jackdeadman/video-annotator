import React, {Component} from 'react'
import { Player } from 'video-react';
import Main from './pages/AnnotatorPage';

const VIDEO_URL = `src/assets/video/S20_U01_boxes.mp4`

export default class App extends Component {
    render() {

        return (
            <div>
                <div className="hello">
                    <h1>Video Annotator</h1>
                    <Main />
                    {/* <Player
                        src={VIDEO_URL}
                    /> */}
                </div>
            </div>
        )
    }
}
