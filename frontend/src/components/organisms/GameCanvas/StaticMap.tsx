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

// Defines the props for StaticMap.
// It deliberately does NOT include player or dynamic data.
// Optimization: This component is memoized and should only render ONCE unless the map changes.
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
                        <img
                            key={`topwall-${row}-${col}`}
                            src={topWallSprite}
                            alt=""
                            className="game-canvas__floor-tile game-canvas__tile-layer-1"
                            style={{
                                left: `${(col * TILE_WIDTH / CANVAS_WIDTH) * 100}%`,
                                top: `${(row * TILE_HEIGHT / CANVAS_HEIGHT) * 100}%`,
                                width: `calc(${(TILE_WIDTH / CANVAS_WIDTH) * 100}% + 1px)`,
                                height: `calc(${(TILE_HEIGHT / CANVAS_HEIGHT) * 100}% + 1px)`,
                            }}
                        />
                    );
                })
            )}

            {/* Top Wall Column Colliders */}
            {COLLISION_MAP.flatMap((rowData, row) =>
                rowData.map((tile, col) => {
                    const colSprite = getTopWallColumnSprite(row, col, COLLISION_MAP);
                    if (!colSprite) return null;

                    return (
                        <img
                            key={`topwall-col-${row}-${col}`}
                            src={colSprite}
                            alt=""
                            className="game-canvas__floor-tile game-canvas__tile-layer-2"
                            style={{
                                left: `${(col * TILE_WIDTH / CANVAS_WIDTH) * 100}%`,
                                top: `${(row * TILE_HEIGHT / CANVAS_HEIGHT) * 100}%`,
                                width: `calc(${(TILE_WIDTH / CANVAS_WIDTH) * 100}% + 1px)`,
                                height: `calc(${(TILE_HEIGHT / CANVAS_HEIGHT) * 100}% + 1px)`,
                            }}
                        />
                    );
                })
            )}

            {/* Top Wall Column Borders */}
            {COLLISION_MAP.flatMap((rowData, row) =>
                rowData.map((tile, col) => {
                    const borderSprite = getTopWallColumnBorderSprite(row, col, GRID_COLS);
                    if (!borderSprite) return null;

                    return (
                        <img
                            key={`topwall-border-${row}-${col}`}
                            src={borderSprite}
                            alt=""
                            className="game-canvas__floor-tile game-canvas__tile-layer-3"
                            style={{
                                left: `${(col * TILE_WIDTH / CANVAS_WIDTH) * 100}%`,
                                top: `${(row * TILE_HEIGHT / CANVAS_HEIGHT) * 100}%`,
                                width: `calc(${(TILE_WIDTH / CANVAS_WIDTH) * 100}% + 1px)`,
                                height: `calc(${(TILE_HEIGHT / CANVAS_HEIGHT) * 100}% + 1px)`,
                            }}
                        />
                    );
                })
            )}

            {/* Floor Tiles */}
            {COLLISION_MAP.flatMap((rowData, row) =>
                rowData.map((tile, col) => {
                    if (tile !== 0 && tile !== 2) return null;
                    const floorSprite = getFloorSprite(row, col);
                    return (
                        <img
                            key={`floor-${row}-${col}`}
                            src={floorSprite}
                            alt=""
                            className="game-canvas__floor-tile game-canvas__tile-layer-1"
                            style={{
                                left: `${(col * TILE_WIDTH / CANVAS_WIDTH) * 100}%`,
                                top: `${(row * TILE_HEIGHT / CANVAS_HEIGHT) * 100}%`,
                                width: `calc(${(TILE_WIDTH / CANVAS_WIDTH) * 100}% + 1px)`,
                                height: `calc(${(TILE_HEIGHT / CANVAS_HEIGHT) * 100}% + 1px)`,
                            }}
                        />
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
                        <img
                            key={`bottom-${bottomRow}-${col}`}
                            src={bottomSprite}
                            alt=""
                            className="game-canvas__floor-tile game-canvas__tile-layer-1"
                            style={{
                                left: `${(col * TILE_WIDTH / CANVAS_WIDTH) * 100}%`,
                                top: `${(bottomRow * TILE_HEIGHT / CANVAS_HEIGHT) * 100}%`,
                                width: `calc(${(TILE_WIDTH / CANVAS_WIDTH) * 100}% + 1px)`,
                                height: `calc(${(TILE_HEIGHT / CANVAS_HEIGHT) * 100}% + 1px)`,
                            }}
                        />
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
                        <img
                            key={`sidewall-${row}-${col}`}
                            src={sideWallSprite}
                            alt=""
                            className="game-canvas__floor-tile game-canvas__tile-layer-1"
                            style={{
                                left: `${(col * TILE_WIDTH / CANVAS_WIDTH) * 100}%`,
                                top: `${(row * TILE_HEIGHT / CANVAS_HEIGHT) * 100}%`,
                                width: `calc(${(TILE_WIDTH / CANVAS_WIDTH) * 100}% + 1px)`,
                                height: `calc(${(TILE_HEIGHT / CANVAS_HEIGHT) * 100}% + 1px)`,
                            }}
                        />
                    );
                });
            })}
        </div>
    );
});

StaticMap.displayName = 'StaticMap';
