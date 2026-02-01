import React, { createContext, useContext, useMemo } from 'react';
import type { AppDefinition, OSContextType } from '@interfaces/types';
import { SystemStateProvider, useSystemState } from '@/context/SystemStateContext';
import { WindowManagerProvider, useWindowManager } from '@/context/WindowManagerContext';

const OSContext = createContext<OSContextType | undefined>(undefined);

// eslint-disable-next-line react-refresh/only-export-components
export const useOS = () => {
  const context = useContext(OSContext);
  // Fallback for components that might check for context existence, 
  // but preferably we want to use the composed hooks if the provider is missing (which shouldn't happen)
  if (!context) {
    // If we are strictly using the new providers, we might not need this Context object 
    // but legacy code might depend on it.
    // However, let's try to grab form hooks if context is undefined? 
    // No, hooks need providers.
    // If we are inside OSProvider, context will be defined.
    throw new Error('useOS must be used within an OSProvider');
  }
  return context;
};

// Internal component to compose the context value
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
