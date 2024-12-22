import React, { useEffect, useState } from 'react';
import './Loader.css';

const resolutions = ["Health", "Career", "Travel", "Personal Growth", "Family"];

const ResolutionsSpinner: React.FC = () => {
    const [currentResolution, setCurrentResolution] = useState(resolutions[0]);
    const [rotate, setRotate] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setRotate((prev) => prev + 360);
            setCurrentResolution((prev) => {
                const currentIndex = resolutions.indexOf(prev);
                return resolutions[(currentIndex + 1) % resolutions.length];
            });
        }, 2000); // Change resolution every 2 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="resolutions-spinner">
            <div className="spinner-circle" style={{ transform: `rotate(${rotate}deg)` }} />
            <div className="resolution-text">{currentResolution}</div>
        </div>
    );
};

export default ResolutionsSpinner;
