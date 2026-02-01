import type { Vector2 } from '@interfaces/types';
import {
  TILE_WIDTH,
  TILE_HEIGHT,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  isTileWalkable,
  pixelToGrid
} from '@/interfaces/constants';

/**
 * Check if a position collides with blocked tiles using the COLLISION_MAP
 * @param newX - X pixel position
 * @param newY - Y pixel position
 * @returns true if blocked, false if walkable
 */
export const checkCollision = (newX: number, newY: number): boolean => {
  // Check canvas boundaries
  if (newX < 0 || newX + TILE_WIDTH > CANVAS_WIDTH || newY < 0 || newY + TILE_HEIGHT > CANVAS_HEIGHT) {
    return true;
  }

  // Convert pixel position to grid coordinates
  const { col, row } = pixelToGrid(newX, newY);

  // Check if the tile is walkable using the collision map
  return !isTileWalkable(col, row);
};

/**
 * Find a path from start to end position using BFS pathfinding
 * Uses the COLLISION_MAP for collision detection
 */
export const findPath = (start: Vector2, end: Vector2): Vector2[] => {
  const queue: { pos: Vector2; path: Vector2[] }[] = [{ pos: start, path: [] }];
  const visited = new Set<string>();
  visited.add(`${start.x},${start.y}`);

  // Directions adapted for rectangular grid
  const directions = [
    { x: 0, y: -TILE_HEIGHT }, // Up
    { x: 0, y: TILE_HEIGHT },  // Down
    { x: -TILE_WIDTH, y: 0 },  // Left
    { x: TILE_WIDTH, y: 0 }    // Right
  ];

  while (queue.length > 0) {
    const { pos, path } = queue.shift()!;
    if (Math.abs(pos.x - end.x) < 1 && Math.abs(pos.y - end.y) < 1) return path;
    if (path.length > 50) continue; // Limit search depth

    for (const dir of directions) {
      const nextPos = { x: pos.x + dir.x, y: pos.y + dir.y };
      const key = `${nextPos.x},${nextPos.y}`;
      if (!visited.has(key)) {
        if (!checkCollision(nextPos.x, nextPos.y)) {
          visited.add(key);
          queue.push({ pos: nextPos, path: [...path, nextPos] });
        }
      }
    }
  }
  return [];
};