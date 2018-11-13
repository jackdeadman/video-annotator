import React, { useState, useEffect } from 'react';

export const useCollection = function(defaultItems=[]) {
    const [ items, setItems ] = useState(defaultItems);

    function addItem(item) {
        setItems([...items, item]);
    }

    function removeItem(item) {
        // TODO: implement
    }

    return {
        addItem,
        removeItem,
        items
    }
};
