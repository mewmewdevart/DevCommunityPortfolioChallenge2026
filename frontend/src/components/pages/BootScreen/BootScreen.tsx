import React, { useEffect, useState } from 'react';
import { useTranslation } from '@/context/LanguageContext';
import './BootScreen.css';

interface BootScreenProps {
    onComplete: () => void;
}

export const BootScreen: React.FC<BootScreenProps> = ({ onComplete }) => {
    const { t } = useTranslation();
    const [text, setText] = useState<string>('');

    useEffect(() => {
        const lines = [
            t('boot_1'),
            t('boot_2'),
            t('boot_3'),
            t('boot_4'),
            t('boot_5'),
            t('boot_6'),
            ' ',
        ];

        let lineIndex = 0;
        let isWaitingForInput = false;

        const interval = setInterval(() => {
            if (isWaitingForInput) return;

            if (lineIndex >= lines.length) {
                clearInterval(interval);
                isWaitingForInput = true;
                setText(prev => prev + '\n\n> ' + t('boot_press_key'));

                const handleInput = () => {
                    window.removeEventListener('keydown', handleInput);
                    window.removeEventListener('click', handleInput);
                    window.removeEventListener('touchstart', handleInput);
                    onComplete();
                };

                window.addEventListener('keydown', handleInput);
                window.addEventListener('click', handleInput);
                window.addEventListener('touchstart', handleInput);
                return;
            }

            const content = lines[lineIndex];
            if (content && content !== 'undefined') {
                setText(prev => prev + (prev ? '\n' : '') + content);
            }
            lineIndex++;
        }, 600);

        return () => {
            clearInterval(interval);
        };
    }, [onComplete, t]);

    return (
        <div className="boot-screen">
            <pre className="boot-screen__text">{text}</pre>
            <div className="boot-screen__cursor">_</div>
        </div>
    );
};
