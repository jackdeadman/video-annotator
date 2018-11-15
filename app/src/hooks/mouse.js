import React, { useState, useEffect } from 'react';

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
    const [ startPosition, setStartPosition] = useState({...mousePosition});
    const [ dragging, setDragging ] = useState(false);
    let valid = true;

    function handleMouseDown(e) {
        setStartPosition(mousePosition);
        valid = contraints.every(fn => fn(mousePosition));
        // Only set dragging to true if it meets the constraints
        setDragging(valid);
    }

    function handleMouseUp(e) {
        console.log(element)
        setDragging(false);
    }

    useEffect(() => {
        if (!element) return null;
        element.addEventListener('mousedown', handleMouseDown);
        element.addEventListener('mouseup', handleMouseUp);
        return () => {
            element.removeEventListener('mousedown', handleMouseDown);
            element.removeEventListener('mouseup', handleMouseUp);
        };
    });

    return {
        mousePosition: {
            start: { ...startPosition },
            end: { ...mousePosition }
        },
        dragging
    }
}