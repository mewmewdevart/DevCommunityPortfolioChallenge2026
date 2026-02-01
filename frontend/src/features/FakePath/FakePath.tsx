import React, { useEffect } from 'react';
import { useOS } from '@context/OSContext';
import { useTranslation } from '@context/LanguageContext';
import { useSound } from '@context/SoundContext';

import './FakePath.css';

export const FakePath: React.FC = () => {
  const { crashSystem } = useOS();
  const { t } = useTranslation();
  const { playSound } = useSound();

  useEffect(() => {
    playSound('error');
    const timer = setTimeout(() => {
      crashSystem();
    }, 300);

    return () => clearTimeout(timer);
  }, [crashSystem, playSound]);

  return (
    <div className="fakepath" role="alert" aria-live="assertive">
      <p className="fakepath__line">{'>'} {t('fakepath_corrupted')}</p>
      <p className="fakepath__line">{'>'} {t('fakepath_critical_process')}</p>
      <p className="fakepath__line">{'>'} {t('fakepath_memory_dump')}</p>
    </div>
  );
};