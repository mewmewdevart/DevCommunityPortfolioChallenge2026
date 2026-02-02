import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
} from 'react';

import { useAnnouncement } from '@/context/AnnouncementContext';
import { useSystemState } from '@/context/SystemStateContext';
import { debounce } from '@/utils/debounce';
import { OS_CONFIG } from '@/interfaces/constants';

import type {
    WindowState,
    AppDefinition,
    WindowManagerContextType,
} from '@interfaces/types';

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

export const useWindowManager = () => {
    const context = useContext(WindowManagerContext);
    if (!context) {
        throw new Error('useWindowManager must be used within a WindowManagerProvider');
    }
    return context;
};

export const WindowManagerProvider: React.FC<{
    children: React.ReactNode;
    apps: AppDefinition[];
}> = ({ children, apps }) => {
    const { announce } = useAnnouncement();
    const { isCrashed, isShutDown, systemResetCount } = useSystemState();

    const [windows, setWindows] = useState<WindowState[]>(() => {
        try {
            const saved = localStorage.getItem('OS_WINDOWS_STATE');
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.map((w: WindowState & { appId?: string }) => {
                    const app = apps.find(a => a.id === w.appId);
                    if (!app) return null;
                    return {
                        ...w,
                        component: <app.component windowId={w.id} />
                    };
                }).filter(Boolean);
            }
        } catch (e) {
            console.error("Failed to load window state", e);
        }
        return [];
    });

    const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
    const [highestZIndex, setHighestZIndex] = useState(10);
    const [lastFocusedElements, setLastFocusedElements] = useState<Record<string, HTMLElement | null>>({});

    useEffect(() => {
        if (isCrashed || isShutDown) {
            setWindows([]);
            setActiveWindowId(null);
        }
    }, [isCrashed, isShutDown]);

    useEffect(() => {
        if (systemResetCount > 0) {
            setWindows([]);
            setActiveWindowId(null);
        }
    }, [systemResetCount]);

    useEffect(() => {
        const serializableWindows = windows.map(w => {
            const app = apps.find(a => w.id === a.id || w.id.startsWith(`${a.id}-`));
            if (app) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { component, ...rest } = w;
                return { ...rest, appId: app.id };
            }
            return null;
        }).filter(Boolean);

        localStorage.setItem('OS_WINDOWS_STATE', JSON.stringify(serializableWindows));
    }, [windows, apps]);

    const { MAX_WINDOWS, MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT, ASSISTANT_ID } = OS_CONFIG;

    const focusWindow = useCallback((id: string) => {
        setActiveWindowId(id);

        setHighestZIndex((prevZ) => {
            const newZ = prevZ + 1;

            setWindows((prev) =>
                prev.map((w) =>
                    w.id === id
                        ? { ...w, zIndex: newZ, isMinimized: false }
                        : w
                )
            );

            return newZ;
        });
    }, []);

    const openWindow = useCallback(
        (app: AppDefinition, initialProps?: Record<string, unknown>) => {
            if (app.id === 'computer' || app.id === 'recycle_bin') {
                const existing = windows.find((w) => w.id === app.id);
                if (existing) {
                    focusWindow(app.id);
                    return;
                }
            }

            if (windows.length >= MAX_WINDOWS) return;

            const instanceId =
                app.id === 'computer' || app.id === 'recycle_bin' || app.id === ASSISTANT_ID
                    ? app.id
                    : `${app.id}-${Date.now()}`;

            if (document.activeElement instanceof HTMLElement) {
                setLastFocusedElements(prev => ({ ...prev, [instanceId]: document.activeElement as HTMLElement }));
            }

            const screenW = window.innerWidth;
            const isMobile = screenW < 768;

            let initialX: number;
            let initialY: number;
            let initialWidth = app.defaultSize?.width || 400;
            let initialHeight = app.defaultSize?.height || 300;

            if (isMobile) {
                initialX = 10;
                initialY = 10;
                initialWidth = Math.min(initialWidth, screenW - 20);
                initialHeight = Math.min(initialHeight, window.innerHeight - 100);
            } else {
                if (app.id === ASSISTANT_ID) {
                    initialX = screenW - initialWidth - 20;
                    initialY = window.innerHeight - initialHeight - 60;
                } else {
                    const cascadeOffset = windows.length * 20;
                    const potentialX = 50 + cascadeOffset;
                    const maxX = screenW - initialWidth - 50;
                    initialX = Math.min(potentialX, Math.max(50, maxX));
                    initialY = 50 + cascadeOffset;
                }
            }

            const newWindow: WindowState = {
                id: instanceId,
                title: app.title,
                icon: app.icon,
                component: (
                    <app.component
                        windowId={instanceId}
                        {...initialProps}
                    />
                ),
                isOpen: true,
                isMinimized: false,
                isMaximized: false,
                zIndex: highestZIndex + 1,
                position: { x: initialX, y: initialY },
                size: { width: initialWidth, height: initialHeight },
            };

            setWindows((prev) => [...prev, newWindow]);
            setActiveWindowId(instanceId);

            announce(`${app.title} opened`, 'polite');
        },
        [windows, highestZIndex, focusWindow, ASSISTANT_ID, MAX_WINDOWS, announce]
    );

    const closeWindow = useCallback(
        (id: string) => {
            const window = windows.find(w => w.id === id);
            if (window) {
                announce(`${window.title} closed`, 'polite');
            }

            setWindows((prev) => {
                const remaining = prev.filter((w) => w.id !== id);

                if (activeWindowId === id) {
                    if (remaining.length > 0) {
                        const nextTop = remaining.reduce((highest, current) =>
                            current.zIndex > highest.zIndex ? current : highest
                        );
                        setActiveWindowId(nextTop.id);
                    } else {
                        setActiveWindowId(null);

                        const lastFocus = lastFocusedElements[id];
                        if (lastFocus && document.body.contains(lastFocus)) {
                            lastFocus.focus();
                        }
                        setLastFocusedElements(prev => {
                            const copy = { ...prev };
                            delete copy[id];
                            return copy;
                        });
                    }
                }

                return remaining;
            });
        },
        [activeWindowId, lastFocusedElements, windows, announce]
    );

    const minimizeWindow = useCallback(
        (id: string) => {
            const window = windows.find(w => w.id === id);
            if (window) {
                announce(`${window.title} minimized`, 'polite');
            }

            setWindows((prev) =>
                prev.map((w) =>
                    w.id === id ? { ...w, isMinimized: true } : w
                )
            );
            if (activeWindowId === id) setActiveWindowId(null);
        },
        [activeWindowId, windows, announce]
    );

    const maximizeWindow = useCallback(
        (id: string) => {
            const window = windows.find(w => w.id === id);
            if (window) {
                const action = window.isMaximized ? 'restored' : 'maximized';
                announce(`${window.title} ${action}`, 'polite');
            }

            setWindows((prev) =>
                prev.map((w) =>
                    w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
                )
            );
            focusWindow(id);
        },
        [focusWindow, windows, announce]
    );

    const getAppById = useCallback(
        (id: string) => apps.find((app) => app.id === id),
        [apps]
    );

    const updateWindowTitle = useCallback((id: string, title: string) => {
        setWindows((prev) =>
            prev.map((w) => (w.id === id ? { ...w, title } : w))
        );
    }, []);

    const updateWindowPosition = useCallback((id: string, x: number, y: number) => {
        setWindows((prev) =>
            prev.map((w) =>
                w.id === id ? { ...w, position: { x, y } } : w
            )
        );
    }, []);

    const updateWindowSize = useCallback((id: string, width: number, height: number) => {
        const newWidth = Math.max(width, MIN_WINDOW_WIDTH);
        const newHeight = Math.max(height, MIN_WINDOW_HEIGHT);

        setWindows((prev) =>
            prev.map((w) =>
                w.id === id
                    ? { ...w, size: { width: newWidth, height: newHeight } }
                    : w
            )
        );
    }, [MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT]);

    useEffect(() => {
        const handleResize = debounce(() => {
            setWindows((prev) =>
                prev.map((w) => {
                    if (w.isMaximized) return w;

                    const maxX = window.innerWidth - 60;
                    const maxY = window.innerHeight - 60;

                    const newX = Math.min(w.position.x, maxX);
                    const newY = Math.min(w.position.y, maxY);

                    if (newX !== w.position.x || newY !== w.position.y) {
                        return { ...w, position: { x: Math.max(0, newX), y: Math.max(0, newY) } };
                    }
                    return w;
                })
            );
        }, 100);

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const openWindowRef = useRef(openWindow);
    const closeWindowRef = useRef(closeWindow);
    const appsRef = useRef(apps);

    useEffect(() => {
        openWindowRef.current = openWindow;
        closeWindowRef.current = closeWindow;
        appsRef.current = apps;
    }, [openWindow, closeWindow, apps]);

    const windowsRef = useRef(windows);
    useEffect(() => {
        windowsRef.current = windows;
    }, [windows]);

    // URL opening logic
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const appIdToOpen = params.get('open');

        if (appIdToOpen) {
            const app = apps.find(a => a.id === appIdToOpen);
            if (app) {
                setTimeout(() => {
                    openWindow(app);
                }, 100);
            }
        }
    }, [apps, openWindow]);

    return (
        <WindowManagerContext.Provider
            value={{
                windows,
                activeWindowId,
                openWindow,
                closeWindow,
                minimizeWindow,
                maximizeWindow,
                focusWindow,
                updateWindowPosition,
                updateWindowSize,
                updateWindowTitle,
                getAppById,
            }}
        >
            {children}
        </WindowManagerContext.Provider>
    );
};
