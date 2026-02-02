import React, {
  useState,
  useRef,
  useCallback,
  useEffect,
} from 'react';
import type { AppDefinition, IconType } from '@interfaces/types';
import { APP_IDS } from '@/data/appIds';
import { useOS } from '@context/OSContext';
import { Taskbar } from '@organisms/Taskbar/Taskbar';
import { Window } from '@organisms/Window/Window';
import { DesktopIcon } from '@molecules/DesktopIcon/DesktopIcon';
import { BlueScreen } from '@features/BlueScreen/BlueScreen';
import { ShutdownScreen } from '@/components/pages/ShutdownScreen/ShutdownScreen';
import { useTranslation } from '@/context/LanguageContext';
import { useDesktopItems } from '@/hooks/desktop/useDesktopItems';
import { useDesktopSelection } from '@/hooks/desktop/useDesktopSelection';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useClippyController } from '@/hooks/desktop/useClippyController';

import './Desktop.css';

interface DesktopProps {
  apps?: AppDefinition[];
}

const GRID = {
  W: 100,
  H: 128,
  OFFSET_X: 10,
  OFFSET_Y: 10,
};

export const Desktop: React.FC<DesktopProps> = ({ apps = [] }) => {
  const { t } = useTranslation();
  const { windows, openWindow, isCrashed, isShutDown, rebootSystem } = useOS();

  const desktopRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useClippyController();

  const lastClick = useRef<{ id: string; time: number }>({ id: '', time: 0 });

  const {
    displayItems,
    computedPositions,
    handleDragEnd,
    dragVersion,
    arrangeIcons
  } = useDesktopItems(apps);

  const { selectedIconIds, setSelectedIconIds, selectionBox, handleMouseDown, handleKeyDown } = useDesktopSelection(
    displayItems,
    computedPositions,
    desktopRef
  );

  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const { containerRef: contextMenuRef, handleKeyDown: handleTrapKeys } = useFocusTrap(!!contextMenu);

  useEffect(() => {
    if (selectedIconIds.length === 1) {
      const id = selectedIconIds[0];
      const el = iconRefs.current[id];
      if (el) {
        el.focus();
      }
    }
  }, [selectedIconIds]);


  const { activeWindowId, closeWindow } = useOS();
  useKeyboardShortcuts({
    onCloseWindow: () => {
      if (activeWindowId) {
        closeWindow(activeWindowId);
      }
    },
    onEscape: () => {
      setContextMenu(null);
      setSelectedIconIds([]);
      desktopRef.current?.focus();
    },
  });

  const onboardingRef = useRef(false);
  useEffect(() => {
    if (onboardingRef.current) return;
    onboardingRef.current = true;

    const hasVisited = localStorage.getItem('portfolio_visited');
    if (!hasVisited) {
      localStorage.setItem('portfolio_visited', 'true');

      const welcomeApp = apps.find(a => a.id === APP_IDS.WELCOME);

      if (welcomeApp) {
        setTimeout(() => openWindow(welcomeApp), 500);
      }
    }
  }, [apps, openWindow]);

  const handleOpen = useCallback((id: string) => {
    const item = displayItems.find(i => i.id === id);
    if (!item) return;

    if (item.isSystemApp) {
      const app = apps.find(a => a.id === item.appId);
      if (app) openWindow(app);
      return;
    }

    if (item.type === 'folder') {
      const explorerApp = apps.find(a => a.id === 'computer') || apps.find(a => a.id === 'documents');
      if (explorerApp) {
        openWindow(explorerApp, { folderId: item.fsId });
      }
      return;
    }

    const app = apps.find(a => a.id === item.appId);
    if (app) {
      openWindow(app, {
        content: item.content,
        title: item.title
      });
    }
  }, [displayItems, apps, openWindow]);


  if (isCrashed) {
    return <BlueScreen onReboot={rebootSystem} />;
  }

  if (isShutDown) {
    return <ShutdownScreen onReboot={rebootSystem} />;
  }

  return (
    <main className="desktop">
      <a href="#desktop-icons" className="desktop__skip-link">
        {t('skip_to_content')}
      </a>

      <div id="desktop-nav-hint" className="sr-only" style={{ position: 'absolute', width: '1px', height: '1px', overflow: 'hidden', clip: 'rect(0,0,0,0)' }}>
        {t('desktop_nav_hint')}
      </div>

      <div
        ref={desktopRef}
        id="desktop-icons"
        className="desktop__inner"
      >
        <div className="desktop__icons-layer">
          {displayItems.map(item => {
            const pos = computedPositions[item.id];

            if (!pos) return null;

            const appShim: AppDefinition = {
              id: item.id,
              title: item.title,
              icon: item.icon as IconType,
              component: () => null,
            };

            const isSelected = selectedIconIds.includes(item.id);
            const isTabbable = selectedIconIds.length > 0
              ? isSelected && selectedIconIds[0] === item.id
              : false; 
            const isFirst = displayItems[0]?.id === item.id;
            const effectiveTabIndex = (isTabbable || (selectedIconIds.length === 0 && isFirst)) ? 0 : -1;

            return (
              <DesktopIcon
                key={item.id}
                ref={(el) => { iconRefs.current[item.id] = el; }}
                app={appShim}
                isSelected={isSelected}
                tabIndex={effectiveTabIndex}
                aria-describedby="desktop-nav-hint"
                initialPosition={{
                  x: GRID.OFFSET_X + pos.col * GRID.W,
                  y: GRID.OFFSET_Y + pos.row * GRID.H,
                }}
                onDragEnd={handleDragEnd}
                resetKey={dragVersion}
                onSelect={(id, multi) => {
                  const now = Date.now();
                  if (lastClick.current.id === id && now - lastClick.current.time < 500) {
                    handleOpen(id);
                    lastClick.current = { id: '', time: 0 };
                  } else {
                    lastClick.current = { id, time: now };
                  }
                  setSelectedIconIds(prev =>
                    multi ? Array.from(new Set([...prev, id])) : [id]
                  );
                }}
              />
            );
          })}
        </div>

        {selectionBox && (
          <div
            className="desktop__selection-box"
            style={{
              left: Math.min(selectionBox.start.x, selectionBox.current.x),
              top: Math.min(selectionBox.start.y, selectionBox.current.y),
              width: Math.abs(selectionBox.current.x - selectionBox.start.x),
              height: Math.abs(selectionBox.current.y - selectionBox.start.y),
            }}
          />
        )}

        {contextMenu && (
          <>
            <button
              className="desktop__context-menu-overlay"
              onClick={() => setContextMenu(null)}
              onContextMenu={e => e.preventDefault()}
              aria-label={t('close_button')}
              type="button"
            />
            <div
              ref={contextMenuRef}
              className="desktop__context-menu"
              style={{ left: contextMenu.x, top: contextMenu.y }}
              role="menu"
              aria-label={t('desktop_context_menu')}
              onKeyDown={(e) => {
                handleTrapKeys(e);
                if (e.key === 'Escape') setContextMenu(null);
              }}
            >
              <button
                className="desktop__context-menu-item"
                role="menuitem"
                tabIndex={0}
                onClick={() => {
                  arrangeIcons();
                  setContextMenu(null);
                }}
              >
                {t('arrange_icons')}
              </button>

              <div className="desktop__context-menu-separator" />
            </div>
          </>
        )}

        {windows.map(win => (
          <Window key={win.id} data={win} />
        ))}

        <div className="desktop__taskbar-layer">
          <Taskbar availableApps={apps} />
        </div>
      </div>
    </main>
  );
};