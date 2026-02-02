import React from 'react';
import type { MemoryCardData } from '@/data/memoryCardsData';
import { useTranslation } from '@/context/LanguageContext';
import { useSound } from '@/context/SoundContext';
import './InfoPanel.css';

interface Props {
    selectedCard: MemoryCardData;
    isGenerating: boolean;
}

export const InfoPanel: React.FC<Props> = ({ selectedCard, isGenerating }) => {
    const { t } = useTranslation();
    const { playSfx } = useSound();

    return (
        <div className="info-panel">
            <div className="info-panel__container">
                <div className="info-panel__inner">

                    <div className="info-panel__badge">
                        <span>{t('mc_slot_1')}</span>
                    </div>

                    {isGenerating ? (
                        <div className="info-panel__loading">
                            <span className="info-panel__loading-text">{t('mc_accessing')}</span>
                            <div className="info-panel__loading-bar-wrapper">
                                <div className="info-panel__loading-bar"></div>
                            </div>
                        </div>
                    ) : selectedCard.type === 'empty' ? (
                        <div className="info-panel__empty">
                            <h1 className="info-panel__empty-title">{t('mc_empty_slot')}</h1>
                            <p className="info-panel__empty-desc" dangerouslySetInnerHTML={{ __html: t('mc_empty_desc') }} />
                        </div>
                    ) : (
                        <>

                            <div className="info-panel__game-info">
                                <h1 className="info-panel__title">
                                    {selectedCard.title}
                                </h1>

                                <div className="info-panel__details-grid">
                                    <span className="info-panel__label">{t('mc_tags')}:</span>
                                    <span>{selectedCard.tags?.join(', ') || 'N/A'}</span>

                                    <span className="info-panel__label">{t('mc_type')}:</span>
                                    <span>{selectedCard.type.toUpperCase()}</span>

                                    <span className="info-panel__label">{t('mc_desc')}:</span>
                                    <span className="info-panel__value">"{selectedCard.description}"</span>
                                </div>
                            </div>

                            <div className="info-panel__stats-container">
                                <div className="info-panel__stats">
                                    <div className="info-panel__stats-label">{t('mc_status')}</div>
                                    <div className="info-panel__stats-value">
                                        {t('mc_ok')}
                                    </div>

                                    <div className="info-panel__progress-bar">
                                        <div
                                            className="info-panel__progress-fill"
                                            style={{ width: `100%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="info-panel__actions">
                                    {selectedCard.linkToPlay && (
                                        <button
                                            onClick={() => {
                                                playSfx('ui_click_retro');
                                                window.open(selectedCard.linkToPlay, '_blank');
                                            }}
                                            className="info-btn info-btn--primary"
                                        >
                                            {t('mc_play')}
                                        </button>
                                    )}
                                    {selectedCard.linkToCode && (
                                        <button
                                            onClick={() => {
                                                playSfx('ui_click_retro');
                                                window.open(selectedCard.linkToCode, '_blank');
                                            }}
                                            className="info-btn"
                                        >
                                            {t('mc_view_code')}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </>
                    )}


                </div>
            </div>
        </div >
    );
};

export default InfoPanel;
