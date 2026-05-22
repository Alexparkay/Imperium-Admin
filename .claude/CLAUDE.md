# Imperium Admin — Project Context

This is a Next.js 16 + shadcn/ui admin dashboard repo designed to be cloned and customized by business owners (or their teams) via conversation with Claude Code.

## What this repo is

A clone-and-customize template. Users:
1. Clone the repo
2. Run `npm install`
3. Open Claude Code in the project directory
4. Type `/imperium-setup` OR say something like "set me up", "let's customize", "I just cloned this"
5. Brain-dump their dashboard vision
6. Approve the spec → Claude scaffolds pages by copying from the example library

The goal is **80% of their custom dashboard in one shot**, with premium UI quality preserved.

## Where things live

- **Example dashboards (10 of them)**: `src/app/(main)/dashboard/(examples)/` — hidden from nav by default, accessible via direct URL. These are the **scaffold base**.
- **User spec (source of truth)**: `.imperium/spec.md` — committed to git, defines what the user's dashboard should look like
- **Catalog (Claude's reference library)**: `.claude/catalog/` — pages, components, charts, style-guide
- **Skills (Claude's behavior)**: `.claude/skills/imperium-*/` — setup, discovery, scaffold, quality
- **Slash commands**: `.claude/commands/imperium-*.md`
- **Branding**: `src/config/app-config.ts` (app name + meta), `public/imperium-logo-*.png` (logos), `src/styles/presets/imperium.css` (Imperium theme preset)
- **Sidebar nav**: `src/navigation/sidebar/sidebar-items.ts` — Imperium-setup populates this with the user's scaffolded pages

## Critical rules

1. **ALWAYS read `.imperium/spec.md` if it exists before scaffolding anything.** It's the source of truth for what the user wants.
2. **ALWAYS check `.claude/catalog/pages.md` before generating new pages.** Map the user's need to an existing example, then copy + adapt.
3. **NEVER generate components from scratch when an example exists in `(examples)/`.** Copy from there. The examples are biome-clean and on-brand.
4. **NEVER hardcode hex colors** — use theme CSS variables (`bg-primary`, `text-muted-foreground`, etc.)
5. **NEVER import from packages not in `package.json`.** Check before importing. No hallucinated dependencies.
6. **Biome WILL run on every commit.** Code MUST pass `npm run check` before you declare a task done.
7. **Use `next/image`, not `<img>`.** Use `lucide-react` icons, no inline SVGs. Use shadcn primitives from `@/components/ui/*`.
8. Files must be **kebab-case** (`section-cards.tsx`). Component exports are **PascalCase**.
9. **Colocation**: page-specific components go in `_components/` next to the page. Mock data colocated with consumers.

See [`.claude/catalog/style-guide.md`](catalog/style-guide.md) for the full rule set.

## Trigger phrase routing

If the user says any of these (or close variants), invoke the `imperium-setup` skill immediately:
- "set me up"
- "let's customize"
- "I just cloned this"
- "get started"
- "start setup"
- "customize this dashboard"
- "imperium setup"

If the user says "add a page" / "create a new page" / "I want a page for X", invoke the `imperium-scaffold` skill in single-page mode.

If the user is in mid-conversation and asks design/architecture questions about THIS template (not about their custom dashboard), answer directly using the catalog files as reference.

## Skill loading order

When invoked, the typical chain is:
1. `imperium-setup` (orchestrator) detects spec exists or not
2. If no spec → invokes `imperium-discovery` (conversation → writes `.imperium/spec.md`)
3. Once spec is approved → invokes `imperium-scaffold` (reads spec, copies patterns from `(examples)/`)
4. `imperium-quality` is always consulted by scaffold before writing any code (biome guardrails)

## Quick reminders

- `npm run check` — biome lint+format check (must pass)
- `npm run check:fix` — autofix what can be autofixed
- `npm run dev` — start dev server
- `npm run generate:presets` — regenerate theme dropdown after adding/editing a CSS preset
- `NEXT_PUBLIC_SHOW_EXAMPLES=true` — env flag to surface example dashboards in the sidebar during development

## What's out of scope for v1

These are deferred to v2 — DO NOT attempt them unless the user explicitly asks and acknowledges they're not yet automated:
- Supabase integration
- Pruning example dashboards (destructive)
- Pulling upstream template updates
- Multi-tenant scaffolding (RBAC)

If the user asks for these, explain they're on the roadmap and offer to set them up manually with guidance.
