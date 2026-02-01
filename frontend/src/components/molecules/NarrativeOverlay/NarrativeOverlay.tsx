import React from 'react';
import MewMewPhoto from "@assets/images/game/hud-me1.png";
import MewMewPhotoWebP from "@assets/images/game/hud-me1.webp";
import { useTranslation } from '@/context/LanguageContext';
import './NarrativeOverlay.css';

interface NarrativeAction {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
}

interface NarrativeOverlayProps {
    message: string | null;
    isVisible: boolean;
    actions?: NarrativeAction[];
    onClose?: () => void;
}

export const NarrativeOverlay: React.FC<NarrativeOverlayProps> = ({
    message,
    isVisible,
    actions = [],
    onClose
}) => {
    const { t } = useTranslation();
    const firstButtonRef = React.useRef<HTMLButtonElement>(null);
    const textRef = React.useRef('');
    const [, forceRender] = React.useState(0);

    React.useEffect(() => {
        if (isVisible && actions.length > 0) {
            const timer = setTimeout(() => {
                firstButtonRef.current?.focus();
            }, 50);
            return () => clearTimeout(timer);
        }
    }, [isVisible, actions]);

    React.useLayoutEffect(() => {
        if (!isVisible || !message) return;

        textRef.current = '';
        let index = 0;

        const interval = setInterval(() => {
            if (index < message.length) {
                textRef.current += message[index];
                index++;
                forceRender(v => v + 1);
            } else {
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [message, isVisible]);

    React.useEffect(() => {
        if (isVisible && onClose) {
            const timer = setTimeout(() => {
                onClose();
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [isVisible, onClose, message]);

    if (!isVisible || !message) return null;

    return (
        <div
            className="narrative-overlay"
            role="dialog"
            aria-modal="true"
        >
            <div className="narrative-overlay__wrapper">
                <div className="narrative-overlay__character-container">
                    <picture>
                        <source srcSet={MewMewPhotoWebP} type="image/webp" />
                        <img
                            src={MewMewPhoto}
                            alt={t('narrative_avatar_alt')}
                            className="narrative-overlay__character-image"
                        />
                    </picture>
                </div>

                <div className="narrative-overlay__dialogue-box">
                    <h3 className='narrative-overlay__name'>Larissa </h3>
                    <div className="narrative-overlay__content">
                        <p className="narrative-overlay__text">
                            {textRef.current}
                            <span className="narrative-overlay__cursor">|</span>
                        </p>

                        {actions.length > 0 && (
                            <div className="narrative-overlay__actions">
                                {actions.map((action, index) => (
                                    <button
                                        key={index}
                                        ref={index === 0 ? firstButtonRef : null}
                                        onClick={action.onClick}
                                        className={`narrative-overlay__btn narrative-overlay__btn--${action.variant || 'primary'}`}
                                    >
                                        {action.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
