import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { GameCanvas } from '../GameCanvas';
// import { GameMap } from '../GameMap';

// Mock contexts and hooks
vi.mock('@context/LanguageContext', () => ({
    useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock('@/context/SettingsContext', () => ({
    useSettings: () => ({ crtEnabled: true, toggleCrt: vi.fn() }),
}));

vi.mock('@/hooks/game/useGameLogic', () => ({
    useGameLogic: () => ({
        gameStatus: 'playing',
        player: { position: { x: 0, y: 0 }, size: { x: 1, y: 1 } },
        facing: 'down',
        animationState: 'idle',
        moveQueue: [],
        gameEventMessage: null,
        showLoginPrompt: false,
        showVideoGamePrompt: false,
        a11yAnnouncement: '',
        handleStartGame: vi.fn(),
        handleReturnToMenu: vi.fn(),
        handleCanvasInteraction: vi.fn(),
        nearbyObject: null,
        hoverPos: null,
        handleMouseMove: vi.fn(),
        setHoverPosNull: vi.fn(),
    }),
}));

describe('GameCanvas', () => {
    it('renders without crashing', () => {
        render(<GameCanvas onLoginRequest={vi.fn()} onVideoGameRequest={vi.fn()} />);
        expect(screen.getByRole('application')).toBeInTheDocument();
    });

    it('renders the game map', () => {
        render(<GameCanvas onLoginRequest={vi.fn()} onVideoGameRequest={vi.fn()} />);
        // Since we have multiple elements with the same label (viewport and map area), we check if at least one exists
        const maps = screen.getAllByLabelText('game_map_label');
        expect(maps.length).toBeGreaterThan(0);
        expect(maps[0]).toBeInTheDocument();
    });
});
