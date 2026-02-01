import React from 'react';
import type { WorldEntityConfig, SpriteAsset } from '@/interfaces/constants';
import { CANVAS_WIDTH, CANVAS_HEIGHT, SPRITES } from '@/interfaces/constants';
import './WorldEntity.css';

interface WorldEntityProps {
    object: WorldEntityConfig;
    sprite: string | SpriteAsset;
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

    const getBgStyle = (s: string | SpriteAsset | undefined) => {
        if (!s) return {};
        if (typeof s === 'string') {
            return { backgroundImage: `url(${s})` };
        }
        // Modern browsers support image-set. Fallback handled by CSS if written in stylesheet, but here inline.
        // We'll trust modern browser support or fall back to PNG if needed by providing the PNG first? 
        // No, standard CSS fallback requires separate property declarations which React style object doesn't support easily (array of values).
        // Safest approach for inline style compatibility: Use PNG defaults or if we are sure, image-set.
        // Given the requirement, let's try image-set string.
        // If it fails, we might just use PNG.
        // But for "Adding WebP", we should try.
        // backgroundImage: `image-set(url("${s.webp}") type("image/webp"), url("${s.png}") type("image/png"))`
        if (s.webp) {
            return { backgroundImage: `image-set(url("${s.webp}") type("image/webp"), url("${s.png}") type("image/png"))` };
        }
        return { backgroundImage: `url(${s.png})` };
    };

    // Helper for love icon which comes from direct global import in constants
    // SPRITES.loveIcon is a SpriteAsset
    const loveIconSprite = SPRITES.loveIcon as SpriteAsset;

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
                    style={getBgStyle(loveIconSprite)}
                />
            )}
            {sprite && (
                isSpriteSheet ? (
                    <div
                        className="world-entity__sprite"
                        style={getBgStyle(sprite)}
                        role="img"
                        aria-label={object.type}
                    />
                ) : (
                    typeof sprite === 'string' ? (
                        <img
                            src={sprite}
                            alt={object.type}
                            className="world-entity__image"
                        />
                    ) : (
                        <picture>
                            {sprite.webp && <source srcSet={sprite.webp} type="image/webp" />}
                            <img
                                src={sprite.png}
                                alt={object.type}
                                className="world-entity__image"
                            />
                        </picture>
                    )
                )
            )}
        </div>
    );
};
