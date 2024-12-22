import React, { useEffect, useState } from 'react';
import './Loader.css';

const resolutions = ["Health", "Career", "Travel", "Personal Growth", "Family"];

const ResolutionsSpinner: React.FC = () => {
    const [currentResolution, setCurrentResolution] = useState(resolutions[0]);
    const [rotate, setRotate] = useState(0);
    const [fadeInKey, setFadeInKey] = useState(0); // Key to reset the fade animation

    useEffect(() => {
        const interval = setInterval(() => {
            setRotate((prev) => prev + 360);
            setCurrentResolution((prev) => {
                const currentIndex = resolutions.indexOf(prev);
                return resolutions[(currentIndex + 1) % resolutions.length];
            });
            setFadeInKey((prev) => prev + 1); // Reset fade animation by changing the key
        }, 2000); // Change resolution every 2 seconds
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="resolutions-spinner">
            <div className="spinner-circle" style={{ transform: `rotate(${rotate}deg)` }} />
            <div
                key={fadeInKey} // Key ensures the fade-in animation is reset
                className="resolution-text"
            >
                {currentResolution}
            </div>
        </div>
    );
};

export default ResolutionsSpinner;
