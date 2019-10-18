import React, { useState, useEffect, useRef } from 'react';

export function useMousePosition() {
    const [ mousePosition, setMousePosition ] = useState({ x:0, y: 0 });

    function handleMouseMove(e) {
        setMousePosition({ x: e.clientX, y: e.clientY });
    }

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove)
    });

    return mousePosition;
}

export function useMousePositionRelative(element) {
    const mousePosition = useMousePosition();
    let offset = { x: 0, y: 0 }

    if (element) {
        const rect = element.getBoundingClientRect();
        offset = { x: rect.left, y: rect.top };
    }

    return {
        x: mousePosition.x - offset.x,
        y: mousePosition.y - offset.y
    };
}

export function useMouseDrag(element, contraints=[]) {
    const mousePosition = useMousePositionRelative(element);
    const ref = useRef(mousePosition)

    let [ startPosition, setStartPosition] = useState(null);
    const [ dragging, setDragging ] = useState(false);
    let valid = true;

    const handleMouseDown = (e) => {
        valid = contraints.every(fn => fn(mousePosition));
        if (valid) {
            setStartPosition(ref.current);
        }
    }

    function handleMouseUp(e) {
        setDragging(false);
    }

    useEffect(() => {
        ref.current = mousePosition
    }, [ mousePosition ]);

    useEffect(() => {
        setDragging(true);
    }, [ startPosition ]);

    useEffect(() => {
        if (!element) return;
        element.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            element.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [ element ]);

    return {
        mousePosition: {
            start: { ...startPosition },
            end: { ...mousePosition }
        },
        dragging
    }
}