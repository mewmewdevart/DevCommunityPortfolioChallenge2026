import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { useOS } from '@/context/OSContext';
import type { AppBaseProps } from '@/interfaces/types';
import ClipImage from "@assets/images/clipGif.gif";

import './VirtualAssistantApp.css';

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
  // 'clippy_tip_14',
  'clippy_tip_15',
  'clippy_tip_16',
  'clippy_tip_17',
] as const;

export const VirtualAssistantApp = ({ isAutoOpened }: AppBaseProps & { isAutoOpened?: boolean }) => {
  const { t } = useTranslation();
  const { closeWindow, getAppById } = useOS();

  const [currentKey, setCurrentKey] = useState<typeof TIP_KEYS[number]>(() => {
    return TIP_KEYS[Math.floor(Math.random() * TIP_KEYS.length)];
  });

  const [loading, setLoading] = useState(false);
  const [isPinned, setIsPinned] = useState(!isAutoOpened);

  const fetchNextTip = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * TIP_KEYS.length);
      setCurrentKey(TIP_KEYS[randomIndex]);
      setLoading(false);
    }, 1000);
  }, []);


  useEffect(() => {
    if (isPinned) {
      const interval = setInterval(fetchNextTip, 60000);
      return () => clearInterval(interval);
    }
  }, [fetchNextTip, isPinned]);

  useEffect(() => {
    if (isAutoOpened && !isPinned) {
      const timer = setTimeout(() => {
        closeWindow('assistant');
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [isAutoOpened, isPinned, closeWindow]);

  const handlePin = () => {
    setIsPinned(true);
  };

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

        <div className="clippy__actions">
          {!isPinned && (
            <button
              onClick={handlePin}
              className="clippy__btn-link"
              aria-label="Keep Clippy open"
            >
              {/* Example: [Stay Open] */}
            </button>
          )}

          {/* If we want a next tip button */}
          {/* <button onClick={fetchNextTip} className="clippy__btn-link">
            {t('next')}
          </button> */}
        </div>

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
