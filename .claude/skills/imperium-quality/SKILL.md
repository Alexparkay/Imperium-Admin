---
name: imperium-quality
description: Pre-write and post-write quality guardrails for Imperium Admin scaffolding. Use BEFORE generating any new TSX/TS file in this project, and AFTER any batch of edits before declaring work done. Enforces Biome lint/format compliance, prevents AI-slop patterns, and ensures premium UI quality matching the existing examples.
---

# Imperium Quality Skill

Use this skill BEFORE writing any new code in this project, and AFTER finishing a batch of edits. It enforces the rules that keep generated code biome-clean, theme-correct, and visually premium.

## When this skill applies

- Writing a new `page.tsx` or `_components/*.tsx` file
- Adding a chart, table, KPI card, or any new component
- Modifying multiple files at once
- Just before declaring "scaffold done"

## Pre-write checklist (run mentally before Write/Edit)

Before writing ANY new file, confirm all of these:

### File system
- [ ] Filename is **kebab-case** (`top-products.tsx`, NOT `TopProducts.tsx`)
- [ ] Component export inside is **PascalCase** (`export function TopProducts()`)
- [ ] File lives in correct location:
  - Page → `src/app/(main)/dashboard/{name}/page.tsx`
  - Page-local component → `src/app/(main)/dashboard/{name}/_components/{kebab}.tsx`
  - Mock data → next to consumer in `_components/data.ts` or `data.json`

### Imports
- [ ] Every imported package is in `package.json` (no hallucinated deps)
- [ ] Import order:
  1. `react` types / hooks
  2. `next/*`
  3. Third-party packages (alphabetical)
  4. `@/` aliases
  5. Relative (`./`, `../`)
  Each group separated by blank line.
- [ ] No barrel-file imports that could cycle (`@/components/index`)

### JSX / TSX
- [ ] Empty elements self-closing: `<div />` not `<div></div>`
- [ ] Images use `<Image />` from `next/image`, not `<img>`
- [ ] Icons from `lucide-react` only (no inline SVG)
- [ ] No `</>` orphan fragments — use `<></>` only when needed

### TypeScript
- [ ] No `any` (use `unknown` + narrowing if you really must)
- [ ] No `: string` annotation when value is a string literal — let inference work
- [ ] Use `type` not `interface` for object shapes (consistency with codebase)
- [ ] Use `satisfies` to validate without losing inference

### Logic
- [ ] `value ?? default` for nullish defaults (NEVER `||` for that purpose)
- [ ] No useless `else` after a `return`
- [ ] Every Promise is awaited, voided (`void asyncFn()`), or `.catch()`ed
- [ ] No unused variables / imports (Biome will flag)

### Styling
- [ ] Colors come from theme tokens: `bg-primary`, `text-muted-foreground`, `border-border` — NEVER hex
- [ ] Chart colors via `var(--chart-1)` through `var(--chart-5)`
- [ ] Tailwind classes in canonical order — if unsure, just write them and run `npm run check:fix`
- [ ] Numbers use `tabular-nums` font feature
- [ ] Icons sized consistently: `size-4` inline, `size-5` for prominent

### Component patterns
- [ ] Server component by default, `"use client"` ONLY if needed (interactivity, hooks, browser APIs, recharts, TanStack table)
- [ ] Panels use `<Card>` primitive, not raw `<div>`
- [ ] Charts wrapped in `<ChartContainer>` from `@/components/ui/chart`
- [ ] Tables follow the colocated `{name}-table/{columns,schema,table,data}` pattern

## Post-write checklist (after each batch of edits)

After finishing a logical chunk of work:

1. **Run** `npm run check`
2. If errors: read each one carefully — they describe exactly what to fix
3. Most format errors are autofixed by `npm run check:fix` — run that first
4. For lint errors: fix manually, don't `--no-verify`
5. Re-run `npm run check` until clean (0 errors)
6. Only THEN report task complete

## The mental model: copy, don't generate

The fastest path to biome-clean, on-brand code is to **copy an existing example file** and adapt it. Every file in `src/app/(main)/dashboard/(examples)/` already passes biome and uses the right patterns. When you need a new chart, table, KPI card, etc., open the closest example (see `.claude/catalog/components.md` and `.claude/catalog/pages.md`), copy it, and modify.

If you find yourself writing a component from scratch, **stop**. Check the catalog. There's almost certainly an example to copy.

## When something's genuinely new

If the user asks for a pattern that doesn't exist in `(examples)/`:
1. Build from shadcn primitives at `@/components/ui/*`
2. Match the visual rhythm of nearby examples (spacing, typography, hierarchy)
3. Follow `.claude/catalog/style-guide.md` strictly
4. Put truly custom components in `src/components/custom/` (gitkept directory) so they're easy to find later

## Common biome failure modes (learn these)

These are the patterns AI generation tends to violate. Internalize them:

| Mistake | Biome rule | Fix |
|---|---|---|
| `import { motion } from "framer-motion"` (not in deps) | `noUndeclaredDependencies` | Use existing deps or ask user to install |
| `MyComponent.tsx` filename | `useFilenamingConvention` | Rename to `my-component.tsx` |
| `<div></div>` empty | `useSelfClosingElements` | `<div />` |
| `if (x) return a; else return b;` | `noUselessElse` | drop the `else` |
| `value || "default"` for nullish | `useNullishCoalescing` | `value ?? "default"` |
| `void asyncFn()` un-awaited | `noFloatingPromises` | `await asyncFn()` or explicit `void` |
| `<img src={url} />` | `noImgElement` | `<Image src={url} />` from `next/image` |
| `const x: string = "foo"` | `noInferrableTypes` | `const x = "foo"` |
| Tailwind classes out of order | `useSortedClasses` | `npm run check:fix` |
| Mixed/wrong import order | `organizeImports` | `npm run check:fix` |

When in doubt: run `npm run check:fix` first, then read whatever's left.

## The premium-feel test

After scaffolding, open `npm run dev` and ask: does this look like an example I'd be proud to show on YouTube, or does it look "AI-generated"?

Tells of AI-slop:
- Inconsistent spacing
- Generic gray placeholder text
- Charts without axis labels or tooltips
- Numbers without `tabular-nums`
- Hex colors that don't theme-switch
- Missing icons on KPI cards
- No empty states

Fix anything that fails this test before declaring done.
