export const calcBoxStyles = function({ start, end }, color) {
    return {
        width: Math.abs(start.x - end.x),
        height: Math.abs(start.y - end.y),
        left: Math.min(start.x, end.x),
        top: Math.min(start.y, end.y),
        backgroundColor: color
    }
}

export const insideBox = function (box, position) {
    const { left: x, top: y, width, height } = calcBoxStyles(box);

    return x <= position.x && position.x <= x + width &&
               y <= position.y && position.y <= y + height;
}

// Make start always be the top left point
export const normalise = function({ start, end }) {
    console.log(start, end)
    const topLeft = {
        x: Math.min(start.x, end.x),
        y: Math.min(start.y, end.y)
    };

    const bottomRight = {
        x: topLeft.x + Math.abs(start.x - end.x),
        y: topLeft.y + Math.abs(start.y - end.y)
    };

    return { start: topLeft, end: bottomRight };
};