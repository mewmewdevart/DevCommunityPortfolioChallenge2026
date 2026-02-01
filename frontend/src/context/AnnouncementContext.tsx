import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

type PolitenessLevel = 'polite' | 'assertive' | 'off';

interface AnnouncementContextValue {
    announce: (message: string, politeness?: PolitenessLevel) => void;
    currentAnnouncement: string;
    politeness: PolitenessLevel;
}

const AnnouncementContext = createContext<AnnouncementContextValue | undefined>(undefined);

export const useAnnouncement = () => {
    const context = useContext(AnnouncementContext);
    if (!context) {
        throw new Error('useAnnouncement must be used within AnnouncementProvider');
    }
    return context;
};

interface AnnouncementProviderProps {
    children: React.ReactNode;
}

export const AnnouncementProvider: React.FC<AnnouncementProviderProps> = ({ children }) => {
    const [currentAnnouncement, setCurrentAnnouncement] = useState('');
    const [politeness, setPoliteness] = useState<PolitenessLevel>('polite');
    const timeoutRef = useRef<number | null>(null);

    const announce = useCallback((message: string, level: PolitenessLevel = 'polite') => {
        // Clear existing timeout
        if (timeoutRef.current) {
            window.clearTimeout(timeoutRef.current);
        }

        // Set new announcement
        setPoliteness(level);
        setCurrentAnnouncement(message);

        // Auto-clear after 5 seconds to prevent stale announcements
        timeoutRef.current = window.setTimeout(() => {
            setCurrentAnnouncement('');
        }, 5000);
    }, []);

    const value: AnnouncementContextValue = {
        announce,
        currentAnnouncement,
        politeness,
    };

    return (
        <AnnouncementContext.Provider value={value}>
            {children}
            {/* ARIA Live Region - Visually Hidden but Accessible to Screen Readers */}
            <div
                role="status"
                aria-live={politeness}
                aria-atomic="true"
                className="sr-only"
            >
                {currentAnnouncement}
            </div>
        </AnnouncementContext.Provider>
    );
};
