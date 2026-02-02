import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import { MEMORY_CARDS } from '@/data/memoryCardsData';
import { useMemoryCardNavigation } from '@/hooks/useMemoryCardNavigation';
import { CRTShutdownEffect } from '@/components/atoms/CRTShutdownEffect/CRTShutdownEffect';
import MemoryCardItem from '@/components/molecules/MemoryCardItem/MemoryCardItem';
import InfoPanel from '@/components/organisms/InfoPanel/InfoPanel';
import RetroControls from '@/components/molecules/RetroControls/RetroControls';

import './MemoryCardScreen.css';

interface MemoryCardScreenProps {
    onBack?: () => void;
}

const MemoryCardScreen: React.FC<MemoryCardScreenProps> = ({ onBack }) => {
    const { t, language } = useTranslation();
    const { playSfx } = useSound();
    const [selectedIndex, setSelectedIndex] = useState(0);
    const isHandlingRef = useRef(false);

    const [isExiting, setIsExiting] = useState(false);

    const [viewMode, setViewMode] = useState<'grid' | 'detail'>('grid');
    const [isGenerating, setIsGenerating] = useState(false);


    const gridRef = useRef<HTMLDivElement>(null);

    const handleBack = () => {
        if (isExiting) return;
        playSfx('system_shutdown');
        setIsExiting(true);
        setTimeout(() => {
            if (onBack) onBack();
        }, 700);
    };

    // Filter cards based on current language
    const filteredCards = React.useMemo(() => {
        const langMap: Record<string, string> = {
            'pt-BR': 'ptBR',
            'pt': 'ptBR',
            'es': 'es',
            'en': 'en'
        };
        // Normalize current language or default to 'en'
        const currentLang = langMap[language] || 'en';

        // Group cards by baseId (or id if baseId is missing)
        const groups: Record<string, typeof MEMORY_CARDS> = {};

        MEMORY_CARDS.forEach(card => {
            // For cards that are not localized (e.g. empty slots, or if missing baseId), use id
            // But localized cards should have baseId.
            const key = card.baseId || card.id;
            if (!groups[key]) groups[key] = [];
            groups[key].push(card);
        });

        const result: typeof MEMORY_CARDS = [];

        Object.values(groups).forEach(group => {
            // If group has only 1 item (non-localized or only 1 variant), use it
            if (group.length === 1) {
                result.push(group[0]);
                return;
            }

            // Try to find exact language match
            const exactMatch = group.find(c => c.language === currentLang);
            if (exactMatch) {
                result.push(exactMatch);
                return;
            }

            // Fallback to 'en'
            const enMatch = group.find(c => c.language === 'en');
            if (enMatch) {
                result.push(enMatch);
                return;
            }

            // Fallback to first available
            result.push(group[0]);
        });

        // Ensure stable sort order (by id or baseId)
        return result.sort((a, b) => (a.baseId || a.id).localeCompare(b.baseId || b.id));
    }, [language]);

    // Reset selection if out of bounds (when filtering changes list size, though it shouldn't ideally)
    useEffect(() => {
        if (selectedIndex >= filteredCards.length) {
            setSelectedIndex(0);
        }
    }, [filteredCards.length, selectedIndex]);

    useMemoryCardNavigation({
        cards: filteredCards,
        selectedIndex,
        setSelectedIndex,
        viewMode,
        setViewMode,
        onBack: handleBack,
    });


    const handleInteraction = () => {
        playSfx('click');
        const card = filteredCards[selectedIndex];

        if (card.type === 'empty') {
            if (isHandlingRef.current) return;
            isHandlingRef.current = true;
            setIsGenerating(true);

            setTimeout(() => {
                setIsGenerating(false);
                isHandlingRef.current = false;
                playSfx('memory_save_success');
            }, 1000);
        }
    };

    const handleEnter = () => {
        const card = filteredCards[selectedIndex];
        if (card.linkToPlay) {
            playSfx('click');
            window.open(card.linkToPlay, '_blank');
        } else {
            handleInteraction();
        }
    };


    useEffect(() => {
        const handleActionKey = (e: KeyboardEvent) => {
            if (e.key === 'Enter' || e.key === ' ') {
                handleEnter();
            }
        };

        window.addEventListener('keydown', handleActionKey);
        return () => window.removeEventListener('keydown', handleActionKey);
    }, [selectedIndex, filteredCards]); // Added filteredCards dependency


    return (
        <div className="mc-screen">
            <CRTShutdownEffect isActive={isExiting} />

            <div className="mc-screen__bg" />

            <div className="mc-screen__info-wrapper">
                <InfoPanel
                    selectedCard={filteredCards[selectedIndex]}
                    isGenerating={isGenerating}
                />
            </div>

            <div className="mc-screen__content">
                <div
                    ref={gridRef}
                    className="mc-grid"
                >
                    {filteredCards.map((card, index) => (
                        <MemoryCardItem
                            key={card.id}
                            card={card}
                            isSelected={selectedIndex === index}
                            onSelect={() => setSelectedIndex(index)}
                            onClick={handleInteraction}
                        />
                    ))}
                </div>
            </div>

            <RetroControls
                onSelect={handleEnter}
                onBack={handleBack}
            />
        </div>
    );
};

export default MemoryCardScreen;