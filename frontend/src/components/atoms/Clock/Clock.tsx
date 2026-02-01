import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';

import './Clock.css';

export const Clock: React.FC = () => {
  const { t } = useTranslation();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="clock"
      aria-label={t('system_clock')}
      role="timer"
    >
      {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
    </div>
  );
};