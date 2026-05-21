# Imperium Admin

A modern Next.js admin dashboard built with TypeScript, Tailwind CSS v4, and shadcn/ui. Multiple dashboards, authentication layouts, customizable theme presets, and flexible layout controls.

## Features

- Next.js 16, TypeScript, Tailwind CSS v4, and shadcn/ui
- Responsive and mobile-friendly
- Customizable theme presets (light/dark with color schemes like Tangerine, Brutalist, and more)
- Flexible layouts (collapsible sidebar, variable content widths)
- Authentication flows and screens
- Prebuilt dashboards (Default, CRM, Finance, Analytics, Productivity, E-commerce, Academy) plus legacy variants
- Role-Based Access Control (RBAC) with config-driven UI and multi-tenant support *(planned)*

> The default dashboard uses the **shadcn neutral** theme. Additional presets included: Tangerine, Neo Brutalism, Soft Pop. You can create more by following the same structure.

## Tech Stack

- **Framework**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4
- **UI**: shadcn/ui
- **Validation**: Zod
- **Forms & State**: React Hook Form, Zustand
- **Tables**: TanStack Table
- **Tooling**: Biome, Husky

## Screens

### Available
- Default Dashboard
- CRM Dashboard
- Finance Dashboard
- Analytics Dashboard
- Productivity Dashboard
- E-commerce Dashboard
- Academy Dashboard
- Email Page
- Authentication (4 screens)
- Legacy: Default v1, CRM v1, Finance v1, Analytics v1

### Coming Soon
- Logistics Dashboard
- Chat Page
- Calendar Page
- Kanban Board
- Invoice Page
- Users Management
- Roles Management

## Architecture

Colocation-based file system. Each feature keeps its own pages, components, and logic inside its route folder. Shared UI, hooks, and configuration live at the top level.

## Getting Started

### Run locally

1. Install dependencies
   ```bash
   npm install
   ```

2. Start the dev server
   ```bash
   npm run dev
   ```

App will be running at [http://localhost:3000](http://localhost:3000).

### Formatting and Linting

```bash
npx @biomejs/biome check --write
```

See the [Biome documentation](https://biomejs.dev/) for rules, fixes, and CLI options.

---

Built by Alex Kaymakanov / Imperium Growth.
