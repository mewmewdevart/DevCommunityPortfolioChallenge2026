import { useState, useCallback, useMemo } from 'react';
import { type Vector2, type Player } from '@interfaces/types';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    TILE_WIDTH,
    TILE_HEIGHT,
    WORLD_ENTITIES,
    // PLAYER_SIZE,
} from '@/interfaces/constants';
import { checkCollision, findPath } from '@utils/physics';
import { type TranslationKeys } from '@/utils/translationsKeys';

export const useGameInteraction = (
    gameStatus: string,
    player: Player,
    moveQueue: Vector2[], // we might need this if interaction depends on queue, but mostly for setting queue
    setMoveQueue: React.Dispatch<React.SetStateAction<Vector2[]>>,
    setFacing: React.Dispatch<React.SetStateAction<'up' | 'down' | 'left' | 'right'>>,
    onObjectInteract: (objId: string) => void,
    announce: (msg: string) => void,
    t: (key: TranslationKeys) => string
) => {
    const [hoverPos, setHoverPos] = useState<Vector2 | null>(null);
    const [cursorType, setCursorType] = useState<'auto' | 'pointer'>('auto');

    const nearbyObject = useMemo(() => {
        for (const obj of WORLD_ENTITIES) {
            const playerCenter = { x: player.position.x + TILE_WIDTH / 2, y: player.position.y + TILE_HEIGHT / 2 };
            const objCenter = { x: obj.position.x + obj.size.x / 2, y: obj.position.y + obj.size.y / 2 };
            const dist = Math.hypot(playerCenter.x - objCenter.x, playerCenter.y - objCenter.y);
            const avgTileSize = (TILE_WIDTH + TILE_HEIGHT) / 2;
            if (dist < avgTileSize * 1.5) {
                return obj;
            }
        }
        return null;
    }, [player.position]);

    const handleCanvasInteraction = useCallback((e: React.MouseEvent | React.TouchEvent, container: HTMLDivElement | null) => {
        if (gameStatus !== 'playing' || !container) return;

        const rect = container.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;

        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;
        const targetX = Math.floor(x / TILE_WIDTH) * TILE_WIDTH;
        const targetY = Math.floor(y / TILE_HEIGHT) * TILE_HEIGHT;

        const clickedObject = WORLD_ENTITIES.find(obj =>
            x >= obj.position.x && x < obj.position.x + obj.size.x &&
            y >= obj.position.y && y < obj.position.y + obj.size.y &&
            obj.isInteractive !== false
        );

        if (clickedObject) {
            onObjectInteract(clickedObject.id);
            return;
        }

        if (targetX === player.position.x && targetY === player.position.y) return;
        if (checkCollision(targetX, targetY)) {
            announce(t('game_blocked'));
            return;
        }

        const path = findPath(player.position, { x: targetX, y: targetY });
        if (path.length > 0) {
            setMoveQueue(path);
            const firstMove = path[0];
            if (firstMove.x > player.position.x) setFacing('right');
            else if (firstMove.x < player.position.x) setFacing('left');
            else if (firstMove.y > player.position.y) setFacing('down');
            else if (firstMove.y < player.position.y) setFacing('up');
            announce(`${t('game_move')} ${Math.round(targetX / TILE_WIDTH)}, ${Math.round(targetY / TILE_HEIGHT)}`);
        } else {
            announce(t('game_path_not_found'));
        }
    }, [player.position, gameStatus, announce, t, setMoveQueue, setFacing, onObjectInteract]);

    const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent, container: HTMLDivElement | null) => {
        if (gameStatus !== 'playing' || !container) {
            setHoverPos(null);
            setCursorType('auto');
            return;
        }

        const rect = container.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        const scaleY = CANVAS_HEIGHT / rect.height;

        let clientX, clientY;
        if ('touches' in e) return; // Touch typically doesn't hover
        else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const x = (clientX - rect.left) * scaleX;
        const y = (clientY - rect.top) * scaleY;

        if (x < 0 || x >= CANVAS_WIDTH || y < 0 || y >= CANVAS_HEIGHT) {
            setHoverPos(null);
            setCursorType('auto');
            return;
        }

        // Check for Entity Hover first (Cats, Backpack, etc.)
        const hoveredObject = WORLD_ENTITIES.find(obj =>
            x >= obj.position.x && x < obj.position.x + obj.size.x &&
            y >= obj.position.y && y < obj.position.y + obj.size.y &&
            obj.isInteractive !== false
        );

        if (hoveredObject) {
            setHoverPos(null); // Don't show tile hover box if over object
            setCursorType('pointer');
            return;
        }

        const gridX = Math.floor(x / TILE_WIDTH) * TILE_WIDTH;
        const gridY = Math.floor(y / TILE_HEIGHT) * TILE_HEIGHT;

        if (!checkCollision(gridX, gridY)) {
            setHoverPos({ x: gridX, y: gridY });
            setCursorType('pointer'); // Walkable
        } else {
            setHoverPos(null);
            setCursorType('auto'); // Not walkable
        }
    }, [gameStatus]);

    const setHoverPosNull = useCallback(() => {
        setHoverPos(null);
        setCursorType('auto');
    }, []);

    return {
        nearbyObject,
        hoverPos,
        cursorType,
        handleCanvasInteraction,
        handleMouseMove,
        setHoverPosNull
    };
};
