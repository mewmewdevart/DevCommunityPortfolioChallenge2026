import { useEffect } from 'react';

export interface KeyboardShortcutHandlers {
    onCloseWindow?: () => void;
    onToggleStartMenu?: () => void;
    onEscape?: () => void;
}

/**
 * Global keyboard shortcuts hook for Windows 95-style interactions.
 * 
 * Shortcuts:
 * - Alt+F4: Close active window
 * - Meta/Win key: Toggle Start Menu
 * - Escape: Close menus/dialogs
 * 
 * @param handlers - Object containing callback functions for each shortcut
 * 
 * @example
 * ```tsx
 * useKeyboardShortcuts({
 *   onCloseWindow: () => closeWindow(activeWindowId),
 *   onToggleStartMenu: () => setStartMenuOpen(prev => !prev),
 *   onEscape: () => closeAllMenus(),
 * });
 * ```
 */
export const useKeyboardShortcuts = (handlers: KeyboardShortcutHandlers) => {
    const { onCloseWindow, onToggleStartMenu, onEscape } = handlers;

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Alt+F4: Close active window (classic Windows shortcut)
            if (e.altKey && e.key === 'F4') {
                e.preventDefault();
                onCloseWindow?.();
                return;
            }

            // Meta/Win key: Toggle Start Menu
            // Note: Meta key alone is hard to capture due to OS interference
            // We use it when possible, but may need Alt+S as fallback
            if ((e.metaKey || e.key === 'Meta' || e.key === 'OS') && !e.ctrlKey && !e.altKey) {
                e.preventDefault();
                onToggleStartMenu?.();
                return;
            }

            // Escape: Close menus, dialogs, context menus
            if (e.key === 'Escape') {
                onEscape?.();
                return;
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onCloseWindow, onToggleStartMenu, onEscape]);
};
