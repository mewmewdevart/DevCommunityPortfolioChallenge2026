import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSound } from '@/context/SoundContext';
import './RetroControls.css';

interface Props {
    onBack?: () => void;
    onSelect?: () => void;
}

const RetroControls: React.FC<Props> = ({ onBack, onSelect }) => {
    const { t } = useTranslation();
    const { playSfx } = useSound();

    const handleSelect = () => {
        playSfx('ui_click_retro');
        if (onSelect) onSelect();
    };

    const handleBack = () => {
        playSfx('ui_click_retro');
        if (onBack) onBack();
    };

    return (
        <div className="retro-controls">

            <button className="retro-controls__btn-wrapper" onClick={handleSelect}>
                <div className="retro-controls__key retro-controls__key--blue">
                    X
                </div>
                <span className="retro-controls__label">{t('ps2_enter') || 'SELECT'}</span>
            </button>

            <button className="retro-controls__btn-wrapper" onClick={handleBack}>
                <div className="retro-controls__key retro-controls__key--green">
                    △
                </div>
                <span className="retro-controls__label">{t('ps2_back') || 'BACK'}</span>
            </button>

            <div className="retro-controls__group opacity-50">
                <div className="retro-controls__key retro-controls__key--red">
                    O
                </div>
                <span className="retro-controls__label">{t('ps2_options') || 'COPY'}</span>
            </div>

        </div>
    );
};

export default RetroControls;
