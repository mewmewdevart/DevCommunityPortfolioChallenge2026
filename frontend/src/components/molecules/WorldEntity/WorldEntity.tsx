import React from 'react';
import type { WorldEntityConfig } from '@/interfaces/constants';
import { CANVAS_WIDTH, CANVAS_HEIGHT, SPRITES } from '@/interfaces/constants';
import './WorldEntity.css';

interface WorldEntityProps {
    object: WorldEntityConfig;
    sprite: string;
}


export const WorldEntity: React.FC<WorldEntityProps> = ({ object, sprite }) => {
    const isSpriteSheet = object.type === 'catJoao' || object.type === 'catMaria' || object.type === 'backpack';
    const isCat = object.type === 'catJoao' || object.type === 'catMaria';
    const [showLoveIcon, setShowLoveIcon] = React.useState(false);

    const handleInteraction = () => {
        if (showLoveIcon || !isCat) return;
        setShowLoveIcon(true);
        setTimeout(() => {
            setShowLoveIcon(false);
        }, 2000);
    };

    return (
        <div
            className={`world-entity world-entity--${object.id} world-entity--${object.type}`}
            onClick={isSpriteSheet ? handleInteraction : undefined}
            style={{
                left: `${(object.position.x / CANVAS_WIDTH) * 100}%`,
                top: `${(object.position.y / CANVAS_HEIGHT) * 100}%`,
                width: `${(object.size.x / CANVAS_WIDTH) * 100}%`,
                height: `${(object.size.y / CANVAS_HEIGHT) * 100}%`,
                zIndex: object.zIndex ?? 20,
                pointerEvents: object.isInteractive === false ? 'none' : 'auto',
            }}
        >
            {showLoveIcon && (
                <div
                    className="world-entity__love-icon"
                    style={{ backgroundImage: `url(${SPRITES.loveIcon})` }}
                />
            )}
            {sprite && (
                isSpriteSheet ? (
                    <div
                        className="world-entity__sprite"
                        style={{ backgroundImage: `url(${sprite})` }}
                        role="img"
                        aria-label={object.type}
                    />
                ) : (
                    <img
                        src={sprite}
                        alt={object.type}
                        className="world-entity__image"
                    />
                )
            )}
        </div>
    );
};
