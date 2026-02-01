
import { useEffect } from 'react';
import type { MemoryCardData } from '@/data/memoryCardsData';

interface UseMemoryCardNavigationProps {
    viewMode: 'grid' | 'detail';
    setViewMode: (mode: 'grid' | 'detail') => void;
    selectedIndex: number;
    setSelectedIndex: (index: number | ((prev: number) => number)) => void;
    cards: MemoryCardData[];
    onBack: () => void;
}

export const useMemoryCardNavigation = ({
    viewMode,
    setViewMode,
    selectedIndex,
    setSelectedIndex,
    cards,
    onBack,
}: UseMemoryCardNavigationProps) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (viewMode === 'grid') {
                const isDesktop = window.innerWidth >= 768;
                const gridCols = isDesktop ? 4 : 2;

                switch (e.key) {
                    case 'ArrowRight':
                        setSelectedIndex((prev) => Math.min(prev + 1, cards.length - 1));
                        break;
                    case 'ArrowLeft':
                        setSelectedIndex((prev) => Math.max(prev - 1, 0));
                        break;
                    case 'ArrowDown':
                        setSelectedIndex((prev) =>
                            Math.min(prev + gridCols, cards.length - 1)
                        );
                        break;
                    case 'ArrowUp':
                        setSelectedIndex((prev) => Math.max(prev - gridCols, 0));
                        break;
                    case 'Enter':
                    case ' ':
                    case 'x':
                    case 'X':
                        e.preventDefault();
                        if (cards[selectedIndex].type !== 'empty') {
                            setViewMode('detail');
                        }
                        break;
                    case 'Escape':
                        e.stopPropagation();
                        onBack();
                        break;
                }
            } else {
                if (e.key === 'Escape' || e.key === 'Backspace') {
                    e.preventDefault();
                    setViewMode('grid');
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [viewMode, selectedIndex, cards, onBack, setSelectedIndex, setViewMode]);
};
