import React, { useRef, useEffect } from 'react';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    TILE_WIDTH,
    TILE_HEIGHT,
    type WorldEntityConfig,
    type SpriteAsset
} from '@/interfaces/constants';
import { type Player, type Vector2 } from '@interfaces/types';
import { StaticMap } from './StaticMap';
import { DynamicLayer } from './DynamicLayer';

interface GameMapProps {
    player: Player;
    facing: 'up' | 'down' | 'left' | 'right';
    animationState: 'idle' | 'walk';
    currentSprite: string | SpriteAsset;
    moveQueue: Vector2[];
    nearbyObject: WorldEntityConfig | null;
    hoverPos: Vector2 | null;
    onInteraction: (e: React.MouseEvent | React.TouchEvent, container: HTMLDivElement | null) => void;
    onMouseMove: (e: React.MouseEvent | React.TouchEvent, container: HTMLDivElement | null) => void;
    onMouseLeave: () => void;
    mapLabel: string;
    isNarrativeActive: boolean;
}

export const GameMap: React.FC<GameMapProps> = ({
    player,
    facing,
    animationState,
    currentSprite,
    moveQueue,
    nearbyObject,
    hoverPos,
    onInteraction,
    onMouseMove,
    onMouseLeave,
    mapLabel,
    isNarrativeActive
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const gridCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = gridCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        ctx.strokeStyle = 'rgb(91, 82, 128)';
        ctx.lineWidth = 4;

        ctx.beginPath();
        for (let row = 0; row < Math.floor(CANVAS_HEIGHT / TILE_HEIGHT); row++) {
            for (let col = 0; col < Math.floor(CANVAS_WIDTH / TILE_WIDTH); col++) {
                const x = col * TILE_WIDTH;
                const y = row * TILE_HEIGHT;
                ctx.strokeRect(x + 2, y + 2, TILE_WIDTH - 4, TILE_HEIGHT - 4);
            }
        }
    }, []);

    return (
        <div
            ref={containerRef}
            onPointerDown={(e) => onInteraction(e, containerRef.current)}
            onMouseMove={(e) => onMouseMove(e, containerRef.current)}
            onMouseLeave={onMouseLeave}
            className="game-canvas__area"
            tabIndex={0}
            aria-label={mapLabel}
        >
            <canvas
                ref={gridCanvasRef}
                className="game-canvas__grid"
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }}
            />
            <StaticMap />
            <DynamicLayer
                player={player}
                facing={facing}
                animationState={animationState}
                currentSprite={currentSprite}
                moveQueue={moveQueue}
                nearbyObject={nearbyObject}
                hoverPos={hoverPos}
                isNarrativeActive={isNarrativeActive}
            />
        </div>
    );
};
