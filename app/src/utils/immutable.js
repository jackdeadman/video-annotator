export const removeItem = (array, index) => {
    return [
        ...array.slice(0, index),
        ...array.slice(index+1)
    ];
};
