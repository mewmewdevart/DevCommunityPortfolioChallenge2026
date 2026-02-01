import { useState, useEffect, useCallback, useRef } from 'react';
import type { Position } from '@interfaces/types';

interface BoundaryConfig {
  width: number;
  height: number;
  bottomOffset?: number;
}

export const useDraggable = (
  initialPosition: Position,
  onDragEnd: (pos: Position) => void,
  resetKey: number | string = 0,
  boundary?: BoundaryConfig
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<Position>(initialPosition);

  const stateRef = useRef<{
    offset: Position;
    position: Position;
    boundary?: BoundaryConfig;
    resetKey?: number | string;
  }>({
    offset: { x: 0, y: 0 },
    position: initialPosition,
    boundary,
    resetKey,
  });

  useEffect(() => {
    stateRef.current.boundary = boundary;
  }, [boundary]);


  useEffect(() => {
    setPosition(initialPosition);
    stateRef.current.position = initialPosition;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const startDrag = useCallback((clientX: number, clientY: number) => {
    const currentPos = stateRef.current.position;

    stateRef.current.offset = {
      x: clientX - currentPos.x,
      y: clientY - currentPos.y,
    };

    setIsDragging(true);
  }, []);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      startDrag(e.clientX, e.clientY);
    },
    [startDrag]
  );

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      e.stopPropagation();
      const touch = e.touches[0];
      startDrag(touch.clientX, touch.clientY);
    },
    [startDrag]
  );

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (clientX: number, clientY: number) => {
      const { offset, boundary: currentBoundary } = stateRef.current;

      let newX = clientX - offset.x;
      let newY = clientY - offset.y;

      if (currentBoundary) {
        const maxX = window.innerWidth - currentBoundary.width;
        const maxY =
          window.innerHeight -
          currentBoundary.height -
          (currentBoundary.bottomOffset ?? 0);

        const SNAP_THRESHOLD = 20;

        if (newX < SNAP_THRESHOLD) newX = 0;
        if (Math.abs(newX - maxX) < SNAP_THRESHOLD) newX = maxX;

        if (newY < SNAP_THRESHOLD) newY = 0;
        if (Math.abs(newY - maxY) < SNAP_THRESHOLD) newY = maxY;

        newX = Math.max(0, Math.min(newX, maxX));
        newY = Math.max(0, Math.min(newY, maxY));
      }

      const nextPos: Position = { x: newX, y: newY };

      setPosition(nextPos);
      stateRef.current.position = nextPos;
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
      setIsDragging(false);
      onDragEnd(stateRef.current.position);
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
  }, [isDragging, onDragEnd]);

  return {
    position,
    handleMouseDown,
    handleTouchStart,
    isDragging,
  };
};