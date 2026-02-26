<div align="center">

# arka.is-a.dev

**Personal portfolio — statically exported, deployed on GitHub Pages.**

[![Live](https://img.shields.io/badge/live-arka.is--a.dev-6366f1?style=flat-square)](https://arka.is-a.dev/portfolio/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-white?style=flat-square)](LICENSE)

</div>

---

## Overview

A dark-themed, single-page portfolio built with **Next.js 16 App Router**, **React 19**, **Tailwind CSS 4**, and **Framer Motion**. The site is statically exported (`output: "export"`) and deployed to GitHub Pages via GitHub Actions.

## Features

| Area | Details |
|---|---|
| **Sections** | Hero · About · Featured Projects · Tech Stack · Tech Slider · Timeline · Live Status · Contact |
| **Command Palette** | `Ctrl + K` — navigate sections, copy email/link, open socials |
| **Live Status** | Real-time Discord presence via [Lanyard](https://github.com/Phineas/lanyard) — shows current activity, Spotify track, device |
| **Music Player** | Floating widget showing the currently playing Spotify track |
| **Projects** | Auto-fetched from GitHub API — stars, forks, language, topics |
| **Tech Stack** | Interactive grid with click-to-explain panels & GitHub language stats |
| **Tech Slider** | Infinite horizontal marquee of technologies with brand colors |
| **Contact** | Form that sends a rich Discord embed via webhook |
| **Smooth Scroll** | Lenis-powered kinetic scrolling with warp-to-section navigation |
| **Mobile HUD** | Bottom dock navigation optimized for touch |
| **i18n** | Client-side language switcher (EN, FR, ES, DE) |

## Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16 (App Router, static export) |
| **Language** | TypeScript 5 (strict) |
| **UI** | React 19, Tailwind CSS 4, Framer Motion |
| **Scroll** | Lenis |
| **Data** | SWR, Lanyard API, GitHub REST API |
| **Icons** | Lucide React |
| **Utilities** | clsx + tailwind-merge, cmdk |
| **Deploy** | GitHub Pages via GitHub Actions |

## Getting Started

```bash
# clone
git clone https://github.com/Arka-ui/portfolio.git
cd portfolio

# install
npm install

# create env file
cp .env.example .env.local
# then fill in NEXT_PUBLIC_DISCORD_WEBHOOK_URL

# dev
npm run dev          # → http://localhost:3001

# build
npm run build        # outputs to ./out
```

## Environment Variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_DISCORD_WEBHOOK_URL` | Discord webhook URL used by the contact form |

For GitHub Actions deployment, add this as a **repository secret** with the same name.

## Project Structure

```
src/
├── app/                  # Pages, layout, global styles
├── components/
│   ├── sections/         # Hero, About, FeaturedProjects, TechStack,
│   │                     # TechSlider, Timeline, Contact
│   ├── features/         # CommandPalette, LiveStatus, MusicPlayer,
│   │                     # LanguageSelector, ProjectCarousel
│   ├── layout/           # Navbar, Footer, MobileHUD, ScrollManager
│   └── ui/               # Preloader, QuantumDock, GlitchText,
│                         # ScrollProgress, MagneticButton, etc.
├── context/              # WarpContext, LanguageContext,
│                         # BlueprintContext, ChristmasContext
├── hooks/                # useLanyard, useHaptics
├── lib/                  # Utilities (cn, optimization, sys-core)
└── types/
```

## Deployment

The site is deployed automatically on every push to `main` via two GitHub Actions workflows:

- `.github/workflows/nextjs.yml` — Pages-native deploy
- `.github/workflows/deploy.yml` — Alternative deploy pipeline

Both pass the `NEXT_PUBLIC_DISCORD_WEBHOOK_URL` secret as an env variable during build.

## License

[MIT](LICENSE)
