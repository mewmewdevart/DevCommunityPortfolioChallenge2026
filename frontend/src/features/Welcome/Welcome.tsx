import { useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import './Welcome.css';

export const Welcome = () => {
  const { t } = useTranslation();
  const { playSound } = useSound();

  useEffect(() => {
    playSound('success');
  }, [playSound]);
  return (
    <div className="welcome">
      <div className="welcome__header">
        <h1 className="welcome__title">{t('welcome_title')}</h1>
        <p className="welcome__subtitle">{t('welcome_subtitle')}</p>
      </div>

      <div className="welcome__content">
        <p className="welcome__text">{t('welcome_intro')}</p>
        <p className="welcome__text"><strong>{t('welcome_features_title')}</strong></p>
        <ul className="welcome__list">
          <li>{t('welcome_feature_1')}</li>
          <li>{t('welcome_feature_2')}</li>
          <li>{t('welcome_feature_3')}</li>
          <li>{t('welcome_feature_4')}</li>
          <li>{t('welcome_feature_5')}</li>
          <li>{t('welcome_feature_6')}</li>
        </ul>
        <p className="welcome__footer">{t('welcome_footer')}</p>
      </div>
    </div>
  );
};