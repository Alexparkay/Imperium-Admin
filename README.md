# Imperium Admin

A clone-and-customize Next.js admin dashboard template. Tell Claude Code what dashboard you want, and it scaffolds the pages for you — preserving the premium UI quality of the underlying shadcn/ui component library.

## Quick Start

```bash
git clone https://github.com/Alexparkay/Imperium-Admin.git my-dashboard
cd my-dashboard
npm install
```

Then open [Claude Code](https://claude.com/claude-code) in this folder and type:

```
/imperium-setup
```

Or just say: **"set me up"**.

Claude will run a quick discovery conversation, write a spec to `.imperium/spec.md`, and scaffold your custom pages by copying from the example library.

Full guide: [docs/customization.md](docs/customization.md)

## Features

- Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui
- 10 production-ready example dashboards in a reference library (default, CRM, finance, analytics, productivity, e-commerce, academy, logistics, users, mail)
- 5 theme presets including the dark-green Imperium palette
- Authentication flows (4 screens), responsive layouts, sidebar controls
- Strict Biome + TypeScript pipeline — generated code stays clean
- Husky pre-commit auto-formats and validates every change
- Claude-Code-native automation: skills, slash commands, project catalog

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI**: shadcn/ui + Radix primitives
- **Validation**: Zod
- **Forms & State**: React Hook Form, Zustand
- **Tables**: TanStack Table
- **Charts**: Recharts (wrapped via shadcn chart primitive)
- **Tooling**: Biome, Husky

## Architecture

Colocation-based file system. Each feature keeps its own pages, components, and logic inside its route folder.

- `src/app/(main)/dashboard/(examples)/` — reference library of example dashboards (hidden from nav, accessible via direct URL)
- `src/app/(main)/dashboard/{your-pages}/` — your scaffolded pages (populated by `/imperium-setup`)
- `src/components/ui/` — shadcn primitives
- `src/components/custom/` — user-authored components (yours to own)
- `src/styles/presets/` — theme presets (one CSS file per preset)
- `.claude/` — Claude Code skills, commands, and catalog
- `.imperium/` — your dashboard spec (source of truth, committed to git)

## Run locally

```bash
npm install
npm run dev
```

Dev server runs at [http://localhost:3000](http://localhost:3000).

To see the example dashboards in the sidebar during development, add to `.env.local`:

```
NEXT_PUBLIC_SHOW_EXAMPLES=true
```

## Formatting and linting

```bash
npm run check       # validate (read-only)
npm run check:fix   # autofix what can be autofixed
```

Pre-commit hooks run Biome automatically — bad commits get blocked before they ship.

## Customization workflow

| Step | Command | What it does |
|---|---|---|
| First-time setup | `/imperium-setup` | Discovery conversation → spec → scaffold |
| Add a page later | `/imperium-add-page` | Single-page scaffold using existing spec |
| Iterate | (just talk to Claude) | Tweak copy, swap charts, refactor sections |

See [docs/customization.md](docs/customization.md) for the full workflow.

---

Built by Alex Kaymakanov / Imperium Growth.
