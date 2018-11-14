import React, { useState, useEffect } from 'react';

export const useCollection = function(defaultItems=[]) {
    const [ items, setItems ] = useState(defaultItems);

    function addItem(item) {
        setItems([...items, item]);
    }

    function removeItem(item) {
        // TODO: implement
    }

    function updateItem(index, updated) {
        const newItems = Object.assign([], items, {
            [index]: { ...items[index], ...updated }
        });
        setItems(newItems);
    }

    return {
        addItem,
        removeItem,
        updateItem,
        items
    }
};
