import React, { useState, useRef, useEffect } from 'react';
import { useSound } from '@context/SoundContext';
import { useTranslation } from '@context/LanguageContext';
import iconSoundOn from 'pixelarticons/svg/volume-3.svg';
import iconSoundOff from 'pixelarticons/svg/volume-x.svg';
import { IconRenderer } from '@atoms/IconRenderer/IconRenderer';
import './VolumeControl.css';

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
                <IconRenderer
                    icon={volume > 0 ? iconSoundOn : iconSoundOff}
                    size={18}
                    className="volume-control__icon"
                />
            </button>
        </div>
    );
};
