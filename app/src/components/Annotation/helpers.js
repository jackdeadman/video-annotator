import { diff, add } from '../../utils';
import { BrowserWindowProxy } from 'electron';

export const calcBoxStyles = function({ start, end }, color) {
    return {
        width: Math.abs(start.x - end.x),
        height: Math.abs(start.y - end.y),
        left: Math.min(start.x, end.x),
        top: Math.min(start.y, end.y),
        backgroundColor: color
    }
}

export const translateBox = ({ originalBox, change }) => {
    const styles = calcTranslateStyles({ originalBox, change });
    return adjustBoxWithStyles(originalBox, styles);
};

export const calcTranslateStyles = ({originalBox, change}, color) => {
    const originalBoxStyles = calcBoxStyles(originalBox);
    const dims = { width: originalBoxStyles.width, height: originalBoxStyles.height };
    const movement = diff(change.end, change.start);

    return {
        position: 'relative',
        backgroundColor: color,
        ...dims,
        left: movement.x,
        top: movement.y
    };
};

/**
 * 
 * @param {originalBox: annotated box, change: the delta position} 
 * @param {The corner that has been selected} selected 
 */
export const calcResizeStyles = ({ originalBox, change }, selected, color) => {
    const originalBoxStyles = calcBoxStyles(originalBox);
    const { start, end } = change;

    const normalise = (dims, movement) => {
        movement.left = Math.min(0, dims.width);
        dims.width = Math.abs(dims.width);
        movement.top = Math.min(0, dims.height);
        dims.height = Math.abs(dims.height);
    };

    let dims = { width: 0, height: 0 };
    let movement = { left: 0, top: 0 };

    // Work out relative movement
    switch (selected) {
        case CORNERS.BOTTOM_RIGHT:
            dims = {
                width: originalBoxStyles.width + end.x - start.x,
                height: originalBoxStyles.height + end.y - start.y
            };

            normalise(dims, movement);
            break

        case CORNERS.TOP_RIGHT:
            dims = {
                width: originalBoxStyles.width + end.x - start.x,
                height: originalBoxStyles.height + start.y - end.y
            };

            normalise(dims, movement);
            movement.top -= start.y - end.y;
            break

        case CORNERS.BOTTOM_LEFT:
            dims = {
                width: originalBoxStyles.width + start.x - end.x,
                height: originalBoxStyles.height + end.y - start.y
            };

            normalise(dims, movement);
            movement.left -= start.x - end.x;
            break
            
        case CORNERS.TOP_LEFT:
            dims = {
                width: originalBoxStyles.width + start.x - end.x,
                height: originalBoxStyles.height + start.y - end.y
            };

            normalise(dims, movement);
            movement.left -= start.x - end.x;
            movement.top -= start.y - end.y;
            break
    };

    return {
        position: 'relative',
        backgroundColor: color,
        ...dims,
        ...movement
    };

}

export const insideBox = function (box, position, buffer=10) {
    const { left: x, top: y, width, height } = calcBoxStyles(box);

    return (x - buffer) <= position.x && position.x <= (x + buffer) + width &&
               (y - buffer) <= position.y && position.y <= (y + buffer) + height;
}

// Make start always be the top left point
export const normalise = function({ start, end }) {
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

export const clamp = function(box, boundary) {
    return box;
}

export const CORNERS = {
    TOP_LEFT: 0,
    TOP_RIGHT: 1,
    BOTTOM_RIGHT: 2,
    BOTTOM_LEFT: 3
};

export const cornerPosition = function(box, corner) {
    switch (corner) {
        case CORNERS.TOP_LEFT:
            return { ...box.start };
        case CORNERS.BOTTOM_RIGHT:
            return { ...box.end };
        case CORNERS.TOP_RIGHT:
            return { x: box.end.x, y: box.start.y };
        case CORNERS.BOTTOM_LEFT:
            return { x: box.start.x, y: box.end.y };
    }
}

export const adjustBoxWithStyles = function(box, styles) {
    return normalise({
        start: {
            x: box.start.x + styles.left,
            y: box.start.y + styles.top
        },
        end:{
            x: box.start.x + styles.left + styles.width,
            y: box.start.y + styles.top + styles.height
        }
    });
}

export const resizeBox = function({ originalBox, change }, selected) {
    const styles = calcResizeStyles({ originalBox, change }, selected);
    return adjustBoxWithStyles(originalBox, styles);
}