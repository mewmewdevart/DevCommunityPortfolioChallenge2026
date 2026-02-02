<p align="right">
  <a href="./README.md">🇺🇸 English Version</a>
</p>

<div align="center">

<img
  width="120"
  height="120"
  alt="PortfolioWeb XP Logo"
  src="https://github.com/user-attachments/assets/cd12393e-a49c-486d-bdc8-ee1407dcf371"
/>

# PortfolioWebXP / DevCommunityPortfolioChallenge2026

**Portfólio gamificado interativo exibindo trabalhos, habilidades e personalidade.**
*Desenvolvido para o desafio “New Year, New You Portfolio” 2026 apresentado pelo Google AI.*

<br />

![Status](https://img.shields.io/badge/Status-Em_Progresso-6b9acf?style=for-the-badge&logo=headspace&logoColor=white)
![Contexto](https://img.shields.io/badge/Contexto-Desafio-6b9acf?style=for-the-badge&logo=fiap&logoColor=white)

<p align="center">
  <img src="https://img.shields.io/github/last-commit/mewmewdevart/DevCommunityPortfolioChallenge2026?style=flat-square&color=black" alt="Último Commit">
  <img src="https://img.shields.io/github/repo-size/mewmewdevart/DevCommunityPortfolioChallenge2026?style=flat-square&color=black" alt="Tamanho do Repositório">
  <img src="https://img.shields.io/github/license/mewmewdevart/DevCommunityPortfolioChallenge2026?style=flat-square&color=black" alt="Licença">
</p>

</div>

---

## 🎮 Contexto

> "Ainda me lembro da primeira vez que toquei em um computador e em um videogame. Parecia mágica... Anos depois, como desenvolvedora front-end, percebi que a maioria dos portfólios não passa mais essa sensação."

Este projeto responde à pergunta: **Onde foi parar a diversão?**

Em vez de um site estático tradicional, este é um **jogo 2D interativo** e um **sistema operacional simulado**. Você pode explorar um quarto em pixel art, interagir com objetos e navegar em um desktop inspirado no Windows 95 para descobrir meus projetos e habilidades de uma forma lúdica e humana.

## ✨ Funcionalidades Principais

-   **Sistema de Níveis**: Escolha seu nível de imersão — Jogo Completo, Apenas Desktop ou Currículo Simples.
-   **Quarto Interativo**: Um ambiente 2D onde você pode andar e interagir com objetos (gatos, estante, computador, etc.).
-   **SO Simulado**: Um desktop estilo "Windows 95" totalmente funcional com:
    -   **Barra de Tarefas e Menu Iniciar**: Navegação real e multitarefa.
    -   **Gerenciador de Janelas**: Sistema personalizado para arrastar, redimensionar, minimizar e focar janelas.
    -   **Aplicativos**: Apps funcionais como Bloco de Notas, Calculadora, Reprodutor de Mídia e Paint.
-   **Console de Videogame**: Uma interface estilo "PlayStation 2" ("Tela de Memory Card") para navegar pelos projetos.
-   **Acessibilidade em Primeiro Lugar**: Totalmente navegável por teclado, amigável para leitores de tela (focando em WCAG 2.1 AA/AAA) e rótulos localizados.
-   **Internacionalização**: Suporte completo para **Inglês**, **Português (BR)** e **Espanhol**.

## 🛠️ Tech Stack

Este projeto usa uma stack moderna e robusta para garantir desempenho e manutenibilidade:

-   **Core**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
-   **Linguagem**: [TypeScript](https://www.typescriptlang.org/) (Modo Estrito)
-   **Estilização**: [Tailwind CSS v4](https://tailwindcss.com/) + Metodologia BEM
-   **Gerenciamento de Estado**: React Context (UI Global) + [XState](https://xstate.js.org/) (Interações Complexas)
-   **I18n**: [react-i18next](https://react.i18next.com/)
-   **Testes**: [Vitest](https://vitest.dev/)
-   **Deploy**: Google Cloud Run

## 🏗️ Arquitetura

O projeto segue uma arquitetura híbrida de **Baseada em Features** + **Atomic Design**:

```
src/
├── features/           # Lógica específica do domínio (ex: Messenger, FileExplorer)
├── components/         # UI Reutilizável (Atomic: atoms, molecules, organisms)
├── hooks/              # Lógica compartilhada (useWindow, useFocusTrap)
├── context/            # Estado global (OSContext, SoundContext)
├── pages/              # Views de nível de rota (Desktop, VideoGame)
└── styles/             # Tokens globais e resets CSS
```

### Decisões Chave
-   **Sistema de Janelas Personalizado**: Construído do zero para lidar com z-index complexo e gerenciamento de foco sem bibliotecas pesadas de terceiros.
-   **Acessibilidade**: Anéis de foco de alto contraste, regiões `aria-live` para notificações e roving tabindex para navegação em grade.
-   **Pixel Art**: Todos os assets foram feitos à mão para garantir uma estética nostálgica consistente.

## 🚀 Como Começar

### Pré-requisitos
-   Node.js 18+
-   npm

### Instalação

1.  Clone o repositório:
    ```bash
    git clone https://github.com/mewmewdevart/DevCommunityPortfolioChallenge2026.git
    cd DevCommunityPortfolioChallenge2026
    ```

2.  Instale as dependências:
    ```bash
    cd frontend
    npm install
    ```

3.  Rode o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

4.  Abra `http://localhost:5173` no seu navegador.

## 🤝 Contribuindo

Feedbacks e contribuições são bem-vindos! Sinta-se à vontade para abrir issues ou enviar pull requests.

1.  Faça um Fork do Projeto
2.  Crie sua Feature Branch (`git checkout -b feature/AppIncrivel`)
3.  Commit suas mudanças (`git commit -m 'Adiciona AppIncrivel'`)
4.  Push para a Branch (`git push origin feature/AppIncrivel`)
5.  Abra um Pull Request

## 📄 Licença

Distribuído sob a Licença MIT. Veja `LICENSE` para mais informações.

---

<br /> 
<div align="center"> 
  <sub>Feito com 💜, muito chá mate, por <strong>mewmewdevart</strong>.</sub> 
</div> 
