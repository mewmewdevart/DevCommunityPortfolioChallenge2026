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
    const { t } = useTranslation();
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
    useMemoryCardNavigation({
        cards: MEMORY_CARDS,
        selectedIndex,
        setSelectedIndex,
        viewMode,
        setViewMode,
        onBack: handleBack,
    });


    const handleInteraction = () => {
        playSfx('click');
        const card = MEMORY_CARDS[selectedIndex];

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
        const card = MEMORY_CARDS[selectedIndex];
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
    }, [selectedIndex]);


    return (
        <div className="mc-screen">
            <CRTShutdownEffect isActive={isExiting} />

            <div className="mc-screen__bg" />

            <div className="mc-screen__info-wrapper">
                <InfoPanel
                    selectedCard={MEMORY_CARDS[selectedIndex]}
                    isGenerating={isGenerating}
                />
            </div>

            <div className="mc-screen__content">
                <div
                    ref={gridRef}
                    className="mc-grid"
                >
                    {MEMORY_CARDS.map((card, index) => (
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