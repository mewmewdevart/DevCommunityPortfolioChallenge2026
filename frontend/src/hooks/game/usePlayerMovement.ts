import { useState, useCallback, useEffect, useRef } from 'react';
import { type Player, type Vector2 } from '@interfaces/types';
import {
    TILE_WIDTH,
    TILE_HEIGHT,
    INITIAL_PLAYER_POS,
    PLAYER_SIZE,
} from '@/interfaces/constants';
import { checkCollision } from '@utils/physics';
import { type TranslationKeys } from '@/utils/translationsKeys';

export const usePlayerMovement = (
    gameStatus: string,
    gameEventMessage: string | null,
    announce: (msg: string) => void,
    t: (key: TranslationKeys) => string
) => {
    const [facing, setFacing] = useState<'up' | 'down' | 'left' | 'right'>('down');
    const [player, setPlayer] = useState<Player>({
        position: INITIAL_PLAYER_POS,
        size: PLAYER_SIZE,
    });
    const playerRef = useRef(player); // Ref to track latest player state without re-renders
    const [moveQueue, setMoveQueue] = useState<Vector2[]>([]);
    const [animationState, setAnimationState] = useState<'idle' | 'walk'>('idle');
    const animationDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Keep ref in sync
    useEffect(() => {
        playerRef.current = player;
    }, [player]);

    const updateAnimationState = useCallback((state: 'idle' | 'walk') => {
        if (animationDebounceRef.current) {
            clearTimeout(animationDebounceRef.current);
            animationDebounceRef.current = null;
        }

        if (state === 'walk') {
            setAnimationState('walk');
        } else {
            animationDebounceRef.current = setTimeout(() => {
                setAnimationState('idle');
            }, 250);
        }
    }, []);

    const movePlayer = useCallback((dx: number, dy: number) => {
        if (gameStatus !== 'playing' || gameEventMessage) return;

        const currentPos = playerRef.current.position;
        const currentX = Math.round(currentPos.x / TILE_WIDTH) * TILE_WIDTH;
        const currentY = Math.round(currentPos.y / TILE_HEIGHT) * TILE_HEIGHT;

        const targetX = currentX + dx * TILE_WIDTH;
        const targetY = currentY + dy * TILE_HEIGHT;

        // Determine facing direction immediately
        if (dx > 0) setFacing('right');
        else if (dx < 0) setFacing('left');
        else if (dy > 0) setFacing('down');
        else if (dy < 0) setFacing('up');

        if (!checkCollision(targetX, targetY)) {
            // Queue the move
            setMoveQueue(prevQueue => {
                if (prevQueue.length > 2) return prevQueue;
                return [...prevQueue, { x: targetX, y: targetY }];
            });

            // Announce move (Side effect outside state updater)
            announce(`${t('game_move')} ${Math.round(targetX / TILE_WIDTH)}, ${Math.round(targetY / TILE_HEIGHT)}`);
        } else {
            // Announce blocked (Side effect outside state updater)
            announce(t('game_msg_blocked'));
        }
    }, [gameStatus, gameEventMessage, announce, t]);

    // Movement Loop
    useEffect(() => {
        if (moveQueue.length === 0) {
            // No moves left, settle to idle
            if (animationState !== 'idle') {
                setTimeout(() => updateAnimationState('idle'), 50);
            }
            return;
        }

        // We have moves to process
        if (animationState !== 'walk') {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            updateAnimationState('walk');
        }

        const moveTimer = setTimeout(() => {
            const nextPos = moveQueue[0];
            const currentPos = playerRef.current.position;

            // Update facing based on actaul move step (redundant but safe)
            if (nextPos.x > currentPos.x) setFacing('right');
            else if (nextPos.x < currentPos.x) setFacing('left');
            else if (nextPos.y > currentPos.y) setFacing('down');
            else if (nextPos.y < currentPos.y) setFacing('up');

            // Commit the move
            setPlayer(prev => ({ ...prev, position: nextPos }));
            setMoveQueue(prev => prev.slice(1));
        }, 120); // 120ms per tile = ~8 tiles/sec

        return () => clearTimeout(moveTimer);
    }, [moveQueue, updateAnimationState, animationState]);

    return {
        player,
        setPlayer,
        facing,
        setFacing,
        animationState,
        moveQueue,
        setMoveQueue,
        movePlayer
    };
};
