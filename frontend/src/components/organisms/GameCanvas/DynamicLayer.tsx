import React from 'react';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    SPRITES,
    WORLD_ENTITIES,
    PLAYER_SIZE,
    TILE_WIDTH,
    TILE_HEIGHT,
    pixelToGrid,
    type WorldEntityConfig
} from '@/interfaces/constants';
import { WorldEntity } from '@/components/molecules/WorldEntity/WorldEntity';
import { type Player, type Vector2 } from '@interfaces/types';

interface DynamicLayerProps {
    player: Player;
    facing: 'up' | 'down' | 'left' | 'right';
    animationState: 'idle' | 'walk';
    currentSprite: string;
    moveQueue: Vector2[];
    nearbyObject: WorldEntityConfig | null;
    hoverPos: Vector2 | null;
    isNarrativeActive: boolean;
}

export const DynamicLayer: React.FC<DynamicLayerProps> = ({
    player,
    facing,
    animationState,
    currentSprite,
    moveQueue,
    nearbyObject,
    hoverPos,
    isNarrativeActive
}) => {
    return (
        <div className="game-canvas__dynamic-layer">
            {/* Interactive World Entities */}
            {WORLD_ENTITIES.map((obj) => {
                const spriteKey = obj.type as keyof typeof SPRITES;
                const sprite = SPRITES[spriteKey];

                // Dynamic Z-Index Logic for Video Game
                let dynamicZIndex = obj.zIndex;
                if (obj.id === 'videoGame') {
                    const pGrid = pixelToGrid(player.position.x, player.position.y);
                    // "AQUI" positions: Row 3 (Col 2) and Row 4 (Col 2) -> Stronger Z-Index
                    if (pGrid.col === 2 && (pGrid.row === 3 || pGrid.row === 4)) {
                        dynamicZIndex = 30; // Higher than player (20)
                    } else {
                        // "ALI" positions -> Normal (below player)
                        dynamicZIndex = 5;
                    }
                }

                const renderObj = { ...obj, zIndex: dynamicZIndex };

                return (
                    <WorldEntity key={obj.id} object={renderObj} sprite={sprite} />
                );
            })}

            {/* Hover Indicator */}
            {hoverPos && (
                <div
                    className='game-canvas__hover-path'
                    style={{
                        left: `${(hoverPos.x / CANVAS_WIDTH) * 100}%`,
                        top: `${(hoverPos.y / CANVAS_HEIGHT) * 100}%`,
                        width: `${(TILE_WIDTH / CANVAS_WIDTH) * 100}%`,
                        height: `${(TILE_HEIGHT / CANVAS_HEIGHT) * 100}%`,
                    }}
                />
            )}

            {/* Move Path Dots */}
            {moveQueue.map((pos, idx) => (
                <div
                    key={`path-${idx}`}
                    className="game-canvas__path-dot"
                    style={{
                        left: `${((pos.x + TILE_WIDTH / 2) / CANVAS_WIDTH) * 100}%`,
                        top: `${((pos.y + TILE_HEIGHT / 2) / CANVAS_HEIGHT) * 100}%`,
                    }}
                />
            ))}

            {/* Nearby Interaction Indicator */}
            {nearbyObject && (
                <div
                    className="game-canvas__nearby-indicator"
                    style={{
                        left: `${(player.position.x / CANVAS_WIDTH) * 100}%`,
                        top: `${(player.position.y / CANVAS_HEIGHT) * 100}%`,
                        width: `${(PLAYER_SIZE.x / CANVAS_WIDTH) * 100}%`,
                        height: `${(PLAYER_SIZE.y / CANVAS_HEIGHT) * 100}%`,
                    }}
                />
            )}

            {/* Player */}
            <div
                className="game-canvas__player"
                style={{
                    left: `${(player.position.x / CANVAS_WIDTH) * 100}%`,
                    top: `${(player.position.y / CANVAS_HEIGHT) * 100}%`,
                    width: `${(PLAYER_SIZE.x / CANVAS_WIDTH) * 100}%`,
                    height: `${(PLAYER_SIZE.y / CANVAS_HEIGHT) * 100}%`,
                }}
            >
                <div
                    className="game-canvas__player-visual"
                    data-facing={facing}
                    data-anim={animationState}
                    style={{ backgroundImage: `url(${currentSprite})` }}
                />

                {isNarrativeActive && (
                    <div
                        className="game-canvas__chat-indicator"
                        style={{ backgroundImage: `url(${SPRITES.chatIndicator})` }}
                    />
                )}
            </div>
        </div>
    );
};
