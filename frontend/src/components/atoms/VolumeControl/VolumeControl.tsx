import React, { useState, useRef, useEffect } from 'react';
import { useSound } from '@context/SoundContext';
import { useTranslation } from '@context/LanguageContext';
import './VolumeControl.css';

const SpeakerIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="volume-control__icon">
        <path d="M3 9V15H7L12 20V4L7 9H3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M15.5 8.5C16.5 9.5 17 10.5 17 12C17 13.5 16.5 14.5 15.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19 5C21 7 22 9.5 22 12C22 14.5 21 17 19 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const VolumeControl: React.FC = () => {
    const { volume, setVolume } = useSound();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleOpen = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                popupRef.current &&
                !popupRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="volume-control">
            {isOpen && (
                <div className="volume-control__popup" ref={popupRef}>
                    <div className="volume-control__slider-wrapper">
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="volume-control__slider"
                            // @ts-ignore
                            orient="vertical"
                            aria-label={t('volume_control')}
                        />
                    </div>
                </div>
            )}
            <button
                ref={buttonRef}
                onClick={toggleOpen}
                className="volume-control__btn"
                title={t('volume')}
                aria-label={t('volume')}
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <SpeakerIcon />
            </button>
        </div>
    );
};
