import React from 'react';
import './CRTShutdownEffect.css';

interface Props {
    isActive: boolean;
}

export const CRTShutdownEffect: React.FC<Props> = ({ isActive }) => {
    if (!isActive) return null;

    return (
        <div className="crt-shutdown active">
            {/* White flash */}
            <div className="crt-shutdown__fill" />

            {/* Vertical Shutters */}
            <div className="crt-shutter-y crt-shutter-y-top" />
            <div className="crt-shutter-y crt-shutter-y-bottom" />

            {/* Horizontal Shutters (Closing the beam) */}
            <div className="crt-shutter-x crt-shutter-x-left" />
            <div className="crt-shutter-x crt-shutter-x-right" />

            {/* Center white line collapsing */}
            <div className="crt-white-bar" />
        </div>
    );
};
