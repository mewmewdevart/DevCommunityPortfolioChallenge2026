import React, { useMemo, forwardRef } from 'react';
import { useDraggable } from '@/hooks/desktop/useDraggable';
import { IconRenderer } from '@atoms/IconRenderer/IconRenderer';
import type { AppDefinition } from '@interfaces/types';
import './DesktopIcon.css';

interface DesktopIconProps {
  app: AppDefinition;
  initialPosition: { x: number; y: number };
  onDragEnd: (id: string, x: number, y: number) => void;
  onSelect: (id: string, multi: boolean) => void;
  isSelected: boolean;
  resetKey: number;
  tabIndex?: number;
}

export const DesktopIcon = forwardRef<HTMLButtonElement, DesktopIconProps>(({
  app,
  initialPosition,
  onDragEnd,
  onSelect,
  isSelected,
  resetKey,
  tabIndex = 0
}, ref) => {

  const boundaryConfig = useMemo(() => ({
    width: 100,
    height: 128,
    bottomOffset: 50
  }), []);

  const { position, handleMouseDown, handleTouchStart, isDragging } = useDraggable(
    initialPosition,
    (pos) => onDragEnd(app.id, pos.x, pos.y),
    resetKey,
    boundaryConfig
  );

  const handleIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const isMulti = e.ctrlKey || e.metaKey || e.shiftKey;
    onSelect(app.id, isMulti);
  };

  return (
    <button
      ref={ref}
      type="button"
      className={`desktop-icon ${isSelected ? 'desktop-icon--selected' : ''} ${isDragging ? 'desktop-icon--dragging' : ''}`}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      onMouseDown={(e) => {
        handleIconClick(e);
        handleMouseDown(e);
      }}
      onClick={handleIconClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          e.stopPropagation();
          onSelect(app.id, false);
          // Simulate double click open
          const doubleClickEvent = new MouseEvent('dblclick', {
            bubbles: true,
            cancelable: true,
            view: window
          });
          e.currentTarget.dispatchEvent(doubleClickEvent);
        }
      }}
      onTouchStart={handleTouchStart}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      aria-label={app.title}
      aria-pressed={isSelected}
      tabIndex={tabIndex}
    >
      <div className="desktop-icon__img-wrapper">
        <IconRenderer
          icon={app.icon}
          size={64}
          className="desktop-icon__img"
          alt=""
        />
      </div>

      <div className="desktop-icon__label">
        <span className="desktop-icon__text">
          {app.title}
        </span>
      </div>
    </button>
  );
});

DesktopIcon.displayName = 'DesktopIcon';