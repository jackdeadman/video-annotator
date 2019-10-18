import React, { useState, useEffect, useRef }  from 'react'
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { extractFrames } from '../../modules/frames'

const exists = promisify(fs.exists);
const mkdir = promisify(fs.mkdir);

async function processFile(project, file) {
    const filename = path.basename(file);
    const projectpath = path.join('projects', project.projectName);
    const framesPath = path.join(projectpath, 'frames');

    // if (!await exists(framesPath)) {
    //     await mkdir(framesPath);
    // }

    const output = path.join(framesPath, filename);
    extractFrames(file, project.sampleRate, output);
}

const ProcessingPage = function({ project }) {
    const [ processed, setProcessed ] = useState([])
    const processedContainer = useRef(processed);

    function updateProcessed(file) {
        const files = [...processedContainer.current, file]
        setProcessed(files);
        processedContainer.current = [...processedContainer.current, file]
    }

    const processing = project.files.filter(f => processed.indexOf(f) == -1)

    async function startProcessing() {
        project.files.forEach(async file => {
            await processFile(project, file);
            updateProcessed(file)
        });
    }

    // Start processing the videos once the pages loads
    useEffect(() => { startProcessing() }, []);

    return (
        <div>
            <h2>Processing</h2>
            <ul>
                { processing.map(file => (
                    <li>{ file }</li>
                )) }
            </ul>
            <h2>Completed</h2>
            <ul>
                { processed.map(file => (
                    <li>{ file }</li>
                )) }
            </ul>
        </div>);

};

export default ProcessingPage;