import React, { useEffect, useRef } from 'react';
import { useTranslation } from '@context/LanguageContext';
import { useSound } from '@context/SoundContext';
import './BlueScreen.css';

interface BlueScreenProps {
  onReboot: () => void;
}

export const BlueScreen: React.FC<BlueScreenProps> = ({ onReboot }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { playSound } = useSound();

  useEffect(() => {
    playSound('error');
    ref.current?.focus();

    const reboot = (e?: Event) => {
      e?.preventDefault();
      onReboot();
    };

    window.addEventListener('keydown', reboot);
    window.addEventListener('click', reboot);
    window.addEventListener('touchstart', reboot);
    window.addEventListener('pointerdown', reboot);

    return () => {
      window.removeEventListener('keydown', reboot);
      window.removeEventListener('click', reboot);
      window.removeEventListener('touchstart', reboot);
      window.removeEventListener('pointerdown', reboot);
    };
  }, [onReboot, playSound]);

  return (
    <div
      ref={ref}
      tabIndex={-1}
      className="blue-screen"
    >
      <div className="blue-screen__content">
        <p className="blue-screen__title">
          {t('blue_screen_windows')}
        </p>

        <p className="blue-screen__message">
          {t('blue_screen_fatal_exception')}
        </p>

        <ul className="blue-screen__list">
          <li>{t('blue_screen_terminate')}</li>
          <li>
            {t('blue_screen_ctrl_alt_del')}
          </li>
        </ul>

        <p className="blue-screen__prompt">
          {t('blue_screen_press_any_key')}
        </p>
      </div>
    </div>
  );
};
