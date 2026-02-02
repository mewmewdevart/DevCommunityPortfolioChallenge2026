import React, { useEffect, useRef } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import './ShutdownScreen.css';

interface ShutdownScreenProps {
    onReboot: () => void;
}

export const ShutdownScreen: React.FC<ShutdownScreenProps> = ({ onReboot }) => {
    const { t } = useTranslation();
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        ref.current?.focus();
    }, []);

    return (
        <div
            className="shutdown-screen"
            ref={ref}
            tabIndex={-1}
            role="alert"
            aria-live="assertive"
        >
            <div className="shutdown-screen__content">
                <h1 className="shutdown-screen__title">
                    Windows 95
                </h1>
                <p className="shutdown-screen__message">
                    {t('safe_to_turn_off')}
                </p>
                <p className="shutdown-screen__hint">
                    {t('shutdown_restart_hint')}
                </p>

                <button
                    className="shutdown-screen__button"
                    onClick={onReboot}
                >
                    {t('errorBoundary_restart')}
                </button>
            </div>
        </div>
    );
};
