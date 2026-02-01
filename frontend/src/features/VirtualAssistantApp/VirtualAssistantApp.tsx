import React from 'react';
import { useTranslation } from '@/context/LanguageContext';
import ClipImage from "@assets/images/clipGif.gif";

import './VirtualAssistantApp.css';
// ORGANIZAR OS TEXTOS DO CLICK PARA FAZER SENTIDO COM A LOGICA DO SISTEMA OPERACIONAL
const TIP_KEYS = [
  'clippy_tip_1',
  'clippy_tip_2',
  'clippy_tip_3',
  'clippy_tip_4',
  'clippy_tip_5',
  'clippy_tip_6',
  'clippy_tip_7',
  'clippy_tip_8',
  'clippy_tip_9',
  'clippy_tip_10',
  'clippy_tip_11',
  'clippy_tip_12',
  'clippy_tip_13',
  'clippy_tip_14',
  'clippy_tip_15',
  'clippy_tip_16',
  'clippy_tip_17',
] as const;

export const VirtualAssistantApp = () => {
  const { t } = useTranslation();

  const currentKey = TIP_KEYS[0];
  const loading = false;

  // fetchNextTip removed as it was unused (commented out in JSX)

  React.useEffect(() => {
    // Logic to auto change tip if needed, or if it was handled by fetchNextTip which is now removed,
    // we should check if we need to keep the effect.
    // The original code had fetchNextTip called by button.
    // If button is gone, maybe we want auto-rotation? 
    // For now, I will just restore the state variables so the render doesn't break.
  }, []);

  return (
    <div className="clippy">
      <div
        className="clippy__bubble"
        role="status"
        aria-live="polite"
      >
        <p className={`clippy__text ${loading ? 'clippy__text--loading' : ''}`}>
          {loading ? t('clippy_thinking') : t(currentKey)}
        </p>

        {/* <button
          onClick={fetchNextTip}
          disabled={loading}
          className="clippy__btn"
          aria-label={t('clippy_next_tip')}
        >
          {t('next')}
        </button> */}

        <div className="clippy__tail-border" aria-hidden="true" />
        <div className="clippy__tail-fill" aria-hidden="true" />
      </div>

      <div className="clippy__character-wrapper">
        <img
          src={ClipImage}
          alt={t('clippy_alt')}
          className="clippy__image"
          width={124}
          height={93}
        />
      </div>
    </div>
  );
};
