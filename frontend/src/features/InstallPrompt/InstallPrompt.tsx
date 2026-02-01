import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import './InstallPrompt.css';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
    const { t } = useTranslation();
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Check if already installed
        const isInstalled = window.matchMedia('(display-mode: standalone)').matches;
        if (isInstalled) return;

        // Check if user has dismissed before
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed === 'true') return;

        const handler = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();

            // Stash the event so it can be triggered later
            setDeferredPrompt(e as BeforeInstallPromptEvent);

            // Show prompt after 30 seconds to avoid overwhelming user immediately
            setTimeout(() => {
                setShowPrompt(true);
            }, 30000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // Clear the deferred prompt
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    const handleLater = () => {
        setShowPrompt(false);
        // Don't set dismissed flag, so it can appear again next visit
    };

    if (!showPrompt || !deferredPrompt) {
        return null;
    }

    return (
        <div className="install-prompt" role="dialog" aria-labelledby="install-title" aria-describedby="install-message">
            <div className="install-prompt__title-bar">
                <div className="install-prompt__title" id="install-title">
                    <svg className="install-prompt__icon" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 0C3.58 0 0 3.58 0 8s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm1 12H7V7h2v5zm0-6H7V4h2v2z" />
                    </svg>
                    {t('pwa_install_title')}
                </div>
                <button
                    className="install-prompt__close"
                    onClick={handleDismiss}
                    aria-label={t('pwa_install_close')}
                >
                    ×
                </button>
            </div>

            <div className="install-prompt__content">
                <div className="install-prompt__message" id="install-message">
                    <svg className="install-prompt__info-icon" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="15" stroke="#0000AA" strokeWidth="2" fill="#00AAFF" />
                        <text x="16" y="22" fontSize="18" fontWeight="bold" textAnchor="middle" fill="white">i</text>
                    </svg>
                    <div>
                        <p style={{ marginBottom: '8px', fontWeight: 'bold' }}>
                            {t('pwa_install_message_bold')}
                        </p>
                        <p style={{ fontSize: '14px' }}>
                            {t('pwa_install_message_description')}
                        </p>
                    </div>
                </div>

                <div className="install-prompt__buttons">
                    <button
                        className="install-prompt__button"
                        onClick={handleLater}
                    >
                        {t('pwa_install_later')}
                    </button>
                    <button
                        className="install-prompt__button install-prompt__button--primary"
                        onClick={handleInstall}
                    >
                        {t('pwa_install_button')}
                    </button>
                </div>
            </div>
        </div>
    );
};
