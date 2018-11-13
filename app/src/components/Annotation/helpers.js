export const calcBoxStyles = function(start, end, color) {
    return {
        width: Math.abs(start.x - end.x),
        height: Math.abs(start.y - end.y),
        left: Math.min(start.x, end.x),
        top: Math.min(start.y, end.y),
        backgroundColor: color
    }
}

export const insideBox = function (box, position) {
    console.log(box, position)
    const { left: x, top: y, width, height } = calcBoxStyles(box.start, box.end);

    return x <= position.x && position.x <= x + width &&
               y <= position.y && position.y <= y + height;
}