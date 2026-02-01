import React from 'react';
import { type MemoryCardData, getMemoryCardImage } from '@/data/memoryCardsData';
import { useTranslation } from '@/context/LanguageContext';
import './MemoryCardItem.css';

interface Props {
    card: MemoryCardData;
    isSelected: boolean;
    onSelect: () => void;
    onClick: () => void;
}

const MemoryCardItem: React.FC<Props> = ({ card, isSelected, onSelect, onClick }) => {
    const { t } = useTranslation();
    const imageSrc = getMemoryCardImage(card);
    const classMod = card.type === 'corrupt' ? 'memory-card-item__icon--corrupt' : 'memory-card-item__icon--active';

    return (
        <div
            className="memory-card-item group"
            onClick={() => {
                onSelect();
                onClick();
            }}
            role="button"
            tabIndex={0}
            onFocus={onSelect}
        >
            {/* Selection Arrow */}
            <div className={`memory-card-item__arrow-wrapper ${isSelected ? 'memory-card-item__arrow-wrapper--selected' : ''}`}>
                <div className="memory-card-item__arrow"></div>
            </div>

            {/* Pixel Card Container */}
            <div className={`memory-card-item__container ${isSelected ? 'memory-card-item__container--selected' : ''}`}>

                {/* The Card Shape */}
                <div className={`memory-card-item__shape ${isSelected ? 'memory-card-item__shape--selected' : ''}`}>

                    <picture>
                        {card.imageWebP && <source srcSet={card.imageWebP} type="image/webp" />}
                        <img src={imageSrc} className={`memory-card-item__icon ${classMod || ''}`} alt="" />
                    </picture>

                </div>
            </div>

            {/* Text Label */}
            <div className={`memory-card-item__label ${isSelected ? 'memory-card-item__label--selected' : ''}`}>
                <h3 className={`memory-card-item__title ${isSelected ? 'memory-card-item__title--selected' : ''}`}>
                    {card.type === 'empty' ? t('mc_no_data') : card.title || t('mc_corrupted')}
                </h3>
                {isSelected && card.type !== 'empty' && (
                    <div className="memory-card-item__size">
                        {card.size}
                    </div>
                )}
            </div>

        </div>
    );
};

export default MemoryCardItem;
