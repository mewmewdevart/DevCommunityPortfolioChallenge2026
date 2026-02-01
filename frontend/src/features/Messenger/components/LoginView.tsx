import React from 'react';
import { WinButton } from '@/components/atoms/WinButton/WinButton';
import { IconRenderer } from '@/components/atoms/IconRenderer/IconRenderer';
import { useTranslation } from '@/context/LanguageContext';
import mensagerIcon from '@/assets/icons/icon-messenger.png';

interface LoginViewProps {
    onLogin: () => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
    const { t } = useTranslation();
    return (
        <div className="messenger-login">
            <header className="messenger-login__header">
                <IconRenderer icon={mensagerIcon} size={32} className="messenger-login__icon" />
                <h1 className="messenger-login__title">{t('messenger_title')}</h1>
                <span className="messenger-login__subtitle">{t('messenger_version')}</span>
            </header>

            <form
                className="messenger-login__form"
                onSubmit={(e) => { e.preventDefault(); onLogin(); }}
            >
                <div>
                    <label className="messenger-label" htmlFor="email-input">{t('login_email')}</label>
                    <input
                        id="email-input"
                        type="text"
                        className="messenger-input"
                        defaultValue="guest@gmail.com"
                        maxLength={100}
                    />
                </div>
                <div>
                    <label className="messenger-label" htmlFor="password-input">{t('login_password')}</label>
                    <input
                        id="password-input"
                        type="password"
                        className="messenger-input"
                        defaultValue="password"
                        maxLength={100}
                    />
                </div>

                <div className="messenger-checkbox-group">
                    <input type="checkbox" id="remember" defaultChecked className="messenger-checkbox" />
                    <label htmlFor="remember" className="messenger-checkbox-label">{t('login_remember')}</label>
                </div>

                <div className="messenger-btn-container">
                    <WinButton className="messenger-btn-login" type="submit">{t('login_signin')}</WinButton>
                </div>
            </form>
        </div>
    );
};
