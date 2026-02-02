import React, { useMemo, useState, Suspense } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { VIDEOGAME_CONFIG } from '@/interfaces/constants';
import './VideoGameScreen.css';

const HIDDEN_INDICES = new Set(VIDEOGAME_CONFIG.HIDDEN_INDICES);
const getRandomColor = () => {
  const variations = [
    'var(--blue-500)',
    'var(--blue-700)',
    'var(--blue-900)',
    'var(--dark-500)',
    'var(--dark-600)'
  ];
  return variations[Math.floor(Math.random() * variations.length)];
};

const { BOX_COUNT } = VIDEOGAME_CONFIG;

interface BoxData {
  id: number;
  color: string;
  isHidden: boolean;
}

interface VideoGameProps {
  onBack: () => void;
}

const MemoryCardScreen = React.lazy(() => import('../MemoryCardScreen/MemoryCardScreen'));

const VideoGame: React.FC<VideoGameProps> = ({ onBack }) => {
  const { t } = useTranslation();
  const { playSfx } = useSound();
  const sceneRef = React.useRef<HTMLDivElement>(null);
  const lastTimeRef = React.useRef<number | undefined>(undefined);
  const requestRef = React.useRef<number | undefined>(undefined);
  const angleRef = React.useRef(0);

  const [introFinished, setIntroFinished] = useState(false);

  const [boxData] = useState<BoxData[]>(() => {
    const data: BoxData[] = [];
    for (let i = 0; i < BOX_COUNT; i++) {
      data.push({
        id: i,
        color: getRandomColor(),
        isHidden: HIDDEN_INDICES.has(i),
      });
    }
    return data;
  });

  React.useEffect(() => {
    playSfx('game_ps2_startup');

    // Play title sound when branding appears (68% of 16s animation = ~10.88s)
    const titleSoundTimer = setTimeout(() => {
      playSfx('game_ps2_title');
    }, 10800);

    const introDuration = 14000;

    const finishIntro = () => {
      setIntroFinished(true);
    };

    const timer = setTimeout(finishIntro, introDuration);

    return () => {
      clearTimeout(timer);
      clearTimeout(titleSoundTimer);
    };
  }, []);

  const animateRef = React.useRef<(time: number) => void>(null);

  const animate = React.useCallback((time: number) => {
    if (introFinished) return;

    if (requestRef.current === undefined) {
      if (animateRef.current) {
        requestRef.current = requestAnimationFrame(animateRef.current);
      }
      return;
    }

    const deltaTime = time - (lastTimeRef.current ?? time);
    lastTimeRef.current = time;

    if (document.visibilityState === 'visible' && sceneRef.current) {
      const speed = 0.2 * (deltaTime / 16.67);

      angleRef.current += speed;
      const rotateX = 60 + Math.sin(angleRef.current * 0.01) * 10;
      const rotateZ = angleRef.current;
      sceneRef.current.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`;
    }

    if (animateRef.current) {
      requestRef.current = requestAnimationFrame(animateRef.current);
    }
  }, [introFinished]);

  React.useEffect(() => {
    animateRef.current = animate;
  }, [animate]);

  React.useEffect(() => {
    if (!introFinished) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [animate, introFinished]);

  const dynamicStyles = useMemo(() => {
    return boxData.map((box) => `
      .videogame-box-${box.id} {
        background-color: ${box.color};
      }
    `).join('');
  }, [boxData]);

  if (introFinished) {
    return (
      <Suspense fallback={<div className="videogame-screen__loader" />}>
        <MemoryCardScreen onBack={onBack} />
      </Suspense>
    );
  }

  return (
    <main className="videogame-screen">
      <style>{dynamicStyles}</style>

      {/* Back Button */}
      {/* <button
        onClick={onBack}
        className="videogame-back-btn"
        aria-label={t('videogame_back_aria')}
      >
        {t('videogame_back')}
      </button> */}

      {/* Content Overlay */}
      <header className="videogame-content">
        <p className="videogame-copyright">
          {t('videogame_copyright')}
        </p>
        <h1 className="videogame-branding">
          {t('videogame_branding')}
          <span className="videogame-branding-small">®</span>
          &nbsp;2
        </h1>
      </header>

      <div className="videogame-scene" ref={sceneRef}>
        <div className="videogame-nebula" />

        <div className="videogame-particles">
          <span className="videogame-particle videogame-particle--red" />
          <span className="videogame-particle videogame-particle--green" />
          <span className="videogame-particle videogame-particle--blue" />
        </div>

        {boxData.map((box) => (
          <div
            key={box.id}
            className={`videogame-box videogame-box-${box.id} ${box.isHidden ? 'videogame-box--hidden' : ''}`}
          />
        ))}
      </div>
    </main>
  );
};

export { VideoGame };
export default VideoGame;