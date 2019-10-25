import React, { useState, useEffect } from 'react';


export function useKeyboard(){
    const defaultKey = {
        keyCode: null,
        ctrlKey: false
    };

    const [ keyPressed, setKeyPressed ] = useState(defaultKey);
    
    function handleKeyDown(e) {
        setKeyPressed(e);
    }

    function handleKeyUp(e) {
        setKeyPressed(defaultKey);
    }

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    });

    return keyPressed;
}