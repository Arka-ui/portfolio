<div align="center">

# ✦ Arka — Portfolio

### A dark, editorial single-page portfolio — crafted with obsessive attention to detail.

<br/>

[![Live Site](https://img.shields.io/badge/%E2%9C%A6%20Live-arka.riftmc.net-DBC7A6?style=for-the-badge&labelColor=13110E)](https://arka.riftmc.net)
[![GitHub Repo](https://img.shields.io/badge/GitHub-Arka--ui%2Fportfolio-B39F85?style=for-the-badge&logo=github&logoColor=DBC7A6&labelColor=13110E)](https://github.com/Arka-ui/portfolio)

<br/>

[![Next.js 16](https://img.shields.io/badge/Next.js-16-DBC7A6?style=flat-square&logo=next.js&logoColor=13110E&labelColor=251E18)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-B39F85?style=flat-square&logo=react&logoColor=13110E&labelColor=251E18)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-B39F85?style=flat-square&logo=typescript&logoColor=13110E&labelColor=251E18)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-B39F85?style=flat-square&logo=tailwindcss&logoColor=13110E&labelColor=251E18)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer%20Motion-12-B39F85?style=flat-square&logo=framer&logoColor=13110E&labelColor=251E18)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-Custom-7D6B56?style=flat-square&labelColor=251E18)](LICENSE)

<br/>

<a href="https://arka.riftmc.net">
  <img src="https://img.shields.io/badge/%E2%86%92%20Visit%20the%20Portfolio-DBC7A6?style=for-the-badge&labelColor=DBC7A6" alt="Visit Portfolio" />
</a>

<br/><br/>

<sub>Warm earthy palette · Editorial typography · Kinetic smooth scroll · Real-time Discord status · 4 languages</sub>

</div>

<br/>

---

<br/>

## Overview

A **dark-themed, single-page portfolio** engineered with **Next.js 16 App Router**, **React 19**, **Tailwind CSS 4**, and **Framer Motion 12**. The site is statically exported and deployed to **GitHub Pages** via GitHub Actions — then served on the custom domain [arka.riftmc.net](https://arka.riftmc.net). Zero server costs, blazing-fast load times.

> *"Building digital products people remember."*

<br/>

## Highlights

<table>
<tr>
<td width="50%">

### Core sections
- **Hero** — editorial clamp-sized typography with staggered reveal
- **About** — bio, beliefs, workflow, animated count-up stats
- **Projects** — auto-fetched from GitHub API; **ANS** pinned at #1 with a dedicated badge
- **Tech stack** — interactive grid with "why I use it" explanations per tech
- **Timeline** — developer journey milestones, ANS at the top
- **Live** — real-time Discord presence via Lanyard
- **Contact** — serverless, API-backed form

</td>
<td width="50%">

### Interactive features
- **Command palette** — `⌘K` / `Ctrl+K` to navigate, copy links, change language, open socials
- **Warp scroll** — unified Lenis-powered smooth scroll engine (`warpTo()`)
- **i18n** — live language switcher (EN · FR · ES · DE), 4 locale files
- **Blueprint Mode** — alternate blueprint-style theme unlocked by the Konami code
- **Christmas Theme** — seasonal overlay that opts in automatically in December
- **Scroll scrubber** — top progress bar is clickable; drag/click to jump anywhere

</td>
</tr>
<tr>
<td width="50%">

### Design & motion
- Framer Motion throughout with spring physics & stagger
- Ambient mesh gradient via CSS `@property` animation
- `prefers-reduced-motion` respected site-wide via `MotionConfig`
- Fluid clamp-based typography up to 112px
- Custom `grain` texture overlay for film-like depth

</td>
<td width="50%">

### Mobile-first
- Responsive layout across every breakpoint
- **Mobile HUD** — bottom dock with section progress indicator
- Long-press on active tab reveals quick actions (Top / Copy / Share)
- Snap carousel for featured projects
- Haptic feedback on nav interactions

</td>
</tr>
</table>

<br/>

## Tech Stack

```
Framework    →  Next.js 16 (App Router, static export)
Language     →  TypeScript 5 (strict mode)
Styling      →  Tailwind CSS 4 + clsx + tailwind-merge
UI           →  React 19, Framer Motion 12
Scrolling    →  Lenis (kinetic smooth scroll)
Data         →  SWR, Lanyard API, GitHub REST API
Commands     →  cmdk (⌘K palette)
Icons        →  Lucide React
Fonts        →  Syne · Sora · Space Mono · Green Energy (display)
Deploy       →  GitHub Pages via GitHub Actions → arka.riftmc.net
```

<br/>

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `⌘K` / `Ctrl+K` | Open command palette |
| `↑ ↑ ↓ ↓ ← → ← → B A` | Toggle Blueprint Mode |
| `Esc` | Close any overlay |
| `Tab` | Focus-visible rings appear on every interactive element |

<br/>

## Project Structure

```
src/
├── app/                      # App Router: layout, pages, global CSS
├── components/
│   ├── sections/             # Hero, About, FeaturedProjects,
│   │                         # TechStack, TechSlider, Timeline, Contact
│   ├── features/             # CommandPalette, LiveStatus,
│   │                         # LanguageSelector, ProjectCarousel
│   ├── layout/               # Navbar, Footer, MobileHUD, ScrollManager
│   └── ui/                   # ScrollProgress, MagneticButton, Preloader…
├── context/                  # Warp, Language, Blueprint, Christmas
├── hooks/                    # useLanyard, useHaptics
├── i18n/
│   ├── engine.ts             # t() / tp() / transNodes APIs
│   └── locales/              # en.json · fr.json · es.json · de.json
├── lib/                      # utilities (cn, optimization helpers)
└── types/                    # shared type definitions
```

<br/>

## Getting Started

### Prerequisites

- **Node.js** ≥ 18
- **npm** (or **pnpm** / **bun**)

### Installation

```bash
git clone https://github.com/Arka-ui/portfolio.git
cd portfolio
npm install

# Set up environment variables
cp .env.example .env.local
# → fill in NEXT_PUBLIC_API_URL
```

### Development

```bash
npm run dev          # → http://localhost:3000
```

### Production Build

```bash
npm run build        # → static export to ./out
npm run start        # → serve the production build
npm run lint         # → ESLint
```

<br/>

## Environment Variables

| Variable | Required | Purpose |
|---|:---:|---|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend endpoint for the contact form & telemetry |

> For CI/CD, add this as a **repository secret** in GitHub → *Settings → Secrets and variables → Actions*.

<br/>

## Deployment

The site deploys automatically on every push to `main`:

| Workflow | Role |
|---|---|
| [`.github/workflows/nextjs.yml`](.github/workflows/nextjs.yml) | GitHub Pages–native deploy |
| [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) | Alternative deploy pipeline |

Both inject the `NEXT_PUBLIC_API_URL` secret at build time. The final artifact is served from the custom domain **[arka.riftmc.net](https://arka.riftmc.net)** (CNAME configured in `public/CNAME`).

<br/>

## Contributing

Issues and suggestions are welcome — but note the license below: this is a personal portfolio, not a starter template.

1. Fork the repository
2. Create your branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

<br/>

## License

This project is **not open-source**. See the [LICENSE](LICENSE) for full details.

> **TL;DR** — You can read the code, learn from it, and build your own portfolio from scratch. You **cannot** clone or fork this repo and pass it off as yours with minor edits. Small snippets (~30 lines) are fine to reuse with attribution.

<br/>

---

<div align="center">

**[✦ Visit the live portfolio →](https://arka.riftmc.net)**

Crafted by [Arka](https://github.com/Arka-ui) — a self-taught full-stack developer from France.

<br/>

<a href="https://github.com/Arka-ui" title="GitHub">
  <img src="https://img.shields.io/badge/GitHub-Arka--ui-DBC7A6?style=flat-square&logo=github&logoColor=13110E&labelColor=251E18" alt="GitHub" />
</a>
<a href="https://discord.com/users/871084043838566400" title="Discord">
  <img src="https://img.shields.io/badge/Discord-arka-B39F85?style=flat-square&logo=discord&logoColor=13110E&labelColor=251E18" alt="Discord" />
</a>
<a href="https://github.com/Arka-ui/ArkaNewsSystem" title="Arka News System">
  <img src="https://img.shields.io/badge/ANS-Arka%20News%20System-7D6B56?style=flat-square&logo=github&logoColor=DBC7A6&labelColor=251E18" alt="ANS" />
</a>

</div>
