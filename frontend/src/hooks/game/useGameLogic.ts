import { useState, useEffect, useCallback } from 'react';
import { INITIAL_PLAYER_POS, PLAYER_SIZE } from '@/interfaces/constants';
import { useTranslation } from '@context/LanguageContext';
import { usePlayerMovement } from './usePlayerMovement';
import { useGameEvents } from './useGameEvents';
import { useGameInteraction } from './useGameInteraction';

export type GameStatus = 'start' | 'playing' | 'credits' | 'howto';

export const useGameLogic = () => {
    const { t } = useTranslation();
    const [gameStatus, setGameStatus] = useState<GameStatus>('start');
    const [a11yAnnouncement, setA11yAnnouncement] = useState<string>('');

    const announce = useCallback((message: string) => {
        setA11yAnnouncement(message);
    }, []);

    const {
        player,
        setPlayer,
        facing,
        setFacing,
        animationState,
        moveQueue,
        setMoveQueue,
        movePlayer
    } = usePlayerMovement(gameStatus, null, announce, t);

    const {
        gameEventMessage,
        setGameEventMessage,
        showLoginPrompt,
        setShowLoginPrompt,
        showVideoGamePrompt,
        setShowVideoGamePrompt,
        showPaperScreenPrompt,
        setShowPaperScreenPrompt,
        triggerObjectEvent
    } = useGameEvents(gameStatus, player, announce, t);

    const {
        nearbyObject,
        hoverPos,
        cursorType,
        handleCanvasInteraction,
        handleMouseMove,
        setHoverPosNull
    } = useGameInteraction(
        gameStatus,
        player,
        moveQueue,
        setMoveQueue,
        setFacing,
        triggerObjectEvent,
        announce,
        t
    );

    const handleStartGame = () => {
        setPlayer({
            position: INITIAL_PLAYER_POS,
            size: PLAYER_SIZE,
        });
        setMoveQueue([]);
        setGameEventMessage(null);
        setShowLoginPrompt(false);
        setGameStatus('playing');
        announce(t('game_msg_started'));
    };

    const handleReturnToMenu = () => {
        setGameStatus('start');
        announce(t('game_menu'));
    };

    // Keyboard Listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (gameStatus !== 'playing') return;

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }
            switch (e.key) {
                case 'ArrowUp': case 'w':
                    movePlayer(0, -1);
                    setFacing('up');
                    break;
                case 'ArrowDown': case 's':
                    movePlayer(0, 1);
                    setFacing('down');
                    break;
                case 'ArrowLeft': case 'a':
                    movePlayer(-1, 0);
                    setFacing('left');
                    break;
                case 'ArrowRight': case 'd':
                    movePlayer(1, 0);
                    setFacing('right');
                    break;
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [movePlayer, gameStatus, setFacing]);

    return {
        gameStatus,
        setGameStatus,
        player,
        facing,
        animationState,
        moveQueue,
        gameEventMessage,
        setGameEventMessage,
        showLoginPrompt,
        setShowLoginPrompt,
        showVideoGamePrompt,
        setShowVideoGamePrompt,
        showPaperScreenPrompt,
        setShowPaperScreenPrompt,
        a11yAnnouncement,
        movePlayer,
        handleStartGame,
        handleReturnToMenu,
        handleCanvasInteraction,
        nearbyObject,
        announce,
        hoverPos,
        cursorType,
        handleMouseMove,
        setHoverPosNull
    };
};
