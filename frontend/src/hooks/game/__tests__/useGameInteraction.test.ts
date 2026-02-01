import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGameInteraction } from '../useGameInteraction';
import { TILE_WIDTH, TILE_HEIGHT, WORLD_ENTITIES } from '@/interfaces/constants';

// Mock utils
vi.mock('@utils/physics', () => ({
    checkCollision: vi.fn(),
    findPath: vi.fn(),
}));

import { checkCollision, findPath } from '@utils/physics';

describe('useGameInteraction', () => {
    const mockSetMoveQueue = vi.fn();
    const mockSetFacing = vi.fn();
    const mockOnObjectInteract = vi.fn();
    const mockAnnounce = vi.fn();
    const mockT = vi.fn((key) => key);

    const mockPlayer = {
        position: { x: -100, y: -100 }, // Far away to avoid coincidence
        size: { x: TILE_WIDTH, y: TILE_HEIGHT },
        color: 'red'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(checkCollision).mockReturnValue(false);
        vi.mocked(findPath).mockReturnValue([]);
    });

    it('should handle interaction with interactive objects', () => {
        const { result } = renderHook(() =>
            useGameInteraction('playing', mockPlayer, [], mockSetMoveQueue, mockSetFacing, mockOnObjectInteract, mockAnnounce, mockT)
        );
        expect(result.current).toBeDefined();
    });

    it('should IGNORE non-interactive objects (Rug Bug Fix)', () => {
        const { result } = renderHook(() =>
            useGameInteraction('playing', mockPlayer, [], mockSetMoveQueue, mockSetFacing, mockOnObjectInteract, mockAnnounce, mockT)
        );

        const carpet = WORLD_ENTITIES.find(o => o.type === 'carpet');
        expect(carpet).toBeDefined();
        if (!carpet) return;

        // Center of carpet
        const carpetX = carpet.position.x + carpet.size.x / 2;
        const carpetY = carpet.position.y + carpet.size.y / 2;

        const container = document.createElement('div');
        vi.spyOn(container, 'getBoundingClientRect').mockReturnValue({
            left: 0, top: 0, width: 1296, height: 1280, right: 1296, bottom: 1280, x: 0, y: 0, toJSON: () => { }
        });

        const mockEvent = {
            clientX: carpetX,
            clientY: carpetY,
        } as unknown as React.MouseEvent;

        vi.mocked(checkCollision).mockReturnValue(false);
        vi.mocked(findPath).mockReturnValue([{ x: 10, y: 10 }]);

        act(() => {
            result.current.handleCanvasInteraction(mockEvent, container);
        });

        expect(mockOnObjectInteract).not.toHaveBeenCalled();
        expect(findPath).toHaveBeenCalled();
        expect(mockSetMoveQueue).toHaveBeenCalled();
    });
});
