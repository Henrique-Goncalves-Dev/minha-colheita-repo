# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server (Vite, hot reload)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint
npm run preview   # Serve production build locally
```

No test framework is configured.

## Auto-sync to remote `back` branch

A Claude Code Stop hook (`.claude/settings.json`) automatically stages all local changes, commits them, and pushes to `origin/back` at the end of every response turn that leaves uncommitted changes. The remote is `https://github.com/Henrique-Goncalves-Dev/minha-colheita-repo`.

The hook does nothing when the working tree is already clean.

## Architecture

**Minha Colheita** is a React 19 + TypeScript SPA built with Vite. It targets farmers (low digital literacy), so the UI emphasizes large touch targets, audio cues (`AudioButton`), and minimal text.

### Routing (`src/App.tsx`)

Three routes via React Router v7:

| Path | Screen | Purpose |
|---|---|---|
| `/` | `IdentificationScreen` | Name + phone input |
| `/pin` | `PinScreen` | 4-digit PIN entry |
| `/dashboard` | `HomeScreen` | Main action grid |

Navigation is always forward (`/` → `/pin` → `/dashboard`); the back button on `PinScreen` uses `navigate(-1)`.

### Component roles

- **`AudioButton`** — plays audio instructions; two variants: `pill` (with waveform label) and `circle` (icon only). Appears on every screen.
- **`ActionCard`** — a square tappable card used in the dashboard grid; accepts `title`, `icon` (ReactNode), and optional `bgColor` (Tailwind class).
- **`CustomInput`** — labeled text/tel input with a leading icon; used only on `IdentificationScreen`.
- **`PinPad`** — numeric keypad (0–9 + delete + confirm) rendered as a 3-column grid; state lives in `PinScreen`.

### Styling

Tailwind CSS (utility-first via `index.css` and inline classes). The brand green palette uses literal hex values (`#345348`, `#4A6F62`, `#658B7D`, etc.) directly in JSX — no design token abstraction yet. Background color across all screens is `#EEF2F0`.
