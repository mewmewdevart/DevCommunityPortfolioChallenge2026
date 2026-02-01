import { useState, useCallback, useEffect, useRef } from 'react';
import type { Position, Size, ResizeEndHandler } from '@interfaces/types';

const DEFAULT_MIN_SIZE = { width: 300, height: 200 };

export const useWindowResize = (
  isActive: boolean,
  isMaximized: boolean,
  position: Position,
  initialSize: Size,
  onResizeEnd: ResizeEndHandler,
  taskbarHeight: number,
  minSize: Size = DEFAULT_MIN_SIZE
) => {
  const [size, setSize] = useState<Size>(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const sizeRef = useRef<Size>(initialSize);
  
  const { width: initWidth, height: initHeight } = initialSize;
  useEffect(() => {
    if (isResizing) return;
    setSize((prev) => {
      if (prev.width === initWidth && prev.height === initHeight) return prev;
      const next = { width: initWidth, height: initHeight };
      sizeRef.current = next;
      return next;
    });
  }, [initWidth, initHeight, isResizing]);

  const startResize = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isActive) return;
      e.stopPropagation();
      if (e.cancelable) e.preventDefault();
      setIsResizing(true);
    },
    [isActive]
  );

  useEffect(() => {
    if (!isResizing || isMaximized) return;

    const handleMove = (clientX: number, clientY: number) => {
      const viewportHeight = window.innerHeight;
      const maxBottomLimit = viewportHeight - taskbarHeight;
      const constrainedClientY = Math.min(clientY, maxBottomLimit);

      const rawWidth = clientX - position.x;
      const rawHeight = constrainedClientY - position.y;

      const newSize: Size = {
        width: Math.max(minSize.width, rawWidth),
        height: Math.max(minSize.height, rawHeight),
      };

      setSize(newSize);
      sizeRef.current = newSize;
    };

    const onMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      handleMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.cancelable) e.preventDefault();
      handleMove(e.touches[0].clientX, e.touches[0].clientY);
    };

    const onEnd = () => {
      setIsResizing(false);
      onResizeEnd(sizeRef.current.width, sizeRef.current.height);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [
    isResizing,
    isMaximized,
    position,
    taskbarHeight,
    onResizeEnd,
    minSize
  ]);

  return { size, isResizing, startResize };
};