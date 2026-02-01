import React from 'react';
import { IconRenderer } from '@atoms/IconRenderer/IconRenderer';
import iconHome from 'pixelarticons/svg/home.svg';
import iconEye from 'pixelarticons/svg/eye.svg';
import iconExpand from 'pixelarticons/svg/expand.svg';
import iconSoundOn from 'pixelarticons/svg/volume-3.svg';
import iconSoundOff from 'pixelarticons/svg/volume-x.svg';
import { type Vector2 } from '@interfaces/types';
import { useTranslation } from '@context/LanguageContext';
import { useSettings } from '@/context/SettingsContext';
import { useSound } from '@/context/SoundContext';

import './GameHUD.css';

interface HUDProps {
  playerPos: Vector2;
  onReturnToMenu: () => void;
}

export const GameHUD: React.FC<HUDProps> = ({
  playerPos,
  onReturnToMenu,
}) => {
  const { t } = useTranslation();
  const { crtEnabled, toggleCrt } = useSettings();
  const { toggleMute, isMuted } = useSound();

  return (
    <div className="game-hud">
      {/* Coordinates */}
      {/* <div className="game-hud__coords" aria-hidden="true">
        <span>
          {Math.round(playerPos.x / TILE_WIDTH)},
          {Math.round(playerPos.y / TILE_HEIGHT)}
        </span>
      </div> */}

      {/* Controls */}
      <div className="game-hud__controls">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onReturnToMenu();
          }}
          className="game-hud__control-btn"
          title={t('game_menu')}
          aria-label={t('game_menu')}
        >
          <IconRenderer icon={iconHome} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleCrt();
          }}
          className={`game-hud__control-btn ${!crtEnabled ? 'is-disabled' : ''
            }`}
          title={crtEnabled ? 'Disable CRT Effect' : 'Enable CRT Effect'}
          aria-label={crtEnabled ? 'Disable CRT Effect' : 'Enable CRT Effect'}
        >
          <IconRenderer icon={iconEye} />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          className="game-hud__control-btn"
          title={isMuted ? 'Unmute' : 'Mute'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          <IconRenderer icon={isMuted ? iconSoundOff : iconSoundOn} />
        </button>

        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen?.();
            }
          }}
          className="game-hud__control-btn"
          title={t('game_fullscreen')}
          aria-label={t('game_fullscreen')}
        >
          <IconRenderer icon={iconExpand} />
        </button>
      </div>
    </div>
  );
};
