# Contributing to Imperium Admin

Thanks for your interest in contributing.

## Overview

Built with **Next.js 16**, **TypeScript**, **Tailwind CSS v4**, and **shadcn/ui**. The goal is a modular, scalable codebase that is easy to extend.

## Project Layout

Colocation-based file system. Each feature keeps its own pages, components, and logic.

```
src
├── app               # Next.js routes (App Router)
│   ├── (auth)        # Auth layouts & screens
│   ├── (main)        # Main dashboard routes
│   │   └── (dashboard)
│   │       ├── crm
│   │       ├── finance
│   │       ├── default
│   │       └── ...
│   └── layout.tsx
├── components        # Shared UI components
├── hooks             # Reusable hooks
├── lib               # Config & utilities
├── styles            # Tailwind / theme setup
└── types             # TypeScript definitions
```

## Getting Started

1. Install dependencies
   ```bash
   npm install
   ```

2. Run the dev server
   ```bash
   npm run dev
   ```
   App will be available at [http://localhost:3000](http://localhost:3000).

## Contribution Flow

- Create a new branch before working on changes:
  ```bash
  git checkout -b feature/my-update
  ```

- Use clear commit messages with conventional prefixes (`feat:`, `fix:`, `chore:`):
  ```bash
  git commit -m "feat: add finance dashboard screen"
  ```

- Open a Pull Request once ready. Include a screenshot in the PR description if your change adds a new UI screen or component.

## Where to Contribute

- **External Pages**: `src/app/(external)/`
- **Auth Screens**: `src/app/(main)/auth/`
- **Dashboard Screens**: `src/app/(main)/dashboard/`
- **Components**: `src/components/`
- **Hooks**: `src/hooks/`
- **Themes**: `src/styles/presets/`

## Guidelines

- Prefer **TypeScript types** over `any`
- Husky pre-commit hooks run linting and formatting automatically; the commit is blocked on errors
- Follow shadcn/ui style & Tailwind v4 conventions
- Keep accessibility in mind (ARIA, keyboard nav)
- Avoid unnecessary dependencies — prefer existing utilities where possible

## Submitting PRs

- Ensure your branch is up to date with `main` before submitting
- Reference any related issue in your PR for context
