<p align="right">
  <a href="./README.md">🇺🇸 Read in English</a>
</p>

<div align="center">
  <img src="https://github.com/user-attachments/assets/cd12393e-a49c-486d-bdc8-ee1407dcf371" width="120" height="120" alt="PortfolioWeb XP Logo" />
  <h1>PortfolioWebXP / DevCommunityPortfolioChallenge2026</h1>
  <p><strong>Interativo. Nostálgico. Acessível.</strong></p>
  <p>Uma experiência de portfólio gamificada criada para o Desafio Google AI "New Year, New You".</p>

  <p>
    <img src="https://img.shields.io/badge/Status-Em_Progresso-6b9acf?style=for-the-badge&logo=headspace&logoColor=white" alt="Status" />
    <img src="https://img.shields.io/badge/Tech-React_19-blue?style=for-the-badge&logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/Style-Tailwind_v4-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  </p>
</div>

---

## 👋 Introdução

> *"Onde foi parar a diversão?"*

Desenvolvemos software para humanos, mas a maioria dos portfólios são apenas listas estáticas de links. Este projeto reimagina o portfólio como uma **experiência imersiva**. Ao misturar a nostalgia do **Windows 95** com a interatividade de um **RPG 2D**, convidamos os usuários a *explorar* o mundo de um desenvolvedor em vez de apenas ler sobre ele.

Ele serve a dois propósitos:
1.  **Para Recrutadores e Visitantes**: Uma maneira memorável e envolvente de descobrir minhas habilidades e projetos.
2.  **Para Desenvolvedores**: Uma demonstração de arquitetura frontend complexa, design de sistemas personalizados e rigorosos padrões de acessibilidade.

## ✨ Funcionalidades Principais

### 🖥️ Sistema Operacional Simulado
Um ambiente desktop totalmente funcional construído do zero:
-   **Gerenciador de Janelas**: Lógica personalizada para arrastar, redimensionar, minimizar, empilhamento de z-index e mudança de foco.
-   **Multitarefa**: Abra vários aplicativos (Bloco de Notas, Paint, Calculadora) simultaneamente.
-   **Barra de Tarefas**: Gerenciamento em tempo real de aplicativos abertos e utilitários da bandeja do sistema.

### 🎮 Navegação Gamificada
-   **Quarto 2D**: Um ambiente em pixel art onde você controla um personagem para andar e interagir com objetos.
-   **Tela de Memory Card**: Uma interface inspirada no PlayStation 2 para navegar pelos estudos de caso dos projetos.
-   **Design de Som**: Efeitos sonoros sensíveis ao contexto e música de fundo (com controles do usuário) para aumentar a imersão.

### ♿ Acessibilidade em Primeiro Lugar
"Interativo" não significa "inacessível".
-   **Conformidade WCAG 2.1**: Modos de alto contraste, gerenciamento de foco e suporte a leitores de tela.
-   **Navegação por Teclado**: Suporte total para navegar na grade da área de trabalho, menus e jogos sem mouse.
-   **Movimento Reduzido**: Respeita as preferências do sistema do usuário.

## 🏗️ Arquitetura Técnica

Este projeto não é apenas uma casca de UI; é uma aplicação robusta construída com práticas modernas de engenharia.

### Tech Stack
| Categoria | Tecnologia | Motivação |
| :--- | :--- | :--- |
| **Framework** | **React 19 + Vite** | Alta performance, hooks mais recentes e HMR rápido. |
| **Linguagem** | **TypeScript** | Tipagem estrita para segurança na lógica complexa de estado do sistema. |
| **Estado** | **XState + Context** | Máquinas de estado lidam com a lógica complexa do SO (boot, janelas). |
| **Estilo** | **Tailwind CSS v4** | Utility-first para desenvolvimento rápido, configurado com BEM para estrutura. |
| **Testes** | **Vitest** | Testes unitários e de componentes rápidos. |
| **I18n** | **i18next** | Suporte total a internacionalização (EN/PT-BR/ES). |

### Performance e SEO
-   **Suporte a PWA**: O aplicativo é totalmente instalável (Progressive Web App) com capacidades offline, garantindo que pareça um SO nativo.
-   **Otimização de Bundle**: Usamos code-splitting e importações dinâmicas (`React.lazy`) para todos os principais aplicativos (Calculadora, Jogo, Paint). Isso garante que o carregamento inicial seja extremamente rápido (menos de 200kb gzipped) apesar dos assets pesados.
-   **SEO**: Apesar de ser uma SPA, utilizamos `react-helmet-async` e dados estruturados JSON-LD para garantir que o portfólio seja indexável e forneça prévias ricas para compartilhamento social.

### Estrutura do Projeto
Seguimos uma arquitetura híbrida **Baseada em Features** para manter as responsabilidades separadas. Isso garante que excluir uma feature (como a Calculadora) remova toda a sua lógica, assets e estilos instantaneamente.

```bash
src/
├── features/           # Lógica de domínio (ex: Messenger, FileExplorer, Paint)
│   ├── Calculator/     # Feature contida com seus próprios assets/tipos/lógica
│   └── WindowManager/  # Lógica central do sistema
├── components/         # UI Atômica Reutilizável (Botões, Inputs, Modais)
├── context/            # Provedores globais (OSContext, SoundContext)
├── hooks/              # Hooks customizados (useDraggable, useWindow)
└── content/            # Camada de dados (markdown de projetos, registro)
```

## 🚀 Como Funciona

1.  **Sequência de Boot**: O app inicializa o `OSContext`, carrega preferências do usuário e simula uma tela de boot da BIOS.
2.  **Registro do Sistema**: `AppRegistry.tsx` atua como o kernel, definindo todos os apps disponíveis, ícones, tamanhos padrão e capacidades.
3.  **Fábrica de Janelas**: Quando um app abre, o `WindowManager` cria uma instância envolvida em um `WindowFrame`, injetando o componente da feature específica enquanto lida com eventos globais do SO.

## 🛠️ Experiência do Desenvolvedor

### Adicionando Conteúdo (Extensibilidade)
O projeto é **orientado a dados**. Você não precisa editar código React para adicionar um novo projeto ao portfólio.
1.  Vá para `src/content/projects/`.
2.  Crie um arquivo Markdown (ex: `MeuProjeto-ptBR.md`).
3.  Adicione o frontmatter (Título, Stack, Imagens).
4.  O sistema analisa e renderiza automaticamente na interface do Console.

### Temas e Estilo
Usamos **Tailwind v4** com uma configuração personalizada. Combinamos com a metodologia **BEM** em nossos módulos CSS para garantir que as classes sejam legíveis e os componentes isolados.
-   **Variáveis Globais**: Todas as cores e espaçamentos usam variáveis CSS para fácil tematização (ex: `--win-gray`, `--win-blue`).

## 🏁 Como Começar

### Pré-requisitos
-   Node.js 18+
-   npm

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/mewmewdevart/DevCommunityPortfolioChallenge2026.git

# 2. Vá para o diretório frontend
cd DevCommunityPortfolioChallenge2026/frontend

# 3. Instale as dependências
npm install

# 4. Rode o servidor de desenvolvimento
npm run dev
```
Abra `http://localhost:5173` para iniciar a experiência.

## 🤝 Contribuição e Licença

Este projeto é open-source e feito para a comunidade.
-   Encontrou um bug? Abra uma issue.
-   Quer adicionar um clone de "Doom"? Envie um PR!

Distribuído sob a **Licença MIT**.

---

<div align="center">
  <sub>Feito com 💜 e precisão de pixel por <strong>mewmewdevart</strong>.</sub>
</div>
