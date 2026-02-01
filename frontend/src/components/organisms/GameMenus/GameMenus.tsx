import React, { useEffect, useRef } from 'react';
import { useTranslation } from '@context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import logoGame from '@assets/images/game/PortfolioWebXP.png';
import logoGameWebP from '@assets/images/game/PortfolioWebXP.webp';
import USAIcon from '@assets/images/game/flags_USA.png';
import USAIconWebP from '@assets/images/game/flags_USA.webp';
import BRIcon from '@assets/images/game/flags_BR.png';
import BRIconWebP from '@assets/images/game/flags_BR.webp';
import ESPIcon from '@assets/images/game/flags_ESP.png';
import ESPIconWebP from '@assets/images/game/flags_ESP.webp';
import iconSwitch from 'pixelarticons/svg/switch.svg';
import iconEmail from '@assets/icons/socials_email-Sheet.png';
import iconGithub from '@assets/icons/socials_github-Sheet.png';
import iconLinkedin from '@assets/icons/socials_linkedin-Sheet.png';
import './GameMenus.css';
import { IconRenderer } from '@/components/atoms/IconRenderer/IconRenderer';

interface MenuProps {
  onStart: () => void;
}

export const StartMenu: React.FC<MenuProps> = ({
  onStart,
}) => {
  const { t, language, setLanguage } = useTranslation();
  const { playSfx } = useSound();

  useEffect(() => {
    playSfx('game_menu_in');
    return () => {
      playSfx('game_menu_out');
    };
  }, [playSfx]);

  const containerRef = useRef<HTMLDivElement>(null);

  const [canStart, setCanStart] = React.useState(false);

  const toggleLanguage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (language === 'en') {
      setLanguage('pt-BR');
    } else if (language === 'pt-BR') {
      setLanguage('es');
    } else {
      setLanguage('en');
    }
    playSfx('game_click');
  };

  const currentLanguageLabel =
    language === 'en'
      ? t('language_english')
      : language === 'pt-BR'
        ? t('language_portuguese')
        : t('language_spanish');

  const nextLangLabel =
    language === 'en'
      ? t('btn_to_pt')
      : language === 'pt-BR'
        ? t('btn_to_es')
        : t('btn_to_en');

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanStart(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!canStart) return;

    const handleStart = (event: KeyboardEvent | MouseEvent) => {
      const activeElement = document.activeElement as HTMLElement;

      const interactiveTags = ['BUTTON', 'A', 'INPUT', 'SELECT', 'TEXTAREA'];
      if (activeElement && interactiveTags.includes(activeElement.tagName)) return;

      if (event instanceof KeyboardEvent) {
        const ignoredKeys = ['Tab', 'Shift', 'Escape', 'Alt', 'Control', 'Meta'];
        if (ignoredKeys.includes(event.key)) return;
      }

      onStart();
      playSfx('game_confirm');
    };

    window.addEventListener('keydown', handleStart);
    window.addEventListener('click', handleStart);

    return () => {
      window.removeEventListener('keydown', handleStart);
      window.removeEventListener('click', handleStart);
    };
  }, [onStart, canStart]);

  return (
    <main
      ref={containerRef}
      className="game-menu game-menu--start"
      role="dialog"
      aria-modal="true"
      aria-labelledby="start-title"
    >
      <nav
        className="game-menu__lang-wrapper"
        aria-label={t('language_selector')}
      >
        <button
          type="button"
          onClick={toggleLanguage}
          className="game-menu__lang-btn"
          aria-label={`${nextLangLabel} — ${t(
            'current_language'
          )} ${currentLanguageLabel}`}
        >
          {language === 'en' && (
            <div className="game-menu__lang-option">
              <picture>
                <source srcSet={USAIconWebP} type="image/webp" />
                <img
                  src={USAIcon}
                  alt={t('icon_usa_alt')}
                  width="64"
                  height="64"
                />
              </picture>
              <p className="game-menu__lang-label game-menu__lang-label--flex">English<IconRenderer
                icon={iconSwitch}
                className="game-menu__icon-switch"
              /></p>
            </div>
          )}
          {language === 'pt-BR' && (
            <div className="game-menu__lang-option">
              <picture>
                <source srcSet={BRIconWebP} type="image/webp" />
                <img
                  src={BRIcon}
                  alt={t('icon_brazil_alt')}
                  width="64"
                  height="64"
                />
              </picture>
              <p className="game-menu__lang-label game-menu__lang-label--flex">
                Português Brasileiro{' '}
                <IconRenderer
                  icon={iconSwitch}
                  className="game-menu__icon-switch"
                />
              </p>
            </div>
          )}
          {language === 'es' && (
            <div className="game-menu__lang-option">
              <picture>
                <source srcSet={ESPIconWebP} type="image/webp" />
                <img
                  src={ESPIcon}
                  alt={t('icon_spain_alt')}
                  width="64"
                  height="64"
                />
              </picture>
              <p className="game-menu__lang-label game-menu__lang-label--flex">
                Español{' '}
                <IconRenderer
                  icon={iconSwitch}
                  className="game-menu__icon-switch"
                />
              </p>
            </div>
          )}
        </button>
      </nav>

      {/* Navigation buttons removed - moved to LevelSelectionScreen */}

      <section className="game-menu__header">
        <picture>
          <source srcSet={logoGameWebP} type="image/webp" />
          <img
            src={logoGame}
            alt={t('game_menu_logo_alt')}
            width={550}
            height={225}
            className="game-menu__logo"
          />
        </picture>

        <button
          id="start-title"
          type="button"
          onClick={() => {
            playSfx('game_confirm');
            onStart();
          }}
          className="game-menu__start-btn game-menu__title-text"
        >
          {t('start_prompt')}
        </button>

        <footer className='game-menu__footer'>
          <ul>
            <li>
              <a
                href="mailto:mewmewdevart@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                title={t('social_email')}
                aria-label={t('social_email')}
                className="game-menu__social-link"
              >
                <div
                  className="game-menu__social-sprite"
                  style={{ backgroundImage: `url(${iconEmail})` }}
                />
              </a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/mewmewdevart/"
                target="_blank"
                rel="noopener noreferrer"
                title={t('social_linkedin')}
                aria-label={t('social_linkedin')}
                className="game-menu__social-link"
              >
                <div
                  className="game-menu__social-sprite"
                  style={{ backgroundImage: `url(${iconLinkedin})` }}
                />
              </a>
            </li>
            <li>
              <a
                href="https://github.com/mewmewdevart"
                target="_blank"
                rel="noopener noreferrer"
                title={t('social_github')}
                aria-label={t('social_github')}
                className="game-menu__social-link"
              >
                <div
                  className="game-menu__social-sprite"
                  style={{ backgroundImage: `url(${iconGithub})` }}
                />
              </a>
            </li>
          </ul>
        </footer>
        <p className="game-menu__credits-text">{t('credits_developed_by')}</p>
      </section>
    </main>
  );
};
