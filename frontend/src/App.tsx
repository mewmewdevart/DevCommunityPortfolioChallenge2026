import React, { useEffect, useState, Suspense } from 'react';
import { OSProvider } from '@context/OSContext';
import { ErrorBoundary } from '@/components/atoms/ErrorBoundary/ErrorBoundary';
import { FileSystemProvider } from '@context/FileSystemContext';
import { HelmetProvider } from 'react-helmet-async';
import { SEO } from '@/components/atoms/SEO/SEO';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner/LoadingSpinner';

import { AppRegistry } from "@/data/AppRegistry"
import { LanguageProvider } from '@/context/LanguageContext';
import { AnnouncementProvider } from '@/context/AnnouncementContext';
import { SoundProvider } from '@/context/SoundContext';
import { SettingsProvider, useSettings } from '@/context/SettingsContext';
import { CRTEffect } from '@/features/CRTEffect/CRTEffect';
import { ReloadPrompt } from '@/components/pages/ReloadPrompt/ReloadPrompt';
import { SkipNavigation, type AppMode } from '@/components/molecules/SkipNavigation/SkipNavigation';
import './App.css';

// Lazy load heavy components
const Desktop = React.lazy(() => import('@/components/pages/Desktop/Desktop').then(module => ({ default: module.Desktop })));
const BootScreen = React.lazy(() => import('@/components/pages/BootScreen/BootScreen').then(module => ({ default: module.BootScreen })));
const LoginScreen = React.lazy(() => import('@/components/pages/LoginScreen/LoginScreen').then(module => ({ default: module.LoginScreen })));
const VideoGame = React.lazy(() => import('@/components/pages/VideoGameScreen/VideoGameScreen').then(module => ({ default: module.VideoGame })));
const Game = React.lazy(() => import('@/components/pages/Game/Game').then(module => ({ default: module.Game })));
const ShutdownScreen = React.lazy(() => import('@/components/pages/ShutdownScreen/ShutdownScreen').then(module => ({ default: module.ShutdownScreen })));
const PaperScreen = React.lazy(() => import('@/components/pages/PaperScreen/PaperScreen').then(module => ({ default: module.PaperFold })));

type SystemState = 'game' | 'boot' | 'login' | 'desktop' | 'videogame' | 'shutdown_transition' | 'paper';

const App: React.FC = () => {
  const [systemState, setSystemState] = useState<SystemState>('game');

  useEffect(() => {
    const updateViewportHeight = () => {
      requestAnimationFrame(() => {
        const vh = window.visualViewport?.height ?? window.innerHeight;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
      });
    };
    updateViewportHeight();
    window.visualViewport?.addEventListener('resize', updateViewportHeight);
    window.addEventListener('resize', updateViewportHeight);
    return () => {
      window.visualViewport?.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('resize', updateViewportHeight);
    };
  }, []);

  useEffect(() => {
    if (systemState === 'shutdown_transition') {
      const timer = setTimeout(() => {
        setSystemState('game');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [systemState]);

  const handleGameComplete = () => {
    setSystemState('boot');
  };

  const handleBootComplete = () => {
    setSystemState('login');
  };

  const handleLogin = () => {
    setSystemState('desktop');
  };

  const handleVideoGameRequest = () => {
    setSystemState('videogame');
  };

  const handleVideoGameBack = () => {
    setSystemState('game');
  };

  const handleReturnToGame = () => {
    setSystemState('shutdown_transition');
  };

  const handleSkipNavigation = (mode: AppMode) => {
    setSystemState(mode as SystemState);
  };

  return (
    <FileSystemProvider>
      <LanguageProvider>
        <HelmetProvider>
          <AnnouncementProvider>
            <SoundProvider>
              <SettingsProvider>
                <ErrorBoundary>
                  <SEO />
                  <OSProvider
                    apps={AppRegistry}
                    onReboot={() => setSystemState('boot')}
                    onReturnToGame={handleReturnToGame}
                  >
                    <SkipNavigation onNavigate={handleSkipNavigation} currentMode={systemState} />
                    <CRTEffectWrapper />
                    <ReloadPrompt />
                    <main>
                      <Suspense fallback={<div className="app-loader"><LoadingSpinner /></div>}>
                        {systemState === 'game' && <Game onLoginRequest={handleGameComplete} onVideoGameRequest={handleVideoGameRequest} />}
                        {systemState === 'boot' && <BootScreen onComplete={handleBootComplete} />}
                        {systemState === 'login' && <LoginScreen onLogin={handleLogin} onCancel={handleReturnToGame} />}
                        {systemState === 'desktop' && <Desktop apps={AppRegistry} />}
                        {systemState === 'videogame' && <VideoGame onBack={handleVideoGameBack} />}
                        {systemState === 'paper' && <PaperScreen />}
                        {systemState === 'shutdown_transition' && <ShutdownScreen onReboot={() => setSystemState('boot')} />}
                      </Suspense>
                    </main>
                  </OSProvider>
                </ErrorBoundary>
              </SettingsProvider>
            </SoundProvider>
          </AnnouncementProvider>
        </HelmetProvider>
      </LanguageProvider>
    </FileSystemProvider>
  );
};

const CRTEffectWrapper: React.FC = () => {
  const { crtEnabled } = useSettings();
  if (!crtEnabled) return null;
  return <CRTEffect />;
};

export default App;