import React, { useRef, useEffect } from 'react';
import { useTranslation } from '@context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import computerImage from '@/assets/images/game/computer2-Sheet.png';
import videoGameImage from '@/assets/images/game/videoGame2-Sheet.png';
import curriculumImage from '@/assets/images/game/paper2-Sheet.png';
import mewtwoImage from '@/assets/images/game/mew2-Sheet.png';

import './GameMenus.css';

interface LevelSelectionScreenProps {
    onSelectGame: () => void;
    onSelectDesktop: () => void;
    onSelectVideoGame: () => void;
    onSelectCurriculum: () => void;
}

export const LevelSelectionScreen: React.FC<LevelSelectionScreenProps> = ({
    onSelectGame,
    onSelectDesktop,
    onSelectVideoGame,
    onSelectCurriculum,
}) => {
    const { t } = useTranslation();
    const containerRef = useRef<HTMLDivElement>(null);
    const playButtonRef = useRef<HTMLButtonElement>(null);
    const { playSfx } = useSound();

    useEffect(() => {
        playSfx('game_menu_in');
    }, [playSfx]);

    useEffect(() => {
        const timer = setTimeout(() => {
            playButtonRef.current?.focus();
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            ref={containerRef}
            className="game-menu game-menu--level-select"
            role="dialog"
            aria-modal="true"
            aria-label={t('level_select_title')}
        >
            <h2 className="game-menu__title game-menu__title--level-select">
                {t('level_select_title')}
            </h2>

            <div className="level-selection__grid">
                <button
                    className="level-selection__item"
                    onClick={() => {
                        playSfx('game_confirm');
                        onSelectGame();
                    }}
                    aria-label={t('level_select_game')}
                >
                    <div className="level-selection__image" style={{ backgroundImage: `url(${mewtwoImage})` }} />
                    <span className="level-selection__label">{t('level_select_game')}</span>
                </button>

                <button
                    className="level-selection__item"
                    onClick={() => {
                        playSfx('game_confirm');
                        onSelectCurriculum();
                    }}
                    aria-label={t('level_select_curriculum')}
                >
                    <div className="level-selection__image" style={{ backgroundImage: `url(${curriculumImage})` }} />
                    <span className="level-selection__label">{t('level_select_curriculum')}</span>
                </button>

                <button
                    className="level-selection__item"
                    onClick={() => {
                        playSfx('game_confirm');
                        onSelectDesktop();
                    }}
                    aria-label={t('level_select_desktop')}
                >
                    <div className="level-selection__image" style={{ backgroundImage: `url(${computerImage})` }} />
                    <span className="level-selection__label">{t('level_select_desktop')}</span>
                </button>

                <button
                    className="level-selection__item"
                    onClick={() => {
                        playSfx('game_confirm');
                        onSelectVideoGame();
                    }}
                    aria-label={t('level_select_videogame')}
                >
                    <div className="level-selection__image" style={{ backgroundImage: `url(${videoGameImage})` }} />
                    <span className="level-selection__label">{t('level_select_videogame')}</span>
                </button>
            </div>
        </div>
    );
};
