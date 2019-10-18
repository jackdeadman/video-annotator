import React, { useState, useEffect, useRef } from 'react';

const ref = React.createRef();

const useDelay = (delay, callback) => {

    useEffect(() => {
        const t = setTimeout(() => {
            callback();
        }, delay);
        
        return () => clearTimeout(t);
    }, []);

    return () => {};
};


const DelayedInput = ({ delay, onChange, value, ...props }) => {
    const input = useRef(ref);
    const [ intermediateValue, setIntermediateValue ] = useState(value);

    const increaseDelay = useDelay(delay, () => {
        onChange(input.value);
    });

    const inputHandler = () => {
        increaseDelay();
        setIntermediateValue(input.value);
    };

    useEffect(() => {
        const element = input.current;

        if (element) {
            input.addEventListener('change', inputHandler);
            () => input.removeEventListener('change', inputHandler)
        }

        return () => {};
    });

    return <input ref={ref} value={intermediateValue} {...props} />
};

export default DelayedInput;