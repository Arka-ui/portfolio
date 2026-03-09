<div align="center">

# ✦ Arka — Portfolio

### Personal portfolio — crafted with obsessive attention to detail.

<br/>

[![Live Site](https://img.shields.io/badge/%E2%9C%A6%20Live-Portfolio-6366f1?style=for-the-badge&labelColor=0d1117)](https://arka-ui.github.io/portfolio/)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-181717?style=for-the-badge&logo=github&logoColor=white&labelColor=0d1117)](https://github.com/Arka-ui/portfolio)

<br/>

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-d946ef?style=flat-square&logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-Custom-white?style=flat-square)](LICENSE)

<br/>

<a href="https://arka-ui.github.io/portfolio/">
  <img src="https://img.shields.io/badge/→%20Visit%20the%20Portfolio-6366f1?style=for-the-badge&labelColor=6366f1" alt="Visit Portfolio" />
</a>

<br/><br/>

<sub>Dark-themed · Editorial design · Smooth animations · Real-time Discord status · 4 languages</sub>

</div>

<br/>

---

<br/>

## 🚀 Overview

A **dark-themed, single-page portfolio** engineered with **Next.js 16 App Router**, **React 19**, **Tailwind CSS 4**, and **Framer Motion 12**. The site is statically exported and deployed to **GitHub Pages** via GitHub Actions — zero server costs, blazing-fast load times.

> *"Building digital products people remember."*

<br/>

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎯 Core Sections
- **Hero** — Editorial massive typography with staggered reveal
- **About** — Bio, skill tags, animated count-up stats, beliefs & process
- **Projects** — Auto-fetched from GitHub API with stars, forks & topics
- **Tech Stack** — Interactive grid with "Why I use it" explanations
- **Timeline** — Developer journey milestones
- **Contact** — Serverless API-powered form

</td>
<td width="50%">

### ⚡ Interactive Features
- **Command Palette** — `Ctrl + K` to navigate, copy email, open socials
- **Live Status** — Real-time Discord presence via [Lanyard](https://github.com/Phineas/lanyard)
- **Music Player** — Floating Spotify now-playing widget with progress bar
- **Blueprint Mode** — Alternate cyan/dark visualization theme
- **Warp Navigation** — Custom smooth scroll-to-section system
- **i18n** — Language switcher (EN, FR, ES, DE)

</td>
</tr>
<tr>
<td width="50%">

### 🎨 Design & Motion
- Framer Motion throughout with spring physics & stagger
- Ambient gradient orbs & blurred light effects
- Magnetic buttons & hover glow interactions
- Fluid clamp-based typography (up to 148px headings)
- Lenis-powered kinetic smooth scrolling

</td>
<td width="50%">

### 📱 Mobile-First
- Responsive layout across all breakpoints
- **Mobile HUD** — Bottom dock navigation for touch
- Touch-optimized carousel for projects
- Compressed Spotify widget for small screens

</td>
</tr>
</table>

<br/>

## 🛠 Tech Stack

```
Framework    →  Next.js 16 (App Router, static export)
Language     →  TypeScript 5 (strict mode)
Styling      →  Tailwind CSS 4 + clsx + tailwind-merge
UI           →  React 19, Framer Motion 12
Scrolling    →  Lenis (kinetic smooth scroll)
Data         →  SWR, Lanyard API, GitHub REST API
Commands     →  cmdk (⌘K palette)
Icons        →  Lucide React
Fonts        →  Outfit · Plus Jakarta Sans · JetBrains Mono
Deploy       →  GitHub Pages via GitHub Actions
```

<br/>

## 📂 Project Structure

```
src/
├── app/                     # Pages, layout, global CSS
│   ├── layout.tsx           # Root layout with providers & global features
│   ├── page.tsx             # Main single-page composition
│   └── not-found.tsx        # Custom 404
├── components/
│   ├── sections/            # Hero, About, FeaturedProjects, TechStack,
│   │                        # TechSlider, Timeline, Contact
│   ├── features/            # CommandPalette, LiveStatus, MusicPlayer,
│   │                        # LanguageSelector, ProjectCarousel
│   ├── layout/              # Navbar, Footer, MobileHUD, ScrollManager
│   └── ui/                  # Preloader, QuantumDock, GlitchText,
│                            # ScrollProgress, MagneticButton, SystemTicker…
├── context/                 # WarpContext, LanguageContext,
│                            # BlueprintContext, ChristmasContext
├── hooks/                   # useLanyard, useHaptics
├── lib/                     # Utilities (cn, optimization, sys-core)
└── types/                   # TypeScript type definitions
```

<br/>

## ⚙️ Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** or **pnpm**

### Installation

```bash
# Clone the repository
git clone https://github.com/Arka-ui/portfolio.git
cd portfolio

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# → Fill in NEXT_PUBLIC_API_URL
```

### Development

```bash
npm run dev          # → http://localhost:3001
```

### Production Build

```bash
npm run build        # Outputs static site to ./out
```

<br/>

## 🔐 Environment Variables

| Variable | Required | Purpose |
|---|:---:|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API endpoint for the contact form |

> For CI/CD, add this as a **repository secret** in your GitHub repo settings.

<br/>

## 🚢 Deployment

The site deploys automatically on every push to `main` via GitHub Actions:

| Workflow | Type |
|---|---|
| `.github/workflows/nextjs.yml` | Pages-native deploy |
| `.github/workflows/deploy.yml` | Alternative deploy pipeline |

Both inject the `NEXT_PUBLIC_API_URL` secret during build.

<br/>

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

<br/>

## 📄 License

This project is **NOT open-source**. See the [LICENSE](LICENSE) for full details.

> **TL;DR** — You can look at the code, learn from it, and build your own portfolio from scratch. You **cannot** copy/fork this repo and pass it off as yours with minor edits. Small code snippets (~30 lines) are fine to reuse.

<br/>

---

<div align="center">

**[✦ Visit the live portfolio →](https://arka-ui.github.io/portfolio/)**

Made with 💜 by [Arka](https://github.com/Arka-ui)

<br/>

<a href="https://github.com/Arka-ui" title="GitHub">
  <img src="https://img.shields.io/badge/GitHub-Arka--ui-181717?style=flat-square&logo=github" alt="GitHub" />
</a>
<a href="https://discord.com/users/871084043838566400" title="Discord">
  <img src="https://img.shields.io/badge/Discord-arka-5865F2?style=flat-square&logo=discord&logoColor=white" alt="Discord" />
</a>

</div>
