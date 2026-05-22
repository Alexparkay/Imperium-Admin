# Style Guide

Visual and code rules. Generated code MUST comply or Biome will block the commit.

---

## File system conventions

### Colocation
- Each dashboard page lives at `src/app/(main)/dashboard/{name}/page.tsx`
- Page-specific components in `src/app/(main)/dashboard/{name}/_components/*`
- Mock data in `_components/data.ts`, `_components/data.tsx`, or `_components/data.json` next to the component using it
- Tables get their own subfolder: `_components/{table-name}-table/{columns.tsx,schema.ts,table.tsx,data.json}`

### Filename rules (enforced by Biome `useFilenamingConvention`)
- All files: **kebab-case** (`section-cards.tsx`, NOT `SectionCards.tsx`)
- One exception: Next.js conventions — `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`
- Component exports inside files: **PascalCase** (`export function SectionCards()`)

### Underscore-prefixed folders
- `_components/` — components scoped to a single page, excluded from Next.js routing
- Use this pattern for ALL page-local components, not a generic `components/` subfolder

---

## Import order (enforced by Biome `organizeImports`)

Imports must be grouped in this exact order, separated by blank lines:

```tsx
// 1. React + Next built-ins
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

// 2. Third-party packages (alphabetical)
import { TrendingUp } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

// 3. @/ aliases (project imports)
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// 4. Relative imports
import { MetricCards } from "./_components/metric-cards";
```

When in doubt, run `npm run check:fix` and Biome will reorder them.

---

## Component patterns

### Server vs client components
- **Default = server component** (no directive needed)
- Add `"use client"` ONLY when component needs: interactivity, browser APIs, useState/useEffect, event handlers, or zustand store access
- Charts (recharts) are client-only — wrap them in `"use client"` files
- Tables (TanStack) need `"use client"` for filtering/sorting interactivity

### Exports
- Named exports preferred: `export function Foo() {}` not `export default function Foo`
- One exception: page.tsx and layout.tsx need default export per Next.js convention

### Props
- Use TypeScript types inline for simple props
- Extract to `type Props = {...}` when 4+ props or used across components
- Avoid `interface` — prefer `type` for consistency with the codebase

---

## Tailwind / CSS conventions

### Color usage
- ALWAYS use theme CSS variables via Tailwind classes: `bg-primary`, `text-muted-foreground`, `border-border`
- NEVER hardcode hex (`bg-[#007A44]`) — breaks theme switching
- Status colors: use `text-emerald-600 dark:text-emerald-400` style for semantic colors (positive/negative/warning)
- Chart colors: use `var(--chart-1)` through `var(--chart-5)` in CSS, or `bg-chart-1` etc. in Tailwind

### Spacing scale
- Vertical rhythm inside cards: `space-y-4` or `gap-4`
- Between cards / sections: `gap-6`
- Tight inline items: `gap-2`
- Hero / page headers: `gap-8` between header and content

### Card hierarchy
- Use the `<Card>` primitive for every panel
- `<CardHeader>` for title + subtitle + actions
- `<CardContent>` for the main body
- `<CardFooter>` only when there's a clear footer action

### Typography scale
- Page headings (h1): `text-3xl tracking-tight` or `text-2xl font-medium`
- Section titles (CardTitle handles this): default styling
- Body: default (no class needed)
- Muted secondary text: `text-muted-foreground text-sm`
- Numeric values in KPIs: `text-2xl font-medium tabular-nums`
- Small labels / chips: `text-xs`

### Icon sizing
- Inline within text: `size-4`
- In buttons: `size-4` (matches text) or `size-5` for prominent icon buttons
- Standalone in cards (e.g., KPI card icon): `size-5` or `size-6`
- Logo / brand mark: `size-7` or `size-8`

### Tailwind class order (enforced by Biome `useSortedClasses`)
- Run `npm run check:fix` after writing JSX to canonicalize order
- Don't manually order — Biome does it

---

## TypeScript rules

### Avoid `any`
- `any` is banned by strict mode. If you need a permissive type, use `unknown` and narrow with type guards
- For untyped third-party data, define a `type` matching the shape

### Don't over-annotate
- Biome `noInferrableTypes` flags `const x: string = "foo"` — drop the annotation, let inference work
- DO annotate function parameters and return types when not obvious
- DO annotate exported constants for clarity

### Nullish handling
- `value ?? default` for nullish defaults — NOT `value || default`
- Use `?.` for safe access — NOT `&&` chains
- Use `satisfies` to validate object shapes without losing inference

---

## Data / mock conventions

### Where mock data lives
- Per-component: in `_components/data.ts` (or `data.tsx` if it includes JSX, or `data.json` for pure data)
- Shared across pages: in `src/data/*.ts`
- Type definitions colocated with data

### Naming
- Mock data arrays: plural noun matching domain (`customers`, `transactions`, `orders`)
- Mock objects (single record): singular noun (`currentUser`)
- Config / metadata objects: descriptive (`statusMeta`, `roleMeta`)

### Realistic but obviously fake
- Use realistic-sounding names (Olivia Rhye, not "User 1")
- Use realistic numbers ($1,234.56, not 9999)
- Use realistic dates (recent + past 90 days, not 2099)
- But make domain references obviously fake (e.g., `@imperium-growth.com` not real company domains)

---

## Common pitfalls (Biome will catch)

| Mistake | Fix |
|---|---|
| `<div></div>` | `<div />` |
| `<img src={...} />` | `<Image src={...} />` from `next/image` |
| `if (x) return a; else return b;` | `if (x) return a; return b;` |
| `value \|\| "default"` for nullish | `value ?? "default"` |
| `const name: string = "foo"` | `const name = "foo"` |
| `import { Foo } from "framer-motion"` if not in package.json | Don't import undeclared deps |
| Floating promise `void asyncFn()` not awaited | `await asyncFn()` or `void asyncFn()` explicitly |
| Tailwind classes out of order | Run `npm run check:fix` |

---

## When something feels wrong

If the design feels off:
1. Compare to the closest example dashboard side-by-side
2. Check that you're using `<Card>` not raw divs for panels
3. Check that all colors are theme tokens (not hex)
4. Check spacing matches the rhythm (gap-4 / gap-6)
5. Check that icons are lucide-react and sized consistently
6. Run `npm run dev` and look at it in the browser before declaring done

If Biome blocks the commit:
1. Run `npm run check:fix` to autofix the easy stuff
2. Read remaining errors — they're concrete and tell you exactly what to change
3. Fix each one. Don't `--no-verify`.

---

## The premium-feel checklist

Before declaring a new page done, verify:

- [ ] Page uses Card primitives for every panel (no naked divs as containers)
- [ ] Spacing is consistent (gap-4 inside cards, gap-6 between sections)
- [ ] Typography hierarchy is clear (heading > subheading > body > muted)
- [ ] All colors come from theme variables (no hardcoded hex)
- [ ] Icons are lucide-react, consistently sized
- [ ] Numbers use `tabular-nums` for alignment
- [ ] Status / category info uses Badge variants, not plain colored text
- [ ] Charts use ChartContainer wrapper, with proper chartConfig
- [ ] No "lorem ipsum" — every label is realistic and on-topic
- [ ] `npm run check` passes
- [ ] `npm run dev` renders without console errors

If anything on that list fails, you're producing AI-slop. Fix it before handing off.
