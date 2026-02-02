import React, { useRef, useMemo } from 'react';
import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  SPRITES,
} from '@/interfaces/constants';
import { StartMenu } from '@organisms/GameMenus/GameMenus';
import { LevelSelectionScreen } from '@organisms/GameMenus/LevelSelectionScreen';
import { GameHUD } from '@organisms/GameHUD/GameHUD';
import { useTranslation } from '@context/LanguageContext';
import { useGameLogic } from '@/hooks/game/useGameLogic';
import { NarrativeOverlay } from '@/components/molecules/NarrativeOverlay/NarrativeOverlay';
import { PaperFold } from '@/components/pages/PaperScreen/PaperScreen';
import { GameMap } from './GameMap';
import { useSound } from '@/context/SoundContext';

import cursorHand from '@/assets/icons/cursor/cursor_hand_pointer.png';
import cursorPointer from '@/assets/icons/cursor/cursor_pointer.png';

import './GameCanvas.css'

interface GameCanvasProps {
  onLoginRequest: () => void;
  onVideoGameRequest: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({ onLoginRequest, onVideoGameRequest }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const [showLevelSelection, setShowLevelSelection] = React.useState(false);
  const [isPaperScreenOpen, setIsPaperScreenOpen] = React.useState(false);

  const {
    gameStatus,
    // setGameStatus,
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
    handleStartGame,
    handleReturnToMenu,
    handleCanvasInteraction,
    nearbyObject,
    hoverPos,
    handleMouseMove,
    setHoverPosNull,
    cursorType
  } = useGameLogic();

  const { playMusic, stopMusic, playSfx } = useSound();

  // Start BGM on mount
  React.useEffect(() => {
    playMusic('game_bgm_cozy');
    return () => stopMusic();
  }, [playMusic, stopMusic]);

  const aspectRatio = CANVAS_WIDTH / CANVAS_HEIGHT;

  const currentSprite = useMemo(() => {
    if (animationState === 'idle') {
      return SPRITES.player;
    }
    switch (facing) {
      case 'up': return SPRITES.walkUp;
      case 'down': return SPRITES.walkDown;
      case 'left': return SPRITES.walkLeft;
      case 'right': return SPRITES.walkRight;
    }
  }, [animationState, facing]);

  return (
    <div className="game-canvas">
      <div className="game-canvas__sr-text" role="status" aria-live="polite">
        {a11yAnnouncement}
      </div>

      <div className="game-canvas__sr-text">
        {t('game_sr_description')}
      </div>

      <div
        ref={containerRef}
        role="application"
        aria-label={t('game_map_label')}
        className="game-canvas__viewport"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            containerRef.current?.blur();
          }
          // Prevent scrolling with arrows when focused
          if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
          }
        }}
        style={{
          width: `min(90vw, 90vh * ${aspectRatio})`,
          height: `min(90vh, 90vw / ${aspectRatio})`,
          maxWidth: '720px',
          maxHeight: '800px',
          cursor: cursorType === 'pointer'
            ? `url('${cursorHand}'), pointer`
            : `url('${cursorPointer}'), auto`,
        }}
      >
        {/* Keyboard Focus Hint */}
        <div className="game-canvas__focus-hint">
          {t('game_keyboard_hint')}
        </div>

        <GameMap
          player={player}
          facing={facing}
          animationState={animationState}
          currentSprite={currentSprite}
          moveQueue={moveQueue}
          nearbyObject={nearbyObject}
          hoverPos={hoverPos}
          onInteraction={handleCanvasInteraction}
          onMouseMove={handleMouseMove}
          onMouseLeave={setHoverPosNull}
          mapLabel={t('game_map_label')}
          isNarrativeActive={!!gameEventMessage}
        />

        <div className="game-canvas__sr-text">
          {nearbyObject && (
            <button
              onClick={(e) => handleCanvasInteraction(e, null)}
              aria-label={`Interact with ${nearbyObject.type}`}
            >
              Interact with {nearbyObject.type}
            </button>
          )}
          <button onClick={(e) => handleCanvasInteraction(e, null)} aria-label={t('game_interact_action')}>{t('game_interact_action')}</button>
        </div>

        {/* <ControlsOverlay /> */}

        {gameStatus === 'start' && !showLevelSelection && (
          <div className="game-canvas__overlay game-canvas__overlay--start">
            <StartMenu
              onStart={() => setShowLevelSelection(true)}
            />
          </div>
        )}

        {gameStatus === 'start' && showLevelSelection && (
          <div className="game-canvas__overlay game-canvas__overlay--menu">
            <LevelSelectionScreen
              onSelectGame={() => {
                handleStartGame();
                // Start narrative sequence
                setTimeout(() => {
                  setGameEventMessage(t('game_intro_welcome'));
                }, 500);
              }}
              onSelectDesktop={onLoginRequest}
              onSelectVideoGame={onVideoGameRequest}
              onSelectCurriculum={() => {
                playSfx('game_confirm');
                setIsPaperScreenOpen(true);
              }}
            />
          </div>
        )}

        {isPaperScreenOpen && (
          <div
            className="game-canvas__overlay game-canvas__overlay--paper absolute inset-0 z-50 flex items-center justify-center bg-black/50"
            onClick={() => {
              playSfx('game_cancel');
              setIsPaperScreenOpen(false);
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
              style={{ position: 'relative' }}
            >
              <button
                className="absolute top-4 right-4 z-[60] bg-red-500 text-white rounded-full p-2 hover:bg-red-600 transition-colors shadow-lg"
                onClick={() => {
                  playSfx('game_cancel');
                  setIsPaperScreenOpen(false);
                }}
                aria-label="Close Paper"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <PaperFold />
            </div>
          </div>
        )}

        {gameStatus === 'playing' && (
          <>
            {gameEventMessage && (
              <NarrativeOverlay
                key={gameEventMessage}
                isVisible={true}
                message={gameEventMessage}
                onClose={() => {
                  playSfx('game_cancel');
                  setGameEventMessage(null);
                  setShowLoginPrompt(false);
                  setShowVideoGamePrompt(false);
                }}
                actions={(() => {
                  // Narrative Intro Sequence
                  if (gameEventMessage === t('game_intro_welcome')) {
                    return [
                      {
                        label: t('game_continue'),
                        onClick: () => {
                          playSfx('game_click');
                          setGameEventMessage(t('game_intro_context'));
                        },
                        variant: 'primary'
                      },
                      {
                        label: t('game_cancel_action'),
                        onClick: () => {
                          playSfx('game_cancel');
                          setGameEventMessage(null);
                        },
                        variant: 'secondary'
                      }
                    ] as const;
                  }
                  if (gameEventMessage === t('game_intro_context')) {
                    return [
                      {
                        label: t('game_continue'),
                        onClick: () => {
                          playSfx('game_click');
                          setGameEventMessage(t('game_intro_controls_fun'));
                        },
                        variant: 'primary'
                      },
                      {
                        label: t('game_cancel_action'),
                        onClick: () => {
                          playSfx('game_cancel');
                          setGameEventMessage(null);
                        },
                        variant: 'secondary'
                      }
                    ] as const;
                  }
                  if (gameEventMessage === t('game_intro_controls_fun')) {
                    return [
                      {
                        label: t('game_play_action'),
                        onClick: () => {
                          playSfx('game_confirm');
                          setGameEventMessage(null);
                        },
                        variant: 'primary'
                      },
                      {
                        label: t('game_cancel_action'),
                        onClick: () => {
                          playSfx('game_cancel');
                          setGameEventMessage(null);
                        },
                        variant: 'secondary'
                      }
                    ] as const;
                  }

                  if (showLoginPrompt) {
                    return [
                      {
                        label: t('game_login_action'), onClick: () => {
                          playSfx('game_confirm');
                          onLoginRequest();
                        }, variant: 'primary'
                      },
                      {
                        label: t('game_cancel_action'), onClick: () => {
                          playSfx('game_cancel');
                          setGameEventMessage(null);
                          setShowLoginPrompt(false);
                        }, variant: 'secondary'
                      }
                    ] as const;
                  }
                  if (showVideoGamePrompt) {
                    return [
                      {
                        label: t('game_play_action'), onClick: () => {
                          playSfx('game_confirm');
                          onVideoGameRequest();
                        }, variant: 'primary'
                      },
                      {
                        label: t('game_cancel_action'), onClick: () => {
                          playSfx('game_cancel');
                          setGameEventMessage(null);
                          setShowVideoGamePrompt(false);
                        }, variant: 'secondary'
                      }
                    ] as const;
                  }

                  if (showPaperScreenPrompt) {
                    return [
                      {
                        label: t('game_read_action'), onClick: () => {
                          playSfx('game_confirm');
                          setGameEventMessage(null);
                          setShowPaperScreenPrompt(false);
                          setIsPaperScreenOpen(true);
                        }, variant: 'primary'
                      },
                      {
                        label: t('game_cancel_action'), onClick: () => {
                          playSfx('game_cancel');
                          setGameEventMessage(null);
                          setShowPaperScreenPrompt(false);
                        }, variant: 'secondary'
                      }
                    ] as const;
                  }
                  return [
                    {
                      label: t('game_close_action') || 'Close', onClick: () => {
                        playSfx('game_cancel');
                        setGameEventMessage(null);
                      }, variant: 'secondary'
                    }
                  ] as const;
                })()}
              />
            )}



            <GameHUD
              playerPos={player.position}
              onReturnToMenu={() => {
                handleReturnToMenu();
                setShowLevelSelection(false);
              }}
            />
          </>
        )}

      </div>
    </div>
  );
};