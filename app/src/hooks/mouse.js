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

export function useMouseDrag(element) {
    const mousePosition = useMousePositionRelative(element);
    const [ startPosition, setStartPosition] = useState({...mousePosition});
    const [ dragging, setDragging ] = useState(false);

    function handleMouseDown(e) {
        setStartPosition(mousePosition)
        setDragging(true);
    }

    function handleMouseUp(e) {
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