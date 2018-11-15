import React, { useState, useEffect } from 'react';

export function useKeyboard(){
    const [ keyPressed, setKeyPressed ] = useState(null);
    
    function handleKeyDown(e) {
        setKeyPressed(e.keyCode);
    }

    function handleKeyUp(e) {
        setKeyPressed(null);
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