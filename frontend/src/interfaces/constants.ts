import playerIcon from '@assets/images/game/idleAnim-Sheet.png';
import walkDown from '@assets/images/game/walkDownAnim-Sheet.png';
import walkUp from '@assets/images/game/walkUpAnim-Sheet.png';
import walkLeft from '@assets/images/game/walkLeftAnim-Sheet.png';
import walkRight from '@assets/images/game/walkRightAnim-Sheet.png';
import videoGameIcon from '@assets/images/game/videoGameGIF.gif';
import bedIcon from '@assets/images/game/bed.png';
import carpetIcon from '@assets/images/game/carpet.png';
import computerIcon from '@assets/images/game/computerGIF.gif';
import iconTalk from '@assets/images/game/icon_talk.png';
import pictureIcon from '@assets/images/game/pictures.png';
import pictureIcon2 from '@assets/images/game/pictures1.png';

import CatJoaoIdle from '@assets/images/game/cat-joao-Sheet.png';
import CatMariaIdle from '@assets/images/game/cat-maria-Sheet.png';
import iconLove from '@assets/images/game/icon_love.png';
import backPackSheet from '@assets/images/game/backPack-Sheet.png';

export const SPRITES = {
  player: playerIcon, // Idle
  walkDown, // Walking down
  walkUp, // Walking up
  walkLeft, // Walking left
  walkRight, // Walking right
  computer: computerIcon,
  picture: pictureIcon,
  picture2: pictureIcon2,
  videoGame: videoGameIcon,
  carpet: carpetIcon,
  bed: bedIcon,
  wall: `https://upload.wikimedia.org/wikipedia/commons/5/50/Black_colour.jpg`,
  chatIndicator: iconTalk,
  loveIcon: iconLove,
  catJoao: CatJoaoIdle,
  catMaria: CatMariaIdle,
  backpack: backPackSheet,
};

// Preload all player sprites to prevent flickering on first use
export const preloadPlayerSprites = (): void => {
  const spriteUrls = [
    SPRITES.player,
    SPRITES.walkUp,
    SPRITES.walkDown,
    SPRITES.walkLeft,
    SPRITES.walkRight,
  ];

  spriteUrls.forEach((url) => {
    const img = new Image();
    img.src = url;
  });
};

// Auto-preload on module import
preloadPlayerSprites();

// Floor sprites for 2x2 tiling pattern
import walkFloor1 from '@assets/images/game/walkFloor_1.png';
import walkFloor2 from '@assets/images/game/walkFloor_2.png';
import walkFloor3 from '@assets/images/game/walkFloor_3.png';
import walkFloor4 from '@assets/images/game/walkFloor_4.png';

// Bottom row special floor sprites (collision tiles with visual aesthetic)
import collideBottomWall0 from '@assets/images/game/collideBottomWall_0.png';
import collideBottomWall1 from '@assets/images/game/collideBottomWall_1.png';
import collideBottomWall2 from '@assets/images/game/collideBottomWall_2.png';

// Side wall sprites (left and right columns)
import collideLeftWall0 from '@assets/images/game/collideLeftWall_0.png';
import collideRightWall0 from '@assets/images/game/collideRightWall_0.png';

// Top wall sprites (stacked vertically from top to bottom)
import collideTopWall1 from '@assets/images/game/collideTopWall_1.png';
import collideTopWall2 from '@assets/images/game/collideTopWall_2.png';
import collideTopWall3 from '@assets/images/game/collideTopWall_3.png';

// Top wall column sprites - Left column (col = 1)
import collideTopWallColumnLeft1 from '@assets/images/game/collideTopWallColumnLeft_1.png';
import collideTopWallColumnLeft2 from '@assets/images/game/collideTopWallColumnLeft_2.png';
import collideTopWallColumnLeft3 from '@assets/images/game/collideTopWallColumnLeft_3.png';
import collideTopWallColumnLeft4 from '@assets/images/game/collideTopWallColumnLeft_4.png';

// Top wall column sprites - Right column (col = 7)
import collideTopWallColumnRight1 from '@assets/images/game/collideTopWallColumnRight_1.png';
import collideTopWallColumnRight2 from '@assets/images/game/collideTopWallColumnRight_2.png';
import collideTopWallColumnRight3 from '@assets/images/game/collideTopWallColumnRight_3.png';
import collideTopWallColumnRight4 from '@assets/images/game/collideTopWallColumnRight_4.png';

// Top wall column BORDER sprites (Row 0, Col 0 and Col 8)
import collideTopWallColumnBorderLeft1 from '@assets/images/game/collideTopWallColumnBorderLeft_1.png';
import collideTopWallColumnBorderRight1 from '@assets/images/game/collideTopWallColumnBorderRight_1.png';


export const FLOOR_SPRITES = [
  walkFloor1,
  walkFloor2,
  walkFloor3,
  walkFloor4,
] as const;

export const BOTTOM_ROW_SPRITES = {
  leftCorner: collideBottomWall0,
  middle: collideBottomWall1,
  rightCorner: collideBottomWall2,
} as const;

export const SIDE_WALL_SPRITES = {
  left: collideLeftWall0,
  right: collideRightWall0,
} as const;

export const TOP_WALL_SPRITES = [
  collideTopWall1,
  collideTopWall2,
  collideTopWall3,
] as const;

export const TOP_WALL_ROWS = 3;

export const TOP_WALL_COLUMN_LEFT_SPRITES = [
  collideTopWallColumnLeft1,
  collideTopWallColumnLeft2,
  collideTopWallColumnLeft3,
  collideTopWallColumnLeft4,
] as const;

export const TOP_WALL_COLUMN_RIGHT_SPRITES = [
  collideTopWallColumnRight1,
  collideTopWallColumnRight2,
  collideTopWallColumnRight3,
  collideTopWallColumnRight4,
] as const;

/**
 * Returns the floor sprite for a given tile position.
 * Uses row/col parity to create a repeating 2x2 pattern.
 */
export const getFloorSprite = (row: number, col: number): string => {
  const index = (row % 2) * 2 + (col % 2);
  return FLOOR_SPRITES[index];
};

/**
 * Returns the appropriate sprite for the BOTTOM ROW of the grid.
 * This is used for tiles that are collision (value 1) but need visual representation.
 * 
 * Logic:
 * - col === 0                    → leftCorner (collideBottomWall_0.png)
 * - col === GRID_COLS - 1        → rightCorner (collideBottomWall_2.png)
 * - all other columns            → middle (collideBottomWall_1.png)
 * 
 * @param col - Column index in the grid
 * @param gridCols - Total number of columns in the grid
 * @returns The sprite path for this bottom row tile
 */
export const getBottomRowSprite = (col: number, gridCols: number): string => {
  if (col === 0) {
    return BOTTOM_ROW_SPRITES.leftCorner;
  }
  if (col === gridCols - 1) {
    return BOTTOM_ROW_SPRITES.rightCorner;
  }
  return BOTTOM_ROW_SPRITES.middle;
};

/**
 * Returns the appropriate sprite for SIDE WALLS (left and right columns).
 * This is used for tiles that are collision (value 1) but need visual representation.
 * 
 * Logic:
 * - col === 0               → left wall (collideLeftWall_0.png)
 * - col === GRID_COLS - 1   → right wall (collideRightWall_0.png)
 * - otherwise               → null (not a side wall)
 * 
 * IMPORTANT: Bottom row tiles should be handled separately (they have their own sprites).
 * Use this function only for rows that are NOT the bottom row.
 * 
 * @param col - Column index in the grid
 * @param gridCols - Total number of columns in the grid
 * @returns The sprite path for this side wall tile, or null if not a side wall
 */
export const getSideWallSprite = (col: number, gridCols: number): string | null => {
  if (col === 0) {
    return SIDE_WALL_SPRITES.left;
  }
  if (col === gridCols - 1) {
    return SIDE_WALL_SPRITES.right;
  }
  return null;
};

/**
 * Returns the appropriate sprite for the TOP WALL section of the grid.
 * Priority: Side walls > Top wall > Bottom wall > Floor.
 */
export const getTopWallSprite = (row: number, col: number, gridCols: number): string | null => {
  if (row < 0 || row >= TOP_WALL_ROWS) {
    return null;
  }

  if (col === 0 || col === gridCols - 1) {
    return null;
  }

  const index = (TOP_WALL_ROWS - 1) - row;
  return TOP_WALL_SPRITES[index];
};

/**
 * Returns the appropriate sprite for TOP WALL COLUMN colliders.
 * These are vertical columns at specific positions that extend downward from the top wall.
 * 
 * Grid Diagram (columns 1 and 7, rows 3-6):
 *   Col: 0  1  2  3  4  5  6  7  8
 *   Row 3: S  L  .  .  .  .  .  R  S   (L=Left column sprite, R=Right column sprite, S=Side wall)
 *   Row 4: S  L  .  .  .  .  .  R  S
 *   Row 5: S  L  .  .  .  .  .  R  S
 *   Row 6: S  L  .  .  .  .  .  R  S
 * 
 * Logic:
 *   - col === TOP_WALL_COLUMN_CONFIG.leftCol (1) → use LEFT column sprites
 *   - col === TOP_WALL_COLUMN_CONFIG.rightCol (7) → use RIGHT column sprites
 * Logic:
 *  - Scans DOWNWARDS (Bottom-Up base anchor).
 *  - Excludes Bottom Row (Row 9).
 *  - Base of column -> Sprite 4.
 *  - Upwards -> 3, 2, 1.
 */
export const getTopWallColumnSprite = (row: number, col: number, collisionMap: number[][]): string | null => {
  const gridRows = collisionMap.length;
  const gridCols = collisionMap[0].length;

  const leftCol = 1;
  const rightCol = gridCols - 2;

  if (col !== leftCol && col !== rightCol) return null;
  if (collisionMap[row][col] !== 1) return null;
  if (row === gridRows - 1) return null;

  let r = row;
  while (r < gridRows - 2 && collisionMap[r + 1][col] === 1) {
    r++;
  }
  const baseRow = r;

  const distFromBase = baseRow - row;
  const targetIndex = 3 - distFromBase;
  const spriteIndex = Math.max(0, targetIndex);

  const sprites = (col === leftCol)
    ? TOP_WALL_COLUMN_LEFT_SPRITES
    : TOP_WALL_COLUMN_RIGHT_SPRITES;

  return sprites[spriteIndex];
};

/**
 * Returns the appropriate sprite for TOP WALL COLUMN BORDERS.
 * These are visual overlays for the top-most corners (Row 0, Col 0 and Col 8).
 * 
 * Logic:
 *  - Row === 0
 *  - Col === 0 -> Left Border
 *  - Col === GRID_COLS - 1 -> Right Border
 * 
 * Priority: Highest (Visual Overlay)
 */
export const getTopWallColumnBorderSprite = (row: number, col: number, gridCols: number): string | null => {
  if (row !== 0) return null;

  if (col === 0) {
    return collideTopWallColumnBorderLeft1;
  }
  if (col === gridCols - 1) {
    return collideTopWallColumnBorderRight1;
  }

  return null;
};

export const TILE_WIDTH = 16;
export const TILE_HEIGHT = 16;

export const GRID_COLS = 9;
export const GRID_ROWS = 10;
export const CANVAS_WIDTH = GRID_COLS * TILE_WIDTH;
export const CANVAS_HEIGHT = GRID_ROWS * TILE_HEIGHT;

export const COLLISION_MAP: number[][] = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 2, 2, 2, 0, 1, 1],
  [1, 2, 0, 0, 0, 0, 0, 2, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 2, 2, 1],
  [1, 0, 0, 0, 0, 2, 2, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1],
];


export const isTileWalkable = (col: number, row: number): boolean => {
  if (row < 0 || row >= GRID_ROWS || col < 0 || col >= GRID_COLS) {
    return false;
  }
  return COLLISION_MAP[row][col] === 0;
};

export const pixelToGrid = (x: number, y: number): { col: number; row: number } => {
  return {
    col: Math.floor(x / TILE_WIDTH),
    row: Math.floor(y / TILE_HEIGHT),
  };
};

export const gridToPixel = (col: number, row: number): { x: number; y: number } => {
  return {
    x: col * TILE_WIDTH,
    y: row * TILE_HEIGHT,
  };
};

export const INITIAL_PLAYER_POS = { x: 4 * TILE_WIDTH, y: 5 * TILE_HEIGHT };
export const PLAYER_SIZE = { x: TILE_WIDTH, y: TILE_HEIGHT };

export interface WorldEntityConfig {
  id: string;
  gridPos: { col: number; row: number };
  position: { x: number; y: number };
  size: { x: number; y: number };
  type: string;
  zIndex?: number;
  isInteractive?: boolean;
}

export const WORLD_ENTITIES: WorldEntityConfig[] = [
  {
    id: 'computer',
    gridPos: { col: 2, row: 3 },
    position: { x: 3.3 * TILE_WIDTH, y: 1.4 * TILE_HEIGHT },
    size: { x: TILE_WIDTH * 2.6, y: TILE_HEIGHT * 2.6 },
    type: 'computer',
    zIndex: 2,
  },
  {
    id: 'picture',
    gridPos: { col: 2, row: 3 },
    position: { x: 5.8 * TILE_WIDTH, y: 0.2 * TILE_HEIGHT },
    size: { x: TILE_WIDTH * 1, y: TILE_HEIGHT * 2.6 },
    type: 'picture',
    zIndex: 2,
  },
  {
    id: 'picture2',
    gridPos: { col: 2, row: 3 },
    position: { x: 2.2 * TILE_WIDTH, y: 0.2 * TILE_HEIGHT },
    size: { x: TILE_WIDTH * 1.5, y: TILE_HEIGHT * 2.6 },
    type: 'picture2',
    zIndex: 1,
  },
  {
    id: 'videoGame',
    gridPos: { col: 2, row: 3 },
    position: { x: 1 * TILE_WIDTH, y: 3.2 * TILE_HEIGHT },
    size: { x: TILE_WIDTH * 2, y: TILE_HEIGHT * 2.6 },
    type: 'videoGame',
  },
  {
    id: 'bed',
    gridPos: { col: 2, row: 3 },
    position: { x: 4.5 * TILE_WIDTH, y: 5.87 * TILE_HEIGHT },
    size: { x: TILE_WIDTH * 3.5, y: TILE_HEIGHT * 3.5 },
    type: 'bed',
    zIndex: 30,
    isInteractive: false,
  },
  {
    id: 'carpet',
    gridPos: { col: 2, row: 3 },
    position: { x: 2.8 * TILE_WIDTH, y: 4.5 * TILE_HEIGHT },
    size: { x: TILE_WIDTH * 3.6, y: TILE_HEIGHT * 3.6 },
    type: 'carpet',
    zIndex: 1,
    isInteractive: false,
  },
  {
    id: 'catJoao',
    gridPos: { col: 4, row: 5 },
    position: { x: 5.7 * TILE_WIDTH, y: 6.9 * TILE_HEIGHT },
    size: { x: TILE_WIDTH * 0.8, y: TILE_HEIGHT * 0.8 },
    type: 'catJoao',
    zIndex: 30,
    isInteractive: true,
  },
  {
    id: 'catMaria',
    gridPos: { col: 3, row: 5 },
    position: { x: 7 * TILE_WIDTH, y: 7.7 * TILE_HEIGHT },
    size: { x: TILE_WIDTH * 0.8, y: TILE_HEIGHT * 0.8 },
    type: 'catMaria',
    zIndex: 30,
    isInteractive: true,
  },
  {
    id: 'backpack',
    gridPos: { col: 2, row: 5 },
    position: { x: 6.5 * TILE_WIDTH, y: 4 * TILE_HEIGHT },
    size: { x: TILE_WIDTH * 1.5, y: TILE_HEIGHT * 1.5 },
    type: 'backpack',
    zIndex: 25,
    isInteractive: true,
  },
];

export const OS_CONFIG = {
  MAX_WINDOWS: 6,
  MIN_WINDOW_WIDTH: 300,
  MIN_WINDOW_HEIGHT: 300,
  ASSISTANT_ID: 'assistant',
};

export const VIDEOGAME_CONFIG = {
  BOX_COUNT: 112,
  HIDDEN_INDICES: [39, 40, 45, 46, 47, 93, 94, 100, 101],
};


