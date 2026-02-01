import { useState, useMemo, useCallback, useEffect } from 'react';
import iconFile from 'pixelarticons/svg/file.svg';
import iconFileAlt from 'pixelarticons/svg/file-alt.svg';
import type { AppDefinition, IconType, ProjectData } from '@interfaces/types';
import { useFileSystem } from '@context/FileSystemContext';
import folderIcon from '@assets/icons/icon-folder.png';

export const GRID = {
    W: 100,
    H: 128,
    OFFSET_X: 10,
    OFFSET_Y: 10,
};

export const TASKBAR_HEIGHT = 50;

export interface IconPosition {
    col: number;
    row: number;
}

export interface DisplayItem {
    id: string;
    title: string;
    icon: IconType | string;
    appId: string;
    fsId?: string;
    type: 'file' | 'folder' | 'app';
    isSystemApp: boolean;
    content?: string | ProjectData;
}

export const useDesktopItems = (apps: AppDefinition[]) => {
    const { getItemsInFolder } = useFileSystem();
    const [dragVersion, setDragVersion] = useState(0);
    const [iconPositions, setIconPositions] = useState<Record<string, IconPosition>>(() => {
        try {
            const saved = localStorage.getItem('OS_ICON_POSITIONS');
            return saved ? JSON.parse(saved) : {};
        } catch {
            return {};
        }
    });

    useEffect(() => {
        localStorage.setItem('OS_ICON_POSITIONS', JSON.stringify(iconPositions));
    }, [iconPositions]);

    const displayItems = useMemo<DisplayItem[]>(() => {
        const rawFsItems = getItemsInFolder('desktop');
        const mappedFsItems: DisplayItem[] = rawFsItems
            .filter(item => item.id !== 'recycle_bin')
            .map(item => {
                let icon: IconType | string = iconFileAlt;
                if (item.type === 'folder') icon = folderIcon;
                else if (item.appId) {
                    const appDef = apps.find(a => a.id === item.appId);
                    if (appDef) icon = appDef.icon;
                } else {
                    icon = iconFile;
                }

                return {
                    id: `fs:${item.id}`,
                    title: item.name,
                    icon,
                    appId: item.appId || 'notepad',
                    fsId: item.id,
                    type: item.type as 'file' | 'folder' | 'app',
                    isSystemApp: false,
                    content: item.content,
                };
            });

        const systemApps: DisplayItem[] = apps
            .filter(app => app.visibility?.desktop)
            .map(app => ({
                id: `app:${app.id}`,
                title: app.title,
                icon: app.icon,
                appId: app.id,
                type: 'app',
                isSystemApp: true,
            }));

        return [...systemApps, ...mappedFsItems].sort((a, b) =>
            a.title.localeCompare(b.title)
        );
    }, [getItemsInFolder, apps]);

    const gridLimits = useMemo(() => {
        void dragVersion;
        if (typeof window === 'undefined') return { maxRows: 6, maxCols: 10 };

        const vh = window.innerHeight;
        const vw = window.innerWidth;
        const availableHeight = vh - TASKBAR_HEIGHT - GRID.OFFSET_Y;
        const availableWidth = vw - GRID.OFFSET_X;

        const maxRows = Math.max(1, Math.floor(availableHeight / GRID.H));
        const maxCols = Math.max(1, Math.floor(availableWidth / GRID.W));

        return { maxRows, maxCols };
    }, [dragVersion]);

    const isPositionOccupied = useCallback(
        (col: number, row: number, positions: Record<string, IconPosition>, ignoreId?: string) =>
            Object.entries(positions).some(([id, pos]) => {
                if (id === ignoreId) return false;
                return pos.col === col && pos.row === row;
            }),
        []
    );

    const computedPositions = useMemo(() => {
        const positions: Record<string, IconPosition> = { ...iconPositions };
        const { maxRows, maxCols } = gridLimits;

        // Adaptive Flow: Use Row-Major (Mobile) vs Column-Major (Desktop)
        // If screen is narrow (e.g. < 600px effective width for icons), prefer vertical scrolling.
        const isMobileFlow = maxCols <= 4; // Configurable threshold

        const findNext = () => {
            let col = 0;
            let row = 0;
            let guard = 0;
            const maxGuard = maxRows * maxCols + 500; // Increased guard for safety

            if (isMobileFlow) {
                // Row-Major: Fill Row 0 (col 0..maxCols), then Row 1...
                while (isPositionOccupied(col, row, positions) && guard < maxGuard) {
                    col++;
                    if (col >= maxCols) {
                        col = 0;
                        row++;
                    }
                    guard++;
                }
            } else {
                // Column-Major (Windows XP style): Fill Col 0 (row 0..maxRows), then Col 1...
                while (isPositionOccupied(col, row, positions) && guard < maxGuard) {
                    row++;
                    if (row >= maxRows) {
                        row = 0;
                        col++;
                    }
                    guard++;
                }
            }
            return { col, row };
        };

        displayItems.forEach(item => {
            const pos = positions[item.id];

            // Validate existing position
            // Note: For mobile flow, we allow infinite rows, so row < maxRows check is relaxed
            const isValid = pos
                && (isMobileFlow ? true : pos.row < maxRows)
                && pos.col < maxCols;

            if (!isValid) {
                const next = findNext();
                positions[item.id] = next;
            }
        });

        return positions;
    }, [displayItems, iconPositions, isPositionOccupied, gridLimits]);

    const handleDragEnd = useCallback(
        (id: string, x: number, y: number) => {
            const { maxRows, maxCols } = gridLimits;
            const col = Math.round((x - GRID.OFFSET_X) / GRID.W);
            const row = Math.round((y - GRID.OFFSET_Y) / GRID.H);

            setDragVersion(v => v + 1);

            if (row < 0 || row >= maxRows || col < 0 || col >= maxCols) return;

            if (!isPositionOccupied(col, row, computedPositions, id)) {
                setIconPositions(prev => ({ ...prev, [id]: { col, row } }));
            }
        },
        [computedPositions, isPositionOccupied, gridLimits]
    );

    const arrangeIcons = useCallback(() => {
        const { maxRows } = gridLimits;
        const newPositions: Record<string, IconPosition> = {};

        let col = 0;
        let row = 0;

        const sortedItems = [...displayItems].sort((a, b) => a.title.localeCompare(b.title));

        sortedItems.forEach(item => {
            newPositions[item.id] = { col, row };

            row++;
            if (row >= maxRows) {
                row = 0;
                col++;
            }
        });

        setIconPositions(newPositions);
        setDragVersion(v => v + 1);
    }, [displayItems, gridLimits]);

    useEffect(() => {
        const onResize = () => setDragVersion(v => v + 1);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    return {
        displayItems,
        computedPositions,
        handleDragEnd,
        setIconPositions,
        setDragVersion,
        dragVersion,
        arrangeIcons
    };
};
