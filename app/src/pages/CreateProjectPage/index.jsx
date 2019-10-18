import React, { useState, useEffect }  from 'react'
import { chooseFiles } from '../../utils/UI';

const CreateProjectPage = function({ onCreate }) {
    const [ projectName, setProjectName ] = useState("");
    const [ sampleRate, setSampleRate ] = useState(10);
    const [ files, setFiles ] = useState([]);

    async function selectVideos() {
        setFiles(await chooseFiles());
    }

    return (
        <div>
            <h2>{ projectName }</h2>
            <div>
                <input placeholder="Project Name" value={projectName}
                    onChange={(e) => setProjectName(e.target.value)} />
            </div>
            <button onClick={selectVideos} className="btn">Select Videos</button>
            <ul>
                { files.map(file => (
                    <li key={file}>{ file }</li>
                )) }
            </ul>

            <div>
                <label>Sample Rate (minutes): </label>
                <input type="number" value={sampleRate}
                    onChange={(e) => setSampleRate(Number(e.target.value))} />
            </div>

            <button onClick={() => onCreate({
                projectName, sampleRate, files
            })} className="btn">Create Project</button>


        </div>);

};

export default CreateProjectPage;