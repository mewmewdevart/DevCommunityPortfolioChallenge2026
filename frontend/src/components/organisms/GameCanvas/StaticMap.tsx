import React, { memo } from 'react';
import {
    CANVAS_WIDTH,
    CANVAS_HEIGHT,
    TILE_WIDTH,
    TILE_HEIGHT,
    COLLISION_MAP,
    GRID_COLS,
    GRID_ROWS,
    getFloorSprite,
    getBottomRowSprite,
    getSideWallSprite,
    getTopWallSprite,
    getTopWallColumnSprite,
    getTopWallColumnBorderSprite,
    TOP_WALL_ROWS,
} from '@/interfaces/constants';


export const StaticMap: React.FC = memo(() => {
    return (
        <div className="game-canvas__static-layer">
            {/* Top Wall Tiles */}
            {COLLISION_MAP.slice(0, TOP_WALL_ROWS).flatMap((rowData, row) =>
                rowData.map((tile, col) => {
                    if (tile !== 1) return null;
                    const topWallSprite = getTopWallSprite(row, col, GRID_COLS);
                    if (!topWallSprite) return null;

                    return (
                        <picture key={`topwall-${row}-${col}`}>
                            {topWallSprite.webp && <source srcSet={topWallSprite.webp} type="image/webp" />}
                            <img
                                src={topWallSprite.png}
                                alt=""
                                className="game-canvas__floor-tile game-canvas__tile-layer-1"
                                style={{
                                    left: `${(col * TILE_WIDTH / CANVAS_WIDTH) * 100}%`,
                                    top: `${(row * TILE_HEIGHT / CANVAS_HEIGHT) * 100}%`,
                                    width: `calc(${(TILE_WIDTH / CANVAS_WIDTH) * 100}% + 1px)`,
                                    height: `calc(${(TILE_HEIGHT / CANVAS_HEIGHT) * 100}% + 1px)`,
                                }}
                            />
                        </picture>
                    );
                })
            )}

            {/* Top Wall Column Colliders */}
            {COLLISION_MAP.flatMap((rowData, row) =>
                rowData.map((tile, col) => {
                    const colSprite = getTopWallColumnSprite(row, col, COLLISION_MAP);
                    if (!colSprite) return null;

                    return (
                        <picture key={`topwall-col-${row}-${col}`}>
                            {colSprite.webp && <source srcSet={colSprite.webp} type="image/webp" />}
                            <img
                                src={colSprite.png}
                                alt=""
                                className="game-canvas__floor-tile game-canvas__tile-layer-2"
                                style={{
                                    left: `${(col * TILE_WIDTH / CANVAS_WIDTH) * 100}%`,
                                    top: `${(row * TILE_HEIGHT / CANVAS_HEIGHT) * 100}%`,
                                    width: `calc(${(TILE_WIDTH / CANVAS_WIDTH) * 100}% + 1px)`,
                                    height: `calc(${(TILE_HEIGHT / CANVAS_HEIGHT) * 100}% + 1px)`,
                                }}
                            />
                        </picture>
                    );
                })
            )}

            {/* Top Wall Column Borders */}
            {COLLISION_MAP.flatMap((rowData, row) =>
                rowData.map((tile, col) => {
                    const borderSprite = getTopWallColumnBorderSprite(row, col, GRID_COLS);
                    if (!borderSprite) return null;

                    return (
                        <picture key={`topwall-border-${row}-${col}`}>
                            {borderSprite.webp && <source srcSet={borderSprite.webp} type="image/webp" />}
                            <img
                                src={borderSprite.png}
                                alt=""
                                className="game-canvas__floor-tile game-canvas__tile-layer-3"
                                style={{
                                    left: `${(col * TILE_WIDTH / CANVAS_WIDTH) * 100}%`,
                                    top: `${(row * TILE_HEIGHT / CANVAS_HEIGHT) * 100}%`,
                                    width: `calc(${(TILE_WIDTH / CANVAS_WIDTH) * 100}% + 1px)`,
                                    height: `calc(${(TILE_HEIGHT / CANVAS_HEIGHT) * 100}% + 1px)`,
                                }}
                            />
                        </picture>
                    );
                })
            )}

            {/* Floor Tiles */}
            {COLLISION_MAP.flatMap((rowData, row) =>
                rowData.map((tile, col) => {
                    if (tile !== 0 && tile !== 2) return null;
                    const floorSprite = getFloorSprite(row, col);
                    return (
                        <picture key={`floor-${row}-${col}`}>
                            {floorSprite.webp && <source srcSet={floorSprite.webp} type="image/webp" />}
                            <img
                                src={floorSprite.png}
                                alt=""
                                className="game-canvas__floor-tile game-canvas__tile-layer-1"
                                style={{
                                    left: `${(col * TILE_WIDTH / CANVAS_WIDTH) * 100}%`,
                                    top: `${(row * TILE_HEIGHT / CANVAS_HEIGHT) * 100}%`,
                                    width: `calc(${(TILE_WIDTH / CANVAS_WIDTH) * 100}% + 1px)`,
                                    height: `calc(${(TILE_HEIGHT / CANVAS_HEIGHT) * 100}% + 1px)`,
                                }}
                            />
                        </picture>
                    );
                })
            )}

            {/* Bottom Row Tiles */}
            {(() => {
                const bottomRow = GRID_ROWS - 1;
                return COLLISION_MAP[bottomRow].map((tile, col) => {
                    if (tile !== 1) return null;
                    const bottomSprite = getBottomRowSprite(col, GRID_COLS);
                    return (
                        <picture key={`bottom-${bottomRow}-${col}`}>
                            {bottomSprite.webp && <source srcSet={bottomSprite.webp} type="image/webp" />}
                            <img
                                src={bottomSprite.png}
                                alt=""
                                className="game-canvas__floor-tile game-canvas__tile-layer-1"
                                style={{
                                    left: `${(col * TILE_WIDTH / CANVAS_WIDTH) * 100}%`,
                                    top: `${(bottomRow * TILE_HEIGHT / CANVAS_HEIGHT) * 100}%`,
                                    width: `calc(${(TILE_WIDTH / CANVAS_WIDTH) * 100}% + 1px)`,
                                    height: `calc(${(TILE_HEIGHT / CANVAS_HEIGHT) * 100}% + 1px)`,
                                }}
                            />
                        </picture>
                    );
                });
            })()}

            {/* Side Wall Tiles */}
            {COLLISION_MAP.flatMap((rowData, row) => {
                if (row === GRID_ROWS - 1) return [];
                return rowData.map((tile, col) => {
                    if (tile !== 1) return null;
                    const sideWallSprite = getSideWallSprite(col, GRID_COLS);
                    if (!sideWallSprite) return null;
                    return (
                        <picture key={`sidewall-${row}-${col}`}>
                            {sideWallSprite.webp && <source srcSet={sideWallSprite.webp} type="image/webp" />}
                            <img
                                src={sideWallSprite.png}
                                alt=""
                                className="game-canvas__floor-tile game-canvas__tile-layer-1"
                                style={{
                                    left: `${(col * TILE_WIDTH / CANVAS_WIDTH) * 100}%`,
                                    top: `${(row * TILE_HEIGHT / CANVAS_HEIGHT) * 100}%`,
                                    width: `calc(${(TILE_WIDTH / CANVAS_WIDTH) * 100}% + 1px)`,
                                    height: `calc(${(TILE_HEIGHT / CANVAS_HEIGHT) * 100}% + 1px)`,
                                }}
                            />
                        </picture>
                    );
                });
            })}
        </div>
    );
});

StaticMap.displayName = 'StaticMap';
