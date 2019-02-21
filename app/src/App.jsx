import React, { useState } from 'react'

import AnnotatorPage from './pages/AnnotatorPage';
import SelectProjectPage from './pages/SelectProjectPage';


const App = function() {

    // const [ projectBase, setProjectBase ] = useState(null);
    const [ projectBase, setProjectBase ] = useState('/home/jack/Documents/tools/example-project');

    return (
        <div>
            <h1>Video Annotator</h1>
            { projectBase == null
                ? <SelectProjectPage onSelect={setProjectBase} />
                : <AnnotatorPage projectBase={projectBase} />
            }
        </div>
    )
};

export default App;
