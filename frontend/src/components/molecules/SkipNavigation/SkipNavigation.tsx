import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import './SkipNavigation.css';

export type AppMode = 'game' | 'desktop' | 'videogame' | 'paper';

interface SkipNavigationProps {
    onNavigate: (mode: AppMode) => void;
    currentMode: string;
}

export const SkipNavigation: React.FC<SkipNavigationProps> = ({ onNavigate, currentMode }) => {
    const { t, language, setLanguage } = useTranslation();

    const toggleLanguage = () => {
        if (language === 'en') {
            setLanguage('pt-BR');
        } else if (language === 'pt-BR') {
            setLanguage('es');
        } else {
            setLanguage('en');
        }
    };

    const nextLangLabel =
        language === 'en'
            ? t('btn_to_pt')
            : language === 'pt-BR'
                ? t('btn_to_es')
                : t('btn_to_en');

    return (
        <nav className="skip-navigation" aria-label={t('quick_navigation')}>
            <button
                className="skip-navigation__link"
                onClick={toggleLanguage}
            >
                {nextLangLabel}
            </button>

            {currentMode !== 'game' && (
                <button
                    className="skip-navigation__link"
                    onClick={() => onNavigate('game')}
                >
                    {t('skip_to_game')}
                </button>
            )}

            {currentMode !== 'desktop' && (
                <button
                    className="skip-navigation__link"
                    onClick={() => onNavigate('desktop')}
                >
                    {t('skip_to_desktop')}
                </button>
            )}

            {currentMode !== 'videogame' && (
                <button
                    className="skip-navigation__link"
                    onClick={() => onNavigate('videogame')}
                >
                    {t('skip_to_videogame')}
                </button>
            )}

            {currentMode !== 'paper' && (
                <button
                    className="skip-navigation__link"
                    onClick={() => onNavigate('paper')}
                >
                    {t('skip_to_paper')}
                </button>
            )}
        </nav>
    );
};
