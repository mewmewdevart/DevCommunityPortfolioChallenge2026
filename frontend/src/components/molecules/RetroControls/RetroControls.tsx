import React from 'react';
import { useTranslation } from 'react-i18next';
import './RetroControls.css';

interface Props {
    onBack?: () => void;
    onSelect?: () => void;
}

const RetroControls: React.FC<Props> = ({ onBack, onSelect }) => {
    const { t } = useTranslation();

    return (
        <div className="retro-controls">

            {/* Cross Button - Select */}
            <button className="retro-controls__btn-wrapper" onClick={onSelect}>
                <div className="retro-controls__key retro-controls__key--blue">
                    X
                </div>
                <span className="retro-controls__label">{t('ps2_enter') || 'SELECT'}</span>
            </button>

            {/* Triangle Button - Back */}
            <button className="retro-controls__btn-wrapper" onClick={onBack}>
                <div className="retro-controls__key retro-controls__key--green">
                    △
                </div>
                <span className="retro-controls__label">{t('ps2_back') || 'BACK'}</span>
            </button>

            {/* Circle Button - Copy (Disabled/Decorative) */}
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
