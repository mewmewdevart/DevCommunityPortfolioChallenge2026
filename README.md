<p align="right">
  <a href="./README.pt-br.md">🇧🇷 Leia em Português</a>
</p>

<div align="center">
  <img src="https://github.com/user-attachments/assets/cd12393e-a49c-486d-bdc8-ee1407dcf371" width="120" height="120" alt="PortfolioWeb XP Logo" />
  <h1>PortfolioWebXP / DevCommunityPortfolioChallenge2026</h1>
  <p><strong>Interactive. Nostalgic. Accessible.</strong></p>
  <p>A gamified portfolio experience built for the Google AI "New Year, New You" Challenge.</p>
  
<p align="center">
<a href="https://devcommunityportfoliochallenge2026-574008284484.us-central1.run.app/">Play the Project</a>
</p>

  <p>
    <img src="https://img.shields.io/badge/Status-In_Progress-6b9acf?style=for-the-badge&logo=headspace&logoColor=white" alt="Status" />
    <img src="https://img.shields.io/badge/Tech-React_19-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/Style-Tailwind_v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  </p>
</div>


## 👋 Introduction

> *"Where did the fun go?"*

We build software for humans, yet most portfolios are static lists of links. This project reimagines the portfolio as an **immersive experience**. By blending the nostalgia of **Windows 95** with the interactivity of a **2D RPG**, we invite users to *explore* a developer's world rather than just read about it.

It serves two purposes:
1.  **For Recruiters & Visitors**: A memorable, engaging way to discover my skills and projects.
2.  **For Developers**: A showcase of complex frontend architecture, custom system design, and strict accessibility standards.

## ✨ Key Features

### 🖥️ Simulated Operating System
A fully functional desktop environment built from scratch:
-   **Window Manager**: Custom logic for drag-and-drop, resizing, minimizing, z-index stacking, and changing focus.
-   **Multitasking**: Open multiple apps (Notepad, Paint, Calculator) simultaneously.
-   **Taskbar**: Real-time state management of open applications and system tray utilities.

### 🎮 Gamified Navigation
-   **2D Room**: A pixel-art environment where you control a character to walk around and interact with objects.
-   **Memory Card Screen**: A PlayStation 2-inspired interface to browse project case studies.
-   **Sound Design**: Context-sensitive sound effects and background music (with user controls) to enhance immersion.

### ♿ Accessibility-First
"Interactive" doesn't mean "inaccessible".
-   **WCAG 2.1 Compliance**: High-contrast modes, focus management, and screen reader support.
-   **Keyboard Navigation**: Full support for navigating the desktop grid, menus, and games without a mouse.
-   **Reduced Motion**: Respects user system preferences.

## 🏗️ Technical Architecture

This project is not just a UI shell; it's a robust application built with modern engineering practices.

### Tech Stack
| Category | Technology | Reasoning |
| :--- | :--- | :--- |
| **Framework** | **React 19 + Vite** | High performance, latest hooks, and fast HMR. |
| **Language** | **TypeScript** | Strict type safety for complex window/system state. |
| **State** | **XState + Context** | State machines handle the complex logic of the OS (boot sequence, window states). |
| **Styling** | **Tailwind CSS v4** | Utility-first for rapid UI dev, configured with BEM naming for structure. |
| **Tests** | **Vitest** | Fast unit and component testing. |
| **I18n** | **i18next** | Full internationalization support (EN/PT-BR/ES). |

### Performance & SEO
-   **PWA Support**: The app is fully installable (Progressive Web App) with offline capabilities, ensuring it feels like a native OS.
-   **Bundle Optimization**: We use code-splitting and dynamic imports (`React.lazy`) for all major applications (Calculator, Game, Paint). This ensures the initial load is blazing fast (under 200kb gzipped) despite the heavy assets.
-   **SEO**: While being an SPA, we utilize `react-helmet-async` and structured JSON-LD data to ensure the portfolio is indexable and provides rich social sharing previews.

### Project Structure
We follow a hybrid **Feature-Based** architecture to keep concerns separated. This ensures that deleting a feature (like the Calculator) removes all its associated logic, assets, and styles instantly.

```bash
src/
├── features/           # Domain logic (e.g., Messenger, FileExplorer, Paint)
│   ├── Calculator/     # Self-contained feature with its own assets/types/logic
│   └── WindowManager/  # Core system logic
├── components/         # Reusable Atomic UI (Buttons, Inputs, Modals)
├── context/            # Global providers (OSContext, SoundContext)
├── hooks/              # Custom hooks (useDraggable, useWindow)
└── content/            # Data layer (projects markdown, registry)
```

## 🚀 How It Works

1.  **Boot Sequence**: The app initializes `OSContext`, loads user preferences, and simulates a BIOS boot screen.
2.  **System Registry**: `AppRegistry.tsx` acts as the kernel, defining all available apps, their icons, default sizes, and capabilities.
3.  **Window Factory**: When an app opens, the `WindowManager` creates an instance wrapped in a `WindowFrame`, injecting the specific feature component while handling global OS events.

## 🛠️ Developer Experience

### Adding Content (Extensibility)
The project is **driven by data**. You don't need to edit React code to add a new project to the portfolio.
1.  Go to `src/content/projects/`.
2.  Create a Markdown file (e.g., `MyProject-en.md`).
3.  Add frontmatter (Title, Tech Stack, Images).
4.  The system automatically parses and renders it in the Game Console interface.

### Theming & Styling
We use **Tailwind v4** with a custom configuration. We combine it with **BEM** methodology in our CSS modules to ensure classes are readable and components are isolated.
-   **Global Variables**: All colors and spacing use CSS variables for easy theming (e.g., `--win-gray`, `--win-blue`).

## 🏁 Getting Started

### Prerequisites
-   Node.js 18+
-   npm

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mewmewdevart/DevCommunityPortfolioChallenge2026.git

# 2. Go to the frontend directory
cd DevCommunityPortfolioChallenge2026/frontend

# 3. Install dependencies
npm install

# 4. Run the development server
npm run dev
```
Open `http://localhost:5173` to start the experience.

## 🤝 Contributing & License

This project is open-source and built for the community.
-   Found a bug? Open an issue.
-   Want to add a "Doom" clone? Submit a PR!

Distributed under the **MIT License**.


<div align="center">
  <sub>Built with 💜 and pixel precision by <strong>mewmewdevart</strong>.</sub>
</div>
