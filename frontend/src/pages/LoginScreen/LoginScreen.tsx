import React, { useState } from 'react';
import { WinButton } from '@atoms/WinButton/WinButton';
import MewIconProfile from '@assets/icons/me-with-cat.png'
import { useTranslation } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import './LoginScreen.css';

interface LoginScreenProps {
    onLogin: () => void;
    onCancel?: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onCancel }) => {
    const { t } = useTranslation();
    const { playSound } = useSound();
    const [username, setUsername] = useState('Guest');
    const [password, setPassword] = useState('');

    const [showTooltip, setShowTooltip] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        playSound('startup');
        onLogin();
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        } else {
            setPassword('');
        }
    };

    return (
        <div className="login-screen">
            <div
                role="dialog"
                aria-labelledby="login-title"
                className="login-screen__window"
            >
                {/* Title Bar */}
                <div className="login-screen__title-bar">
                    <span id="login-title" className="login-screen__title">{t('login_title')}</span>
                    <div className="login-screen__help-wrapper">
                        <button
                            className="login-screen__help-btn"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            onFocus={() => setShowTooltip(true)}
                            onBlur={() => setShowTooltip(false)}
                            aria-label={t('help')}
                            aria-describedby={showTooltip ? "login-help-tooltip" : undefined}
                        >
                            ?
                        </button>
                        {showTooltip && (
                            <div
                                id="login-help-tooltip"
                                role="tooltip"
                                className="login-screen__tooltip"
                            >
                                {t('login_help_tooltip')}
                            </div>
                        )}
                    </div>
                </div>

                <div className="login-screen__content">
                    {/* Icon */}
                    <div className="login-screen__icon-wrapper">
                        <img
                            src={MewIconProfile}
                            alt={t('login_icon_alt')}
                            aria-hidden="true"
                            className="login-screen__icon"
                            width={140}
                            height={140}
                            onError={(e) => e.currentTarget.style.display = 'none'}
                        />
                    </div>

                    {/* Form */}
                    <form id="login-form" onSubmit={handleSubmit} className="login-screen__form">
                        <p className="login-screen__desc">{t('login_desc')}</p>

                        <div className="login-screen__grid">
                            <label htmlFor="login-username" className="login-screen__label">{t('user_name')}</label>
                            <input
                                id="login-username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="login-screen__input"
                                autoFocus
                            />

                            <label htmlFor="login-password" className="login-screen__label">{t('password')}</label>
                            <input
                                id="login-password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="login-screen__input"
                            />
                        </div>
                    </form>
                </div>

                {/* Buttons */}
                <div className="login-screen__actions">
                    <WinButton type="submit" form="login-form" className="login-screen__btn">
                        {t('ok')}
                    </WinButton>
                    <WinButton type="button" onClick={handleCancel} className="login-screen__btn">
                        {t('cancel')}
                    </WinButton>
                </div>

            </div>
        </div>
    );
};
