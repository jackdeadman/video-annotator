import React from 'react';

const PrefetchImages = function({ images }) {
    return (
        <div className="hidden">
            { images.map(src => (
                <img src={src} key={src}/>
            )) }
        </div>
    );
};

export default PrefetchImages;