import React, { useEffect, Suspense } from 'react';
import { useOS } from '@context/OSContext';
import { useTranslation } from '@/context/LanguageContext';
import type { WindowState, MenuKey } from '@interfaces/types';
import { useDraggable } from '@/hooks/desktop/useDraggable';
import { useWindowResize } from '@/hooks/desktop/useWindowResize';
import { useFocusTrap } from '@hooks/useFocusTrap';
import { WinButton } from '@atoms/WinButton/WinButton';
import { IconRenderer } from '@atoms/IconRenderer/IconRenderer';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner/LoadingSpinner';
import { AssistantWindow } from './AssistantWindow';

import MinusIcon from 'pixelarticons/svg/minus.svg';
import ExpandIcon from 'pixelarticons/svg/expand.svg';
import RestoreIcon from 'pixelarticons/svg/duplicate.svg';
import CloseIcon from 'pixelarticons/svg/close.svg';

import './Window.css';

interface WindowProps {
  data: WindowState;
}

const TASKBAR_HEIGHT = 65;

// const MenuDropdownContent: React.FC<{
//   item: string;
//   t: (key: any) => string;
//   onAction: () => void;
//   windowId: string;
//   actions: { close: () => void; maximize: () => void; isMaximized: boolean };
// }> = ({ item, t, onAction, windowId, actions }) => {

//   useEffect(() => {
//     const firstItem = document.getElementById(`menu-${windowId}-${item}-0`);
//     if (firstItem) firstItem.focus();
//   }, [item, windowId]);

//   const handleKeyDown = (e: React.KeyboardEvent) => {
//     if (e.key === 'Escape') {
//       onAction();
//     }
//   }

//   return (
//     <>
//       {item === 'file' && (
//         <button
//           id={`menu-${windowId}-${item}-0`}
//           className="window__menu-dropdown-item"
//           role="menuitem"
//           onClick={(e) => {
//             e.stopPropagation();
//             actions.close();
//             onAction();
//           }}
//           onKeyDown={handleKeyDown}
//         >
//           {t('close')}
//         </button>
//       )}
//       {item === 'view' && (
//         <button
//           id={`menu-${windowId}-${item}-0`}
//           className="window__menu-dropdown-item"
//           role="menuitem"
//           onClick={(e) => {
//             e.stopPropagation();
//             actions.maximize();
//             onAction();
//           }}
//           onKeyDown={handleKeyDown}
//         >
//           {actions.isMaximized ? t('restore') : t('maximize')}
//         </button>
//       )}
//       {item === 'help' && (
//         <button
//           id={`menu-${windowId}-${item}-0`}
//           className="window__menu-dropdown-item"
//           role="menuitem"
//           onClick={(e) => {
//             e.stopPropagation();
//             alert(t('about_alert'));
//             onAction();
//           }}
//           onKeyDown={handleKeyDown}
//         >
//           {t('about')}
//         </button>
//       )}
//       {item === 'edit' && (
//         <div className="window__menu-dropdown-item disabled" style={{ opacity: 0.5, cursor: 'default' }}>
//           {t('no_actions')}
//         </div>
//       )}
//     </>
//   );
// };

export const Window: React.FC<WindowProps> = ({ data }) => {
  const { t } = useTranslation();

  const {
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    focusWindow,
    updateWindowPosition,
    updateWindowSize,
    activeWindowId,
  } = useOS();

  const isActive = activeWindowId === data.id;
  const [activeMenu, setActiveMenu] = React.useState<string | null>(null);

  useEffect(() => {
    const closeMenu = () => setActiveMenu(null);
    if (activeMenu) {
      window.addEventListener('click', closeMenu);
    }
    return () => window.removeEventListener('click', closeMenu);
  }, [activeMenu]);

  const { containerRef, handleKeyDown: handleTrapKeys } = useFocusTrap(isActive);

  const isAssistant = data.id.startsWith('assistant');
  const dragResetKey = `${data.id}-${data.isMaximized}-${data.size.width}-${data.size.height}`;

  const { position, handleMouseDown, handleTouchStart, isDragging } =
    useDraggable(
      data.position,
      (pos) => updateWindowPosition(data.id, pos.x, pos.y),
      dragResetKey,
      {
        width: data.size.width,
        height: data.size.height,
        bottomOffset: TASKBAR_HEIGHT,
      }
    );

  const { size, isResizing, startResize } = useWindowResize(
    isActive,
    data.isMaximized,
    position,
    data.size,
    (w, h) => updateWindowSize(data.id, w, h),
    TASKBAR_HEIGHT,
    { width: 300, height: 300 }
  );

  useEffect(() => {
    if (isActive && containerRef.current) {
      containerRef.current.focus({ preventScroll: true });
    }
  }, [isActive, containerRef]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isActive) return;

    handleTrapKeys(e);
  };

  if (data.isMinimized) return null;

  const handleInteract = () => focusWindow(data.id);

  const displayWidth = data.isMaximized ? '100%' : size.width;
  const displayHeight = data.isMaximized
    ? `calc(100vh - ${TASKBAR_HEIGHT}px)`
    : size.height;

  const baseStyle: React.CSSProperties = {
    zIndex: data.zIndex,
    width: displayWidth,
    height: displayHeight,
    transform: data.isMaximized
      ? 'none'
      : `translate3d(${position.x}px, ${position.y}px, 0)`,
    position: data.isMaximized ? 'fixed' : 'absolute',
    top: 0,
    left: 0,
    willChange: isDragging || isResizing ? 'transform, width, height' : 'auto',
  };

  if (isAssistant) {
    return <AssistantWindow data={data} />;
  }

  const hiddenMenuApps = ['messenger', 'welcome', 'calculator', 'google'];
  const shouldShowMenu = !hiddenMenuApps.some((k) => data.id.startsWith(k));
  const menuItems: MenuKey[] = ['file', 'edit', 'view', 'help'];

  return (
    <div
      ref={containerRef}
      style={baseStyle}
      onMouseDownCapture={handleInteract}
      onTouchStartCapture={handleInteract}
      onKeyDown={handleKeyDown}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      className={`window ${isActive ? 'window--active' : 'window--inactive'}`}
      role="dialog"
      aria-labelledby={`window-title-${data.id}`}
      aria-modal={isActive ? 'true' : 'false'}
      tabIndex={-1}
    >
      <div
        className={`window__title-bar ${isActive ? 'window__title-bar--active' : 'window__title-bar--inactive'}`}
        onMouseDown={(e) => !data.isMaximized && handleMouseDown(e)}
        onTouchStart={(e) => !data.isMaximized && handleTouchStart(e)}
        onDoubleClick={() => maximizeWindow(data.id)}
      >
        <div className="window__title-area" id={`window-title-${data.id}`}>
          <IconRenderer icon={data.icon} size={20} />
          <span className="window__title-text">{data.title}</span>
        </div>

        <div className="window__actions">
          <WinButton
            aria-label={t('minimize')}
            onClick={() => minimizeWindow(data.id)}
          >
            <img src={MinusIcon} className="window__action-icon" alt={t('window_btn_minimize_alt')} />
          </WinButton>

          <WinButton
            aria-label={data.isMaximized ? (t('restore')) : (t('maximize'))}
            onClick={() => maximizeWindow(data.id)}
          >
            {data.isMaximized ? (
              <img src={RestoreIcon} className="window__action-icon" alt={t('window_btn_restore_alt')} />
            ) : (
              <img src={ExpandIcon} className="window__action-icon" alt={t('window_btn_maximize_alt')} />
            )}
          </WinButton>

          <WinButton
            aria-label={t('close')}
            onClick={() => closeWindow(data.id)}
          >
            <img src={CloseIcon} className="window__action-icon" alt={t('window_btn_close_alt')} />
          </WinButton>
        </div>
      </div>

      {shouldShowMenu && (
        <div className="window__menu" role="menubar">
          {menuItems.map((item) => (
            <div key={item} style={{ position: 'relative' }} role="none">
              <button
                className={`window__menu-item not-allowed ${activeMenu === item ? 'window__menu-item--active' : ''}`}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={activeMenu === item}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveMenu(activeMenu === item ? null : item);
                }}
                onMouseEnter={() => {
                  if (activeMenu) setActiveMenu(item);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowDown' && activeMenu === item) {
                    const firstItem = document.getElementById(`menu-${data.id}-${item}-0`);
                    firstItem?.focus();
                    e.preventDefault();
                  }
                  if (e.key === 'ArrowDown' && !activeMenu) {
                    setActiveMenu(item);
                    e.preventDefault();
                  }
                }}
              >
                {t(item)}
              </button>

              {activeMenu === item && (
                <div
                  className="window__menu-dropdown"
                  role="menu"
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  {/* <MenuDropdownContent
                    item={item}
                    t={t}
                    onAction={() => setActiveMenu(null)}
                    windowId={data.id}
                    actions={{
                      close: () => closeWindow(data.id),
                      maximize: () => maximizeWindow(data.id),
                      isMaximized: data.isMaximized
                    }}
                  /> */}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="window__content">
        <Suspense fallback={<div className="window__loading"><LoadingSpinner /></div>}>
          {data.component}
        </Suspense>

        {!isActive && <div className="window__overlay" />}
      </div>

      {!data.isMaximized && (
        <div
          className="window__resize-handle"
          onMouseDown={startResize}
          onTouchStart={startResize}
          aria-hidden="true"
          title={t('window_resize')}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" className="window__resize-icon">
            <path d="M8 11H11V8" stroke="gray" fill="none" />
            <path d="M4 11H7V11" stroke="gray" fill="none" />
            <path d="M11 7V4" stroke="gray" fill="none" />
          </svg>
        </div>
      )}
    </div>
  );
};