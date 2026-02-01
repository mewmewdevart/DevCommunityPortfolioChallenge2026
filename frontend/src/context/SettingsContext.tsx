import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
    crtEnabled: boolean;
    toggleCrt: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [crtEnabled, setCrtEnabled] = useState(() => {
        const saved = localStorage.getItem('SETTINGS_CRT_ENABLED');
        return saved !== null ? JSON.parse(saved) : true;
    });

    useEffect(() => {
        localStorage.setItem('SETTINGS_CRT_ENABLED', JSON.stringify(crtEnabled));
        if (crtEnabled) {
            document.body.classList.add('crt-enabled');
        } else {
            document.body.classList.remove('crt-enabled');
        }
    }, [crtEnabled]);

    const toggleCrt = () => {
        setCrtEnabled((prev: boolean) => !prev);
    };

    return (
        <SettingsContext.Provider value={{ crtEnabled, toggleCrt }}>
            {children}
        </SettingsContext.Provider>
    );
};
