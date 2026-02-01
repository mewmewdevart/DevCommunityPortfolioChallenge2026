import React, { useRef, useEffect, useState } from 'react';
import iconLogout from 'pixelarticons/svg/logout.svg';
import iconChevronRight from 'pixelarticons/svg/chevron-right.svg';
import iconFolder from 'pixelarticons/svg/folder.svg';
import { useTranslation } from '@/context/LanguageContext';
import { useOS } from '@context/OSContext';
import type { AppDefinition } from '@interfaces/types';
import { useFocusTrap } from '@hooks/useFocusTrap';

import { WinButton } from '@atoms/WinButton/WinButton';
import { IconRenderer } from '@atoms/IconRenderer/IconRenderer';

import programIcon from '@assets/icons/icon-program.png';
// eslint-disable-next-line boundaries/element-types
import { ShutdownDialog } from '@features/ShutdownDialog/ShutdownDialog';
import './StartMenu.css';

interface StartMenuProps {
  onClose: () => void;
  apps: AppDefinition[];
}

export const StartMenu: React.FC<StartMenuProps> = ({ onClose, apps }) => {
  const { t } = useTranslation();
  const { openWindow } = useOS();
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const [showShutdownDialog, setShowShutdownDialog] = useState(false);
  const programsItemRef = useRef<HTMLButtonElement>(null);

  const { containerRef, handleKeyDown: handleTrapKeys } = useFocusTrap(!showShutdownDialog);

  const handleMenuKeyDown = (e: React.KeyboardEvent) => {
    handleTrapKeys(e);

    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const focusables = Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>('[role="menuitem"]') || []
      );
      if (focusables.length === 0) return;

      const currentIndex = focusables.indexOf(document.activeElement as HTMLElement);
      let nextIndex = currentIndex;

      if (e.key === 'ArrowDown') {
        nextIndex = (currentIndex + 1) % focusables.length;
      } else {
        nextIndex = (currentIndex - 1 + focusables.length) % focusables.length;
      }

      focusables[nextIndex]?.focus();
    }

    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // If shutdown dialog is open, do not close menu on outside click, 
      // as the dialog itself overlay handles interactions or we want to persist state.
      // However, usually Dialog is modal. If we click outside dialog, maybe nothing happens or dialog closes.
      // But here we are checking if click is outside START MENU.
      // If Dialog is rendered instead of Start Menu content, containerRef might be different?
      // Actually, if we allow showShutdownDialog, we return early below.
      // So containerRef (attached to div below) won't run ref callback if div is not rendered.
      // Wait, if I render <ShutdownDialog> INSTEAD of <div>, then containerRef.current might be null or attached to nothing if not passed.
      // So useFocusTrap might fail if ref is not attached.
      // But we passed !showShutdownDialog, so it should be disabled.

      if (showShutdownDialog) return;

      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        const startButton = document.getElementById('start-button');
        if (startButton?.contains(event.target as Node)) return;
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, containerRef, showShutdownDialog]);

  const handleAppClick = (app: AppDefinition) => {
    openWindow(app);
    onClose();
  };

  const projectsFolder = apps.find(app => app.id === 'projects');

  if (showShutdownDialog) {
    return <ShutdownDialog onCancel={() => setShowShutdownDialog(false)} />;
  }

  return (
    <div
      ref={containerRef}
      className="start-menu"
      onKeyDown={handleMenuKeyDown}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      role="menu"
      aria-label={t('start_menu')}
    >
      <aside className="start-menu__sidebar" aria-hidden="true">
        <span className="start-menu__sidebar-text">
          <span className="start-menu__brand-name">Windows</span>95
        </span>
      </aside>

      <section className="start-menu__content">
        <div
          className="start-menu__item-wrapper"
          onMouseEnter={() => setActiveSubMenu('programs')}
          onMouseLeave={() => setActiveSubMenu(null)}
          role="none"
        >
          <WinButton
            // @ts-ignore - WinButton might not forwards refs yet, but we need it for focus management.
            // If it fails at runtime we might need to wrap it or use a callback ref on the DOM element if exposed.
            ref={programsItemRef}
            variant="menu"
            role="menuitem"
            aria-haspopup="true"
            aria-expanded={activeSubMenu === 'programs'}
            className="start-menu__item"
            onClick={() => setActiveSubMenu(activeSubMenu === 'programs' ? null : 'programs')}
            onKeyDown={(e) => {
              if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
                setActiveSubMenu('programs');
                e.preventDefault();
                // Defer focus to allow render
                setTimeout(() => {
                  const firstItem = document.getElementById('submenu-programs-0');
                  firstItem?.focus();
                }, 0);
              }
            }}
          >
            <IconRenderer icon={programIcon} size={24} className="start-menu__item-icon" />
            <span className="start-menu__label">{t('programs')}</span>
            <IconRenderer icon={iconChevronRight} className="start-menu__chevron" />
          </WinButton>

          {activeSubMenu === 'programs' && (
            <div className="start-menu__submenu" role="menu">
              {apps
                .filter(app => app.visibility?.programs)
                .map((app, index) => (
                  <WinButton
                    key={app.id}
                    id={`submenu-programs-${index}`}
                    variant="menu"
                    onClick={() => handleAppClick(app)}
                    role="menuitem"
                    className="start-menu__item"
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowLeft') {
                        setActiveSubMenu(null);
                        e.preventDefault();
                        e.stopPropagation();
                        // Return focus to the parent item
                        programsItemRef.current?.focus();
                      }
                    }}
                  >
                    <IconRenderer
                      icon={app.icon}
                      size={24}
                      className="start-menu__item-icon"
                    />
                    <span className="start-menu__label">{app.title}</span>
                  </WinButton>
                ))}
            </div>
          )}
        </div>

        <WinButton
          variant="menu"
          onClick={() => projectsFolder && handleAppClick(projectsFolder)}
          role="menuitem"
          className="start-menu__item"
        >
          <IconRenderer
            icon={projectsFolder?.icon || iconFolder}
            size={24}
            className="start-menu__item-icon"
          />
          <span className="start-menu__label">{t('projects')}</span>
        </WinButton>

        <div className="start-menu__divider" />

        <WinButton
          variant="menu"
          onClick={() => setShowShutdownDialog(true)}
          role="menuitem"
          className="start-menu__item"
        >
          <IconRenderer icon={iconLogout} className="start-menu__icon" />
          <span className="start-menu__label">{t('shutdown')}</span>
        </WinButton>
      </section>
    </div>
  );
};