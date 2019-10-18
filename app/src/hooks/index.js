import { useEffect, useRef } from 'react';

export const useChange = (callback, deps=[]) => {
    const initialLoad = useRef(true);

    useEffect(() => {
        if (!initialLoad.current) {
            callback();
        }

        initialLoad.current = false;
    }, deps)
}