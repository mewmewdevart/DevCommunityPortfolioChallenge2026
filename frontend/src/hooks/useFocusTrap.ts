import { useEffect, useRef } from 'react';

export const useFocusTrap = (isActive: boolean) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const previousFocus = useRef<HTMLElement | null>(null);

    useEffect(() => {
        if (isActive) {
            previousFocus.current = document.activeElement as HTMLElement;

            const focusableElements = containerRef.current?.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (focusableElements && focusableElements.length > 0) {
                // Small timeout to Ensure element is visible/interactive
                requestAnimationFrame(() => {
                    focusableElements[0].focus();
                });
            }
        }

        return () => {
            if (isActive && previousFocus.current && previousFocus.current.isConnected) {
                previousFocus.current.focus();
            }
        };
    }, [isActive]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isActive || !containerRef.current) return;

        if (e.key === 'Tab') {
            const focusableElements = containerRef.current.querySelectorAll<HTMLElement>(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );

            if (!focusableElements.length) return;

            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    };

    return { containerRef, handleKeyDown };
};
