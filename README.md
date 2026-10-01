<div align="center">

# Tactile ⚡
### The Ultra-Low Latency Companion Display & Haptic Control Deck for macOS

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61dafb?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald?style=for-the-badge)](LICENSE)
[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/new)

**[Explore Live Demo & Showcase](https://tactile.lakshitsoni.in)** · **[Founder Manifesto](https://tactile.lakshitsoni.in/manifesto)** · **[Pricing](https://tactile.lakshitsoni.in/pricing)** · **[Roadmap](https://tactile.lakshitsoni.in/roadmap)**

---

</div>

## Overview

**Tactile** transforms your iPhone, iPad, or Android device into an ultra-low latency auxiliary touchscreen, dynamic context-aware Touch Bar, and 1000Hz ballistic glass trackpad for macOS.

By leveraging direct USB-C DMA streaming and local peer-to-peer Wi-Fi protocols, Tactile eliminates the lag, cloud dependencies, and subscription bloat of traditional second-screen tools.

```
┌─────────────────────────────────┐       Direct USB-C DMA       ┌────────────────────────┐
│           macOS Host            │ ───────────────────────────> │    Companion Device    │
│  • ScreenCaptureKit HEVC Engine │       (4.18ms Latency)       │  • 120 FPS Aux Screen  │
│  • Active App Context Monitor   │ <─────────────────────────── │  • Haptic Trackpad     │
│  • CGVirtualDisplay (Clamshell) │    Touch & Gesture Stream    │  • Dynamic Touch Bar   │
└─────────────────────────────────┘                              └────────────────────────┘
```

---

## ✨ Key Superpowers

- ⚡ **Direct DMA Display Engine**: Sub-5ms glass-to-glass latency with Apple Silicon hardware HEVC encoding (`VTCompressionSession`) and GPU SurfaceTexture decoding.
- 🎛️ **Contextual Dynamic Touch Bar**: Automatically morphs macro decks based on frontmost app focus (VS Code, Figma, Terminal, Safari, Xcode).
- 🖱️ **Ballistic Glass Trackpad**: Sub-pixel pointer tracking with continuous momentum inertia, multi-touch gestures, and synthesized Apple Taptic click feedback.
- 📋 **Universal Clipboard & File Drop**: Real-time bidirectional clipboard sync with SHA-256 echo-loop prevention.
- 🎒 **Headless Clamshell Mode**: Run your Mac with the laptop lid closed at full 2940×1912 resolution via `CGVirtualDisplay` and CVDisplayLink keepalive.
- 🎙️ **Hardware Master Killswitches**: CoreAudio HAL microphone mute, instant display dimming, and quick system controls.
- 🔒 **100% Local & Air-Gapped**: Zero cloud servers, zero telemetry tracking, and zero account requirements. Operates entirely over local USB socket pairing.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack, Server Actions) |
| **Frontend** | [React 19](https://react.dev/), [TypeScript 5](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/), Custom Royal Obsidian Glassmorphism System |
| **Motion & Audio** | [Framer Motion](https://www.framer.com/motion/), [Lenis](https://lenis.darkroom.engineering/) Smooth Scroll, Web Audio API Procedural Synthesizer |
| **Icons & Brand** | [Lucide React](https://lucide.dev/), Bespoke Tactile Vector Brandmark |
| **Communications** | [Resend](https://resend.com/) & [React Email](https://react.email/) Transactional Engine |
| **Deployment** | [Vercel](https://vercel.com/) (Edge Middleware, Dynamic OG Image Generation) |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v20.x or higher
- **npm**: v10.x or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/lakshitsoni/tactile-web.git
   cd tactile-web
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

   Update the configuration parameters:
   ```env
   # Resend API Key for transactional waitlist emails (optional)
   RESEND_API_KEY=re_your_api_key_here

   # Sender email address verified on Resend
   RESEND_FROM_EMAIL=Tactile <onboarding@resend.dev>

   # Production canonical URL
   NEXT_PUBLIC_APP_URL=https://tactile.lakshitsoni.in
   ```

4. **Run the local development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🏗️ Production Build & Verification

To verify full production compilation and TypeScript checks:

```bash
# Build optimized production bundle
npm run build

# Start local production server
npm run start
```

---

## 📂 Project Architecture

```
tactile-web/
├── public/                 # Static branding assets and svgs
├── src/
│   ├── app/
│   │   ├── api/            # Serverless API routes (waitlist, feedback, health)
│   │   ├── changelog/      # Product release notes & version history
│   │   ├── compare/        # Deep comparison matrix (Tactile vs Sidecar vs Duet)
│   │   ├── manifesto/      # Founder technical story & architectural rationale
│   │   ├── pricing/        # Pricing tiers & license options
│   │   ├── privacy/        # Privacy policy & local-first data guarantee
│   │   ├── roadmap/        # Quarterly feature roadmap & engineering deliverables
│   │   ├── story/          # Interactive hardware journey
│   │   ├── terms/          # Terms of service
│   │   ├── globals.css     # Design tokens, typography, glassmorphism utilities
│   │   ├── layout.tsx      # Root layout, fonts (Geist, Inter), metadata, JSON-LD
│   │   ├── page.tsx        # Main landing page & dual-device showcase stage
│   │   ├── opengraph-image.tsx # Dynamic Edge OpenGraph card generator
│   │   ├── robots.ts       # Dynamic robots.txt
│   │   └── sitemap.ts      # Dynamic XML sitemap generator
│   ├── components/         # Interactive React components
│   │   ├── DualDeviceDemo.tsx         # Centerpiece dual-device interactive orchestrator
│   │   ├── MacDesktopSandbox.tsx      # In-browser macOS Sequoia window manager & desktop
│   │   ├── PhoneScreenContent.tsx     # Companion phone multi-mode controller (Touch Bar/Trackpad)
│   │   ├── VSCodeInteractiveEditor.tsx # High-fidelity interactive VS Code replica
│   │   ├── FigmaInteractiveCanvas.tsx # Interactive Figma artboard with two-way sync
│   │   ├── TerminalInteractiveShell.tsx # Interactive zsh terminal with live streaming logs
│   │   ├── KnurledRotaryDial.tsx      # 3D mechanical rotary dial with audio detents
│   │   ├── Navbar.tsx                 # Liquid glass floating pill navigation
│   │   ├── HeroSection.tsx            # World-class hero with fluid typography & CTAs
│   │   ├── WaitlistModal.tsx          # VIP Founding Creator pass generator
│   │   └── CommandMenu.tsx            # Global ⌘K keyboard command palette
│   ├── hooks/              # Custom React hooks (smooth scroll locks, keyboard shortcuts)
│   └── lib/                # State machines, macro profiles, audio synthesizer, resend SDK
├── .env.example            # Production environment template
├── next.config.ts          # Security headers (CSP, HSTS), Next.js 16 config
└── package.json            # Project dependencies and build scripts
```

---

## 🌐 Deploy to Vercel

Tactile is pre-configured for seamless deployment to Vercel.

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com/new).
3. Set your production environment variables (`NEXT_PUBLIC_APP_URL`, `RESEND_API_KEY`).
4. Add your custom subdomain `tactile.lakshitsoni.in` under **Project Settings → Domains**.
5. Add a `CNAME` record in your DNS provider pointing `tactile` to `cname.vercel-dns.com`.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Crafted with precision by **[Lakshit Soni](https://lakshitsoni.in)**

</div>
