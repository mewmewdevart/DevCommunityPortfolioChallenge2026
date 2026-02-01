import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { useOS } from '@/context/OSContext';
import iconComputer from 'pixelarticons/svg/monitor.svg';
import { IconRenderer } from '@/components/atoms/IconRenderer/IconRenderer';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import './ShutdownDialog.css';

interface ShutdownDialogProps {
    onCancel: () => void;
}

type ShutdownOption = 'shutdown' | 'restart' | 'return_game';

export const ShutdownDialog: React.FC<ShutdownDialogProps> = ({ onCancel }) => {
    const { t } = useTranslation();
    const { shutDownSystem, rebootSystem, returnToGame } = useOS();
    const [selectedOption, setSelectedOption] = useState<ShutdownOption>('shutdown');

    const { containerRef, handleKeyDown } = useFocusTrap(true);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onCancel();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onCancel]);


    const handleOk = () => {
        switch (selectedOption) {
            case 'shutdown':
                shutDownSystem();
                break;
            case 'restart':
                rebootSystem();
                break;
            case 'return_game':
                returnToGame();
                break;
        }
    };

    return (
        <div className="shutdown-dialog-overlay" role="dialog" aria-modal="true" aria-labelledby="shutdown-title">
            <div
                className="shutdown-dialog"
                ref={containerRef}
                onKeyDown={handleKeyDown}
            >
                <div className="shutdown-dialog__header">
                    <span id="shutdown-title" className="shutdown-dialog__title">{t('shutdown_title')}</span>
                    <button className="shutdown-dialog__close" onClick={onCancel} aria-label={t('close')}>×</button>
                </div>

                <div className="shutdown-dialog__content">
                    <div className="shutdown-dialog__icon">
                        <IconRenderer icon={iconComputer} size={32} />
                    </div>

                    <div className="shutdown-dialog__options">
                        <h3 className="shutdown-dialog__label">{t('shutdown_question')}</h3>

                        <div className="shutdown-dialog__radio-group" role="radiogroup">
                            <label className="shutdown-dialog__radio-option">
                                <input
                                    type="radio"
                                    name="shutdown-option"
                                    value="shutdown"
                                    checked={selectedOption === 'shutdown'}
                                    onChange={() => setSelectedOption('shutdown')}
                                    className="shutdown-dialog__radio-input"
                                />
                                {t('shutdown_computer')}
                            </label>

                            <label className="shutdown-dialog__radio-option">
                                <input
                                    type="radio"
                                    name="shutdown-option"
                                    value="restart"
                                    checked={selectedOption === 'restart'}
                                    onChange={() => setSelectedOption('restart')}
                                    className="shutdown-dialog__radio-input"
                                />
                                {t('restart_computer')}
                            </label>

                            <label className="shutdown-dialog__radio-option">
                                <input
                                    type="radio"
                                    name="shutdown-option"
                                    value="return_game"
                                    checked={selectedOption === 'return_game'}
                                    onChange={() => setSelectedOption('return_game')}
                                    className="shutdown-dialog__radio-input"
                                />
                                {t('return_to_game')}
                            </label>
                        </div>
                    </div>
                </div>

                <div className="shutdown-dialog__buttons">
                    <button className="shutdown-dialog__button" onClick={handleOk}>
                        {t('ok')}
                    </button>
                    <button className="shutdown-dialog__button" onClick={onCancel}>
                        {t('cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};
