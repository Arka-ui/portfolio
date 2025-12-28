# Arka.dev - Sentient Portfolio

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-cyan)

A high-performance, interactive portfolio website built with **Next.js 16**, **React 19**, and **Framer Motion**. Featuring a "Sentient" design philosophy, fluid physics-based navigation, and a custom glsl-inspired aesthetic.

## 🌟 Key Features

*   **Sentient Design**: A UI that reacts to your presence.
    *   **Quantum Dock**: Physics-based floating navigation with magnetic interactions.
    *   **Awareness Engine**: The interface tracks cursor movement and "wakes up".
    *   **System Ticker**: Real-time HUD displaying system stats.
*   **Immersive Navigation**:
    *   **Kinetic Glide**: Smooth, velocity-based scrolling with motion blur.
    *   **Command Palette**: Quick navigation and hidden "Alliance Protocol" (Cmd+K).
*   **Global Language System**:
    *   Instant client-side translation (EN, FR, ES, DE).
    *   No API latency or banners.
*   **Performance First**:
    *   Built on Next.js 16 App Router.
    *   Fully strict TypeScript.
    *   Optimized animations via Framer Motion.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
*   **Core**: React 19, TypeScript
*   **Styling**: Tailwind CSS 4, CSS Modules
*   **Animation**: Framer Motion, Lenis (Smooth Scroll)
*   **State**: React Context API (Language, Warp, Blueprint)
*   **Utils**: `cn` (clsx + tailwind-merge), Lucide React

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Arka-ui/portfolio.git
    cd portfolio
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Run the development server**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to view the site.

4.  **Build for production**:
    ```bash
    npm run build
    ```

## 📂 Project Structure

```
src/
├── app/              # Next.js App Router pages and layout
├── components/       # React components
│   ├── ui/           # Reusable UI atoms (QuantumDock, GlitchText)
├── context/          # Global state (Language, Warp, Blueprint)
├── data/             # Static data files
└── lib/              # Utility functions
```

## 🎨 Customization

*   **Translations**: Edit `src/context/LanguageContext.tsx` to modify the dictionary.
*   **Resume/Timeline**: Edit `src/components/Timeline.tsx` to update experience data.
*   **Projects**: `FeaturedProjects.tsx` fetches automatically from GitHub. Update `GITHUB_USERNAME` constant.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
