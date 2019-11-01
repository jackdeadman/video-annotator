import React, { useState, useEffect }  from 'react'
import { chooseFiles, chooseFolder } from '../../utils/UI';

const CreateProjectPage = function({ onCreate }) {
    const [ projectName, setProjectName ] = useState("");
    const [ files, setFiles ] = useState([]);
    const [ location, setLocation ] = useState(__dirname);

    async function selectVideos() {
        setFiles(await chooseFiles());
    }

    async function selectLocation() {
        setLocation(await chooseFolder());
    }

    return (
        <div>
            <h2>{ projectName }</h2>
            <div>
                <input placeholder="Project Name" value={projectName}
                    onChange={(e) => setProjectName(e.target.value)} />
            </div>
            <button onClick={selectVideos} className="btn btn-small">Select Videos</button>
            <ul>
                { files.map(file => (
                    <li key={file}>{ file }</li>
                )) }
            </ul>

            <div>Location: {location} </div>
            <button onClick={selectLocation} className="btn btn-small">Select Project Location</button>
            <br />
            <button onClick={() => onCreate(location, {
                projectName, files
            })} className="btn">Create Project</button>


        </div>);

};

export default CreateProjectPage;