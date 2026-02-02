import React, { createContext, useContext, useMemo } from 'react';
import type { AppDefinition, OSContextType } from '@interfaces/types';
import { SystemStateProvider, useSystemState } from '@/context/SystemStateContext';
import { WindowManagerProvider, useWindowManager } from '@/context/WindowManagerContext';

const OSContext = createContext<OSContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useOS = () => {
  const context = useContext(OSContext);
  if (!context) {
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};

const OSContextComposer: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemState = useSystemState();
  const windowManager = useWindowManager();

  const combinedValue: OSContextType = useMemo(() => ({
    ...systemState,
    ...windowManager,
  }), [systemState, windowManager]);

  return (
    <OSContext.Provider value={combinedValue}>
      {children}
    </OSContext.Provider>
  );
};

export const OSProvider: React.FC<{
  children: React.ReactNode;
  apps: AppDefinition[];
  onReboot?: () => void;
  onReturnToGame?: () => void;
}> = ({ children, apps, onReboot, onReturnToGame }) => {
  return (
    <SystemStateProvider onReboot={onReboot} onReturnToGame={onReturnToGame}>
      <WindowManagerProvider apps={apps}>
        <OSContextComposer>
          {children}
        </OSContextComposer>
      </WindowManagerProvider>
    </SystemStateProvider>
  );
};
