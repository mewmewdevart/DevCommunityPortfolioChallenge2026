import React, { createContext, useContext, useState, useCallback } from 'react';
import type { SystemStateContextType } from '@interfaces/types';

const SystemStateContext = createContext<SystemStateContextType | undefined>(undefined);

export const useSystemState = () => {
    const context = useContext(SystemStateContext);
    if (!context) {
        throw new Error('useSystemState must be used within a SystemStateProvider');
    }
    return context;
};

interface SystemStateProviderProps {
    children: React.ReactNode;
    onReboot?: () => void;
    onReturnToGame?: () => void;
}

export const SystemStateProvider: React.FC<SystemStateProviderProps> = ({
    children,
    onReboot,
    onReturnToGame,
}) => {
    const [isCrashed, setIsCrashed] = useState(false);
    const [isShutDown, setIsShutDown] = useState(false);
    const [systemResetCount, setSystemResetCount] = useState(0);

    const crashSystem = useCallback(() => {
        setIsCrashed(true);
    }, []);

    const shutDownSystem = useCallback(() => {
        setIsShutDown(true);
    }, []);

    const rebootSystem = useCallback(() => {
        setIsCrashed(false);
        setIsShutDown(false);
        setSystemResetCount(prev => prev + 1);
        onReboot?.();
    }, [onReboot]);

    const returnToGame = useCallback(() => {
        setIsShutDown(false);
        setSystemResetCount(prev => prev + 1);
        onReturnToGame?.();
    }, [onReturnToGame]);

    return (
        <SystemStateContext.Provider
            value={{
                isCrashed,
                isShutDown,
                crashSystem,
                rebootSystem,
                shutDownSystem,
                returnToGame,
                systemResetCount,
            }}
        >
            {children}
        </SystemStateContext.Provider>
    );
};
