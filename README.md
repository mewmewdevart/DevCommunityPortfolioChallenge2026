<p align="right">
  <a href="./README.pt-br.md">🇧🇷 Versão em Português Brasileiro</a>
</p>


<div align="center">

<img
  width="120"
  height="120"
  alt="PortfolioWeb XP Logo"
  src="https://github.com/user-attachments/assets/cd12393e-a49c-486d-bdc8-ee1407dcf371"
/>

# PortfolioWebXP / DevCommunityPortfolioChallenge2026

**Interactive gamified portfolio showcasing work, skills, and personality.**
*Developed for the “New Year, New You Portfolio” Challenge 2026 presented by Google AI.*

<br />

![Status](https://img.shields.io/badge/Status-In_Progress-6b9acf?style=for-the-badge&logo=headspace&logoColor=white)
![Context](https://img.shields.io/badge/Context-Challenge-6b9acf?style=for-the-badge&logo=fiap&logoColor=white)

<p align="center">
  <img src="https://img.shields.io/github/last-commit/mewmewdevart/DevCommunityPortfolioChallenge2026?style=flat-square&color=black" alt="Last Commit">
  <img src="https://img.shields.io/github/repo-size/mewmewdevart/DevCommunityPortfolioChallenge2026?style=flat-square&color=black" alt="Repo Size">
  <img src="https://img.shields.io/github/license/mewmewdevart/DevCommunityPortfolioChallenge2026?style=flat-square&color=black" alt="License">
</p>

</div>

---

## 🎮 Context

> "I still remember the first time I touched a computer and a video game. It felt like magic... Years later, as a front-end developer, I realized most portfolios don’t feel like that anymore."

This project answers the question: **Where did the fun go?**

Instead of a traditional static site, this is an **interactive 2D top-down game** and **simulated operating system**. You can explore a pixel-art room, interact with objects, and navigate a Windows 95-inspired desktop to discover my projects and skills in a playful, human way.

## ✨ Key Features

-   **Level System**: Choose your immersion level — Full Game, Desktop Only, or simple Résumé.
-   **Interactive Room**: A 2D top-down environment where you can walk around and interact with objects (cats, bookshelf, computer, etc.).
-   **Simulated OS**: A fully functional "Windows 95" style desktop with:
    -   **Taskbar & Start Menu**: Real navigation and multitasking.
    -   **Window Manager**: Custom-built system for dragging, resizing, minimizing, and focusing windows.
    -   **Applications**: functional apps like Notepad, Calculator, Media Player, and Paint.
-   **Game Console**: A "PlayStation 2" style interface ("Memory Card Screen") to browse projects.
-   **Accessibility First**: Fully keyboard navigable, screen-reader friendly (WCAG 2.1 AA/AAA targeting), and localized labels.
-   **Internationalization**: Full support for **English**, **Portuguese (BR)**, and **Spanish**.

## 🛠️ Tech Stack

This project uses a modern, robust stack to ensure performance and maintainability:

-   **Core**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) + BEM methodology
-   **State Management**: React Context (Global UI) + [XState](https://xstate.js.org/) (Complex interactions)
-   **I18n**: [react-i18next](https://react.i18next.com/)
-   **Testing**: [Vitest](https://vitest.dev/)
-   **Deployment**: Google Cloud Run

## 🏗️ Architecture

The project follows a hybrid **Feature-Based** + **Atomic Design** architecture:

```
src/
├── features/           # Domain-specific logic (e.g., Messenger, FileExplorer)
├── components/         # Reusable UI (Atomic: atoms, molecules, organisms)
├── hooks/              # Shared logic (useWindow, useFocusTrap)
├── context/            # Global state (OSContext, SoundContext)
├── pages/              # Route-level views (Desktop, VideoGame)
└── styles/             # Global tokens and CSS resets
```

### Key Decisions
-   **Custom Window System**: Built from scratch to handle complex z-indexing and focus management without heavy third-party libraries.
-   **Accessibility**: High-contrast focus rings, `aria-live` regions for notifications, and roving tabindex for grid navigation.
-   **Pixel Art**: All assets were handcrafted to ensure a consistent, nostalgic aesthetic.

## 🚀 Getting Started

### Prerequisites
-   Node.js 18+
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/mewmewdevart/DevCommunityPortfolioChallenge2026.git
    cd DevCommunityPortfolioChallenge2026
    ```

2.  Install dependencies:
    ```bash
    cd frontend
    npm install
    ```

3.  Run the development server:
    ```bash
    npm run dev
    ```

4.  Open `http://localhost:5173` in your browser.

## 🤝 Contributing

Feedback and contributions are welcome! Please feel free to open issues or submit pull requests.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<br /> 
<div align="center"> 
  <sub>Made with 💜, lots of matte tea, by <strong>mewmewdevart</strong>.</sub> 
</div> 
