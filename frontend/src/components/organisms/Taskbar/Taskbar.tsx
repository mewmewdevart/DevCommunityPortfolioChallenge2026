import React, { useState, useEffect, useRef } from 'react';
import type { AppDefinition } from '@interfaces/types';
import { useOS } from '@context/OSContext';
import { useTranslation } from '@context/LanguageContext';
import { WinButton } from '@atoms/WinButton/WinButton';
import { IconRenderer } from '@atoms/IconRenderer/IconRenderer';
import { Clock } from '@/components/atoms/Clock/Clock';
import { VolumeControl } from '@/components/atoms/VolumeControl/VolumeControl';

import iconWindows from '@assets/icons/icon-window-default.png';
import iconWindowsWebP from '@assets/icons/icon-window-default.webp';
import { StartMenu } from '@organisms/StartMenu/StartMenu';

import './Taskbar.css';

interface TaskbarProps {
  availableApps: AppDefinition[];
}

export const Taskbar: React.FC<TaskbarProps> = ({ availableApps }) => {
  const { t, language, setLanguage } = useTranslation();

  const { windows, activeWindowId, focusWindow, minimizeWindow } = useOS();
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [, setTime] = useState(new Date());
  const [visibleTooltipId, setVisibleTooltipId] = useState<string | null>(null);

  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startMenuRef = useRef<HTMLDivElement>(null);

  const TITLE_CHAR_LIMIT = 16;
  const MAX_TASKBAR_ITEMS = 6;
  const TOOLTIP_DELAY_MS = 1600;

  const toggleLanguage = () => {
    if (language === 'en') {
      setLanguage('pt-BR');
    } else if (language === 'pt-BR') {
      setLanguage('es');
    } else {
      setLanguage('en');
    }
  };

  const nextLangLabel =
    language === 'en'
      ? t('btn_to_pt')
      : language === 'pt-BR'
        ? t('btn_to_es')
        : t('btn_to_en');

  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.key === 'Meta' || (e.ctrlKey && e.key === 'Escape')) {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('toggle-start-menu'));
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);

    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeys);
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        startMenuRef.current &&
        !startMenuRef.current.contains(event.target as Node)
      ) {
        setIsStartOpen(false);
      }
    };

    if (isStartOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isStartOpen]);

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  const handleWindowClick = (id: string) => {
    const win = windows.find((w) => w.id === id);

    setIsStartOpen(false);

    if (activeWindowId === id && !win?.isMinimized) {
      minimizeWindow(id);
    } else {
      focusWindow(id);
    }
  };

  const formatTitle = (title: string) => {
    if (title.length > TITLE_CHAR_LIMIT) {
      return title.substring(0, TITLE_CHAR_LIMIT) + '...';
    }
    return title;
  };

  const handleMouseEnter = (id: string) => {
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);

    hoverTimerRef.current = setTimeout(() => {
      setVisibleTooltipId(id);
    }, TOOLTIP_DELAY_MS);
  };

  const handleMouseLeave = () => {
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
    setVisibleTooltipId(null);
  };

  const visibleWindows = windows.slice(0, MAX_TASKBAR_ITEMS);

  return (
    <footer
      className="taskbar"
      role="contentinfo"
      aria-label={t('taskbar_label') || "Taskbar"}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >

      <div className="taskbar__start-menu-wrapper" ref={startMenuRef}>
        {isStartOpen && (
          <div className="taskbar__start-popup">
            <StartMenu
              onClose={() => setIsStartOpen(false)}
              apps={availableApps}
            />
          </div>
        )}

        <WinButton
          id="start-button"
          active={isStartOpen}
          onClick={() => setIsStartOpen(!isStartOpen)}
          className="taskbar__start-btn"
          variant="taskbar"
          aria-haspopup="true"
          aria-expanded={isStartOpen}
          aria-label={t('start_menu')}
        >
          <picture>
            <source srcSet={iconWindowsWebP} type="image/webp" />
            <img
              src={iconWindows}
              alt={t('alt_taskbar_start_icon')}
              className="taskbar__icon"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
              aria-hidden="true"
              width={16}
              height={16}
            />
          </picture>
          <span className="taskbar__start-text">{t('start')}</span>
        </WinButton>
      </div>

      <div className="taskbar__divider" />


      <nav className="taskbar__windows" aria-label={t('running_apps') || "Running applications"}>
        {visibleWindows.map((win) => {
          const isTruncated = win.title.length > TITLE_CHAR_LIMIT;
          const isActive = activeWindowId === win.id && !win.isMinimized;

          return (
            <div
              key={win.id}
              className="taskbar__window-item"
              onMouseEnter={() => handleMouseEnter(win.id)}
              onMouseLeave={handleMouseLeave}
              onClick={handleMouseLeave}
            >
              {visibleTooltipId === win.id && isTruncated && (
                <div className="taskbar__tooltip" role="tooltip">
                  {win.title}
                </div>
              )}

              <WinButton
                active={isActive}
                onClick={() => handleWindowClick(win.id)}
                className="taskbar__window-btn"
                variant="taskbar"
                aria-label={`Switch to ${win.title}`}
                aria-pressed={isActive}
              >
                <IconRenderer
                  icon={win.icon}
                  size={16}
                  className="taskbar__window-icon"
                  alt={t('alt_taskbar_app_icon')}
                />
                <span className="taskbar__window-text">
                  {formatTitle(win.title)}
                </span>
              </WinButton>
            </div>
          );
        })}
      </nav>

      <div className="taskbar__divider" />


      <div className="taskbar__tray">
        <button
          onClick={toggleLanguage}
          className="taskbar__language-btn"
          title={nextLangLabel}
          aria-label={nextLangLabel}
        >
          {language === 'en' ? '🇺🇸' : language === 'pt-BR' ? '🇧🇷' : '🇪🇸'}
        </button>

        <VolumeControl />
        <Clock />
      </div>
    </footer>
  );
};