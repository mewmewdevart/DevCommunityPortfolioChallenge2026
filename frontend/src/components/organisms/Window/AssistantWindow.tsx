import React, { Suspense, useRef } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import type { WindowState } from '@interfaces/types';
import iconClose from 'pixelarticons/svg/close.svg';
import { IconRenderer } from '@atoms/IconRenderer/IconRenderer';
import { useOS } from '@context/OSContext';
import { useDraggable } from '@/hooks/desktop/useDraggable';
import { LoadingSpinner } from '@/components/atoms/LoadingSpinner/LoadingSpinner';

import './Window.css';

interface AssistantWindowProps {
    data: WindowState;
}

const TASKBAR_HEIGHT = 65;

export const AssistantWindow: React.FC<AssistantWindowProps> = ({ data }) => {
    const {
        focusWindow,
        updateWindowPosition,
        activeWindowId,
        closeWindow,
    } = useOS();
    const { t } = useTranslation();

    const containerRef = useRef<HTMLDivElement>(null);
    const isActive = activeWindowId === data.id;

    const dragResetKey = `${data.id}-${data.isMaximized}-${data.size.width}-${data.size.height}`;


    const { handleMouseDown, isDragging } = useDraggable(
        data.position,
        (pos) => updateWindowPosition(data.id, pos.x, pos.y),
        dragResetKey,
        {
            width: data.size.width,
            height: data.size.height,
            bottomOffset: TASKBAR_HEIGHT,
        }
    );

    const handleInteract = () => focusWindow(data.id);

    const baseStyle: React.CSSProperties = {
        zIndex: data.zIndex,
        width: data.size.width,
        height: data.size.height,
        transform: `translate3d(${data.position.x}px, ${data.position.y}px, 0)`,
        position: 'absolute',
        top: 0,
        left: 0,
        willChange: isDragging ? 'transform' : 'auto',
    };

    return (
        <div
            ref={containerRef}
            style={baseStyle}
            onMouseDown={(e) => {
                handleInteract();
                handleMouseDown(e);
            }}
            className={`window--assistant ${isActive ? 'window--active' : ''}`}
            role="dialog"
            aria-modal="false"
            aria-label={data.title}
            tabIndex={-1}
        >
            <button
                className="window__close-btn assistant-close-btn"
                onClick={(e) => {
                    e.stopPropagation();
                    closeWindow(data.id);
                }}
                aria-label={t('close_assistant')}
            >
                <IconRenderer
                    icon={iconClose}
                    size={14}
                    style={{ filter: 'invert(1)' }}
                />
            </button>
            <Suspense fallback={<LoadingSpinner />}>
                {data.component}
            </Suspense>
        </div>
    );
};
