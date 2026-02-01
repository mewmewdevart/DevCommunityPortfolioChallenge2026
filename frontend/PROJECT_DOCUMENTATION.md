# DevPortfolioChallenge2026 - Project Documentation

**The Canonical Source of Truth**

This document consolidates all technical, architectural, design, and accessibility documentation for the DevPortfolioChallenge2026. It serves as the single point of reference for understanding the project's goals, structure, and implementation details.

---

## 1. Project Overview & Goals

**DevPortfolioChallenge2026** is a web-based interactive experience that simulates a retro operating system (inspired by Windows 95) and classic video game interfaces (PlayStation 2).

**Primary Goals:**
*   **Showcase Technical Depth**: Demonstrate advanced frontend skills including complex state management, custom windowing systems, and performance optimization.
*   **Accessibility-First**: Prove that "creative" or "immersive" portfolios can still be fully accessible, WCAG 2.1 compliant, and usable by screen readers.
*   **Immersive Narrative**: Provide a unique, story-driven user experience that differentiates it from standard portfolios.

**Key Technical Achievements:**
*   **Custom Window System**: Built from scratch handling drag, resize, z-index, and focus without third-party UI libraries.
*   **Visual Novel Engine**: A dedicated narrative layer for storytelling.
*   **Internationalization**: Full English and Portuguese (pt-BR) support.

---

## 2. UX & Interface Concept

The interface is designed to evoke nostalgia while maintaining modern usability standards.

### Core Metaphors
*   **The Desktop**: Mimics a standard OS environment. Users expect drag-and-drop, double-click to open, and taskbar navigation.
*   **The Game Console**: A "Memory Card" style interface used for project navigation, mimicking the PS2 BIOS screen.
*   **Visual Novel**: A dialog-based interaction mode for narrative delivery.

### User Experience Principles
*   **Familiarity**: Leverage existing mental models (e.g., "X" button closes window, Taskbar switches apps).
*   **Feedback**: Extensive use of sound effects (with mute option), custom cursors, and active states to provide immediate feedback.
*   **Politeness**: Accessibility features (like Live Regions) are "polite" by default to avoid overwhelming users.

---

## 3. Technical Architecture

### Technology Stack (Non-Negotiable)
*   **Framework**: React 18+ (Vite)
*   **Language**: TypeScript (Strict Mode)
*   **Styling**: Tailwind CSS v4 (configured via `@tailwindcss/vite`) + BEM methodology.
*   **State Management**: React Context (Global UI) + XState (Complex flows).
*   **Internationalization**: i18next (HttpBackend for lazy loading).
*   **Testing**: Vitest.

### Project Structure
The project follows a hybrid **Feature-Based** and **Atomic Design** structure:

```
src/
├── features/           # Domain-specific logic (e.g., Messenger, FileExplorer)
├── components/         # Reusable UI (Atomic: atoms, molecules, organisms)
├── hooks/              # Shared logic (useWindow, useFocusTrap)
├── context/            # Global state (OSContext, SoundContext)
├── pages/              # Route-level views (Desktop, VideoGame)
└── styles/             # Global tokens and CSS resets
```

### Architectural Layers
1.  **Shared Layer**: Pure logic, hooks, and utils. No UI dependencies.
2.  **Atomic Layer**: Dumb UI components. pure presentation.
3.  **Feature Layer**: Smart components with business logic.
4.  **Page Layer**: Route composition.

---

## 4. Accessibility Strategy & Decisions

Accessibility is not an afterthought; it is a core architectural pillar. We target **WCAG 2.1 AA/AAA compliance**.

### Focus Management Strategy
*   **Global Focus Ring**: A standard high-contrast focus indicator (3px solid blue + white shadow) is enforced globally via `globals.css`.
*   **Decoupling Hover**: Hovering over items (like Memory Cards) updates visual state but **never** moves keyboard focus. This prevents "focus stealing" for users using screen magnifiers.
*   **Roving TabIndex**: Used in the Desktop Grid and Memory Card screens. The container or active item has `tabindex="0"`, others have `-1`. Arrow keys manage internal focus.

### Screen Reader Compatibility
*   **Live Regions**: The Chat app and Window Manager use `aria-live="polite"` and `role="log"` to announce dynamic updates (e.g., "Calculator opened", "New message").
*   **Semantic HTML**: Native `<button>`, `<nav>`, `<main>` are preferred over ARIA. ARIA is strictly reserved for custom widgets where semantic HTML is insufficient.
*   **Hidden Instructions**: Complex interactions (like the desktop grid) include hidden text (`aria-describedby`) explaining "Use arrow keys to navigate".

### Keyboard Navigation Model
*   **Tab**: Moves between major interface areas (Taskbar -> Desktop -> Active Window).
*   **Arrow Keys**: Navigate within grids (Desktop Icons, Menus).
*   **Escape**: Closes menus, cancels selections, or moves focus "up" a level.
*   **Skip Links**: A hidden toolbar appears on first Tab press to skip to major sections (Game, Desktop, etc.).

---

## 5. Internationalization & Localization

*   **Technology**: `react-i18next`.
*   **Strategy**: Translations are stored in `public/locales/{lang}.json` and lazy-loaded.
*   **Accessibility**: All accessibility strings (aria-labels, hidden hints) are localized.
*   **Keys**: Managed via `translationsKeys.ts` for type safety.

---

## 6. Development Guidelines

### CSS Architecture
*   **BEM**: All custom CSS must follow Block-Element-Modifier naming (e.g., `.window__title-bar`).
*   **Design Tokens**: Use CSS variables for colors, spacing, and z-index. No magic numbers.
*   **Tailwind**: Use `@apply` in CSS files for complex styles. Avoid excessive utility classes in JSX.

### React Best Practices
*   **Small Components**: Single responsibility principle.
*   **Hooks**: Extract reusable logic (e.g., drag-and-drop) into custom hooks.
*   **Semantic Wrapper**: Avoid `<div>` soup. Use `<section>`, `<article>`, etc.

---

## 7. Known Limitations & Trade-offs

*   **Window State**: Currently managed via a monolithic `OSContext`. This is simple but causes broad re-renders on window drag. For >20 windows, this should be refactored to an atomic state manager (Zustand/Jotai).
*   **Mobile Experience**: while responsive, the "Desktop" metaphor is inherently cramped on small screens. Some resizing features are disabled on mobile.
*   **SEO**: As a client-side SPA, SEO relies on bots executing JS.

---

## 8. Future Improvements

*   **Testing**: Implement E2E tests (Playwright) for the window manager flow.
*   **Onboarding**: Add a "first-run" tutorial for the unique UI.
*   **Window Snapping**: Implement "snap-to-edge" functionality for windows.
*   **Dark Mode**: Add a system-wide high-contrast dark theme (Windows 98 style).
