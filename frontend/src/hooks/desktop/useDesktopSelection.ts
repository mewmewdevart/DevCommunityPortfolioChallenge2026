import { useState, useEffect, useCallback } from 'react';
import { GRID } from './useDesktopItems';
import type { DisplayItem, IconPosition } from './useDesktopItems';

export const useDesktopSelection = (
    displayItems: DisplayItem[],
    computedPositions: Record<string, IconPosition>,
    desktopRef: React.RefObject<HTMLDivElement | null>
) => {
    const [selectedIconIds, setSelectedIconIds] = useState<string[]>([]);
    const [selectionBox, setSelectionBox] = useState<{
        start: { x: number; y: number };
        current: { x: number; y: number };
    } | null>(null);

    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        if (e.button === 2) return;

        if (e.target === desktopRef.current) {
            setSelectionBox({
                start: { x: e.clientX, y: e.clientY },
                current: { x: e.clientX, y: e.clientY },
            });
            if (!e.ctrlKey) setSelectedIconIds([]);
        }
    }, [desktopRef]);

    useEffect(() => {
        if (!selectionBox) return;
        const move = (e: MouseEvent) => setSelectionBox(p => p ? { ...p, current: { x: e.clientX, y: e.clientY } } : null);
        const up = () => setSelectionBox(null);
        window.addEventListener('mousemove', move);
        window.addEventListener('mouseup', up);
        return () => {
            window.removeEventListener('mousemove', move);
            window.removeEventListener('mouseup', up);
        };
    }, [selectionBox]);


    useEffect(() => {
        if (!selectionBox) return;
        const sx = Math.min(selectionBox.start.x, selectionBox.current.x);
        const sy = Math.min(selectionBox.start.y, selectionBox.current.y);
        const ex = Math.max(selectionBox.start.x, selectionBox.current.x);
        const ey = Math.max(selectionBox.start.y, selectionBox.current.y);
        const ids: string[] = [];

        displayItems.forEach(item => {
            const pos = computedPositions[item.id];
            if (!pos) return;
            const ix = GRID.OFFSET_X + pos.col * GRID.W;
            const iy = GRID.OFFSET_Y + pos.row * GRID.H;

            if (sx < ix + GRID.W && ex > ix && sy < iy + GRID.H && ey > iy) {
                ids.push(item.id);
            }
        });

        const timer = setTimeout(() => setSelectedIconIds(ids), 0);
        return () => clearTimeout(timer);
    }, [selectionBox, computedPositions, displayItems]);
    const handleSpatialNav = useCallback((key: string) => {
        const currentId = selectedIconIds[0];
        if (!currentId && displayItems.length > 0) {
            setSelectedIconIds([displayItems[0].id]);
            return;
        }

        const currentPos = computedPositions[currentId];
        if (!currentPos) return;

        let bestCandidate: string | null = null;
        let minDistance = Infinity;

        Object.entries(computedPositions).forEach(([id, pos]) => {
            if (id === currentId) return;

            let isCandidate = false;
            let dist = Infinity;

            switch (key) {
                case 'ArrowRight':
                    if (pos.row === currentPos.row && pos.col > currentPos.col) {
                        isCandidate = true;
                        dist = pos.col - currentPos.col;
                    }
                    break;
                case 'ArrowLeft':
                    if (pos.row === currentPos.row && pos.col < currentPos.col) {
                        isCandidate = true;
                        dist = currentPos.col - pos.col;
                    }
                    break;
                case 'ArrowDown':
                    if (pos.col === currentPos.col && pos.row > currentPos.row) {
                        isCandidate = true;
                        dist = pos.row - currentPos.row;
                    }
                    break;
                case 'ArrowUp':
                    if (pos.col === currentPos.col && pos.row < currentPos.row) {
                        isCandidate = true;
                        dist = currentPos.row - pos.row;
                    }
                    break;
            }

            if (isCandidate && dist < minDistance) {
                minDistance = dist;
                bestCandidate = id;
            }
        });

        if (bestCandidate) {
            setSelectedIconIds([bestCandidate]);
        }
    }, [selectedIconIds, computedPositions, displayItems]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            handleSpatialNav(e.key);
        }
    }, [handleSpatialNav]);

    return {
        selectedIconIds,
        setSelectedIconIds,
        selectionBox,
        handleMouseDown,
        handleKeyDown
    };
};
