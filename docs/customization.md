# Customizing Imperium Admin

Imperium Admin is a clone-and-customize template. After cloning, you tell Claude Code (in this folder) what dashboard you want, and it scaffolds the pages for you.

This guide walks through the full workflow.

---

## Prerequisites

- Node.js 22.13+ (24 LTS recommended)
- npm
- [Claude Code](https://claude.com/claude-code) installed
- A terminal opened in the project folder

---

## The 60-second flow

```bash
git clone https://github.com/Alexparkay/Imperium-Admin.git my-dashboard
cd my-dashboard
npm install
```

Then open Claude Code in this folder and type:

```
/imperium-setup
```

Or just say:

> "set me up"

Claude will walk you through a discovery conversation, write a spec to `.imperium/spec.md`, and scaffold your pages.

---

## What "discovery" looks like

Claude asks 3-5 questions, then invites you to brain-dump:

1. What's this dashboard for? (1-2 sentences about your business)
2. What pages do you want?
3. What metrics matter on each page?
4. When you log in every morning, what's the dream — what do you want to see?

You can be loose. Just describe everything. Claude organizes it after.

You'll get back a structured `.imperium/spec.md` to review. You can edit it, refine via more conversation, or approve as-is.

---

## What happens during scaffolding

Once you approve the spec, Claude:

1. Runs `git status` — if there are uncommitted changes, offers to make a safety branch
2. For each page in the spec:
   - Finds the closest matching example in `src/app/(main)/dashboard/(examples)/`
   - Copies it to `src/app/(main)/dashboard/{your-page-name}/`
   - Renames component exports, swaps mock data to match your domain
   - Removes sections you didn't ask for
3. Updates `src/navigation/sidebar/sidebar-items.ts` with your new pages
4. Runs `npm run check` to make sure everything passes biome
5. Reports done and suggests `npm run dev`

---

## Going live — your own GitHub + Vercel

Once you're happy with your local dashboard, deploy it. **Don't just `git push` — your repo still points to the upstream template.**

Run:

```
/imperium-deploy
```

Or say: "deploy", "ship it", "push to github", "go live".

Claude walks you through:

1. **Pre-flight checks** — runs `npm run check` and `npm run build` first. If either fails, you fix before proceeding.
2. **History strategy** — pick one:
   - **Clean slate (recommended)** — wipes `.git`, reinitializes fresh, one initial commit. True white-label, no connection to Alexparkay/Imperium-Admin in your repo's history.
   - **Preserve history** — keeps all commits, just repoints origin to your repo. Useful if you want to pull future Imperium-Admin template updates as a secondary remote.
3. **GitHub setup** — if you have `gh` CLI installed, Claude creates your repo with one command. Otherwise it walks you through the github.com/new web flow.
4. **Vercel deployment** — if you have `vercel` CLI installed, runs `vercel link` + `vercel deploy --prod`. Otherwise walks you through vercel.com/new web import.
5. **Confirmation** — you get the live `.vercel.app` URL. Future `git push` to your repo auto-deploys.

### What you'll need

- A GitHub account (free plan is fine)
- A Vercel account (free plan covers personal projects)
- Optional but recommended: GitHub CLI (`winget install --id GitHub.cli` on Windows, `brew install gh` on Mac) and Vercel CLI (`npm i -g vercel`)

### The hard rule

**Until you run `/imperium-deploy`, your local repo still has `origin` pointing at `Alexparkay/Imperium-Admin`. Any `git push` you try will fail (no write access).** Run the deploy command before customizing too much locally if you want changes auto-committed to your own repo from the start.

---

## Iterating after the first build

### Add a new page later

```
/imperium-add-page
```

Or say something like: "add a page for tracking my podcast guests".

Claude will ask 2-3 clarifying questions, then scaffold the page using the same pattern matching.

### Change something on an existing page

Just describe it in plain language:

> "On the Content page, swap the area chart for a bar chart showing weekly publishing volume"

Claude reads the current page, makes the change, and runs biome.

### Add a custom component

Put truly custom components in `src/components/custom/`. Claude treats that folder as user-owned — it won't auto-modify files there.

---

## Theme and branding

The Imperium theme preset is active by default with the green color palette (`#11462C` family). To customize:

- **App name**: edit `src/config/app-config.ts`
- **Logo**: replace files in `public/` (`transparent-imperium-logo.png`, `imperium-logo-inverted.png`, etc.) and the `<Image>` references in `src/app/(main)/dashboard/_components/sidebar/app-sidebar.tsx` if needed
- **Theme color**: edit `src/styles/presets/imperium.css`, then run `npm run generate:presets` to refresh the preset dropdown dot
- **Add a new theme preset**: drop a `{name}.css` file in `src/styles/presets/` following the same structure, then run `npm run generate:presets`

---

## Seeing the example dashboards

By default, the 10 example dashboards are hidden from the sidebar but still exist at `src/app/(main)/dashboard/(examples)/`. They're Claude's reference library — used to scaffold new pages, not to clutter your nav.

To see them in the sidebar during development, set in `.env.local`:

```
NEXT_PUBLIC_SHOW_EXAMPLES=true
```

Then restart `npm run dev`. The examples reappear as "Examples — Dashboards", "Examples — Pages", and "Examples — Legacy" groups in the sidebar.

You can still navigate to any example directly via URL (e.g., `localhost:3000/dashboard/finance`) without setting the env flag.

---

## Common issues

### Biome blocks a commit

The pre-commit hook runs Biome on every commit. If it fails:

```bash
npm run check:fix    # autofixes most issues
npm run check        # shows what's left
```

Fix any remaining errors (Biome's messages are concrete). Don't bypass with `--no-verify` unless you really know what you're doing — the hook protects you from shipping broken code.

### "I don't see my changes after switching themes"

CSS files added at dev-time aren't always picked up by hot-reload. Stop and restart `npm run dev`. Hard-refresh the browser (`Ctrl+Shift+R`).

### "The Imperium green looks black"

The `#11462C` is a true brand hex but renders as near-black on small UI accents because it's mathematically dark. The theme uses a brighter "UI-friendly" variant (`oklch(0.50 0.13 157)`) for the actual primary color. If you need the deeper green for marketing materials or hero panels, use it directly there; the dashboard accent variant lives in `src/styles/presets/imperium.css`.

### Claude scaffolded something that doesn't match what I asked

Tell Claude. The `.imperium/spec.md` is the source of truth — describe what's wrong, and Claude will update both the spec and the code. If a page is salvageable, prefer editing; if it's wildly wrong, ask Claude to delete the page and rebuild from the corrected spec.

---

## What's NOT in v1 (coming in v2)

These are on the roadmap but not yet automated:

- `/imperium-connect-supabase` — wire your dashboard to a Supabase backend for real data
- `/imperium-prune` — destructive cleanup of the `(examples)/` folder for users who want a truly clean slate
- `/imperium-sync-upstream` — automated upstream sync (manual flow documented in `/imperium-deploy` output for users who pick history-preserve mode)
- `/imperium-status` — diagnostic dump of what's been scaffolded vs example vs custom
- MCP server integrations (Linear, Notion, Supabase) preconfigured

If you need any of these now, ask Claude — it can walk you through the manual setup. It just won't be one-click yet.

---

## Customizing the customization

If you want to change how Claude approaches scaffolding, edit:

- **`.claude/CLAUDE.md`** — project-wide context Claude reads at session start
- **`.claude/catalog/*.md`** — Claude's reference library (pages, components, charts, style-guide)
- **`.claude/skills/imperium-*/SKILL.md`** — the behavior definitions for each step of the workflow

These are committed to git so your team inherits the same setup. Edit carefully — the skills cross-reference each other.

---

## When to ask Claude vs edit by hand

**Ask Claude when:**
- Adding a new page or major section
- Connecting data sources
- Restructuring sidebar nav
- Anything that touches multiple files

**Edit by hand when:**
- Tweaking copy / labels in one file
- Adjusting a single Tailwind class
- Quick visual fixes you can see immediately

Both are fine. The skills are guardrails, not gates.

---

## Quick reference

| Command | Does |
|---|---|
| `/imperium-setup` | First-run customization or returning-user options |
| `/imperium-add-page` | Add a single new page |
| `/imperium-deploy` | Disconnect from upstream, push to your GitHub, deploy to Vercel |
| `npm run dev` | Start dev server |
| `npm run check` | Run Biome lint+format check |
| `npm run check:fix` | Autofix Biome issues |
| `npm run generate:presets` | Regenerate theme dropdown after adding a CSS preset |
| `npm run build` | Production build (run before deploying) |

---

## Help

If you get stuck:
1. Check `.claude/catalog/` for reference docs Claude uses
2. Check `.claude/skills/` for the behavior definitions
3. Open an issue on the [Imperium-Admin GitHub repo](https://github.com/Alexparkay/Imperium-Admin)
