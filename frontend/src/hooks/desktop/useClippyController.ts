import { useEffect, useRef } from 'react';
import { useOS } from '@/context/OSContext';
import { APP_IDS } from '@/data/appIds';

export const useClippyController = () => {
    const { windows, openWindow, getAppById } = useOS();
    const windowsRef = useRef(windows);

    // Keep ref in sync for interval
    useEffect(() => {
        windowsRef.current = windows;
    }, [windows]);

    useEffect(() => {
        // Check every 60 seconds
        const INTERVAL = 60000;

        const tick = () => {
            const isClippyOpen = windowsRef.current.some(w => w.id === APP_IDS.ASSISTANT);

            if (!isClippyOpen) {
                const clippyApp = getAppById(APP_IDS.ASSISTANT);
                if (clippyApp) {
                    // Open with specific flag so the app knows to auto-close itself
                    openWindow(clippyApp, { isAutoOpened: true });
                }
            }
        };

        const timerId = setInterval(tick, INTERVAL);

        return () => clearInterval(timerId);
    }, [openWindow, getAppById]);
};
