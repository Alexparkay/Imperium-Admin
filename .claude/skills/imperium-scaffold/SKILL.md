---
name: imperium-scaffold
description: Read .imperium/spec.md and scaffold the user's pages by copying from src/app/(main)/dashboard/(examples)/ and adapting. Updates sidebar navigation. Used after imperium-discovery has produced an approved spec, OR directly when user runs /imperium-add-page to add a single new page later. Always consults imperium-quality before writing code.
---

# Imperium Scaffold Skill

Read `.imperium/spec.md` (or the single-page args), then build the user's dashboard by copying patterns from `(examples)/`.

## Pre-flight (do these FIRST, every time)

1. **Read** `.imperium/spec.md` — abort if it doesn't exist (tell user to run `/imperium-setup` first)
2. **Read** `.claude/catalog/pages.md` — your map from user concepts to existing examples
3. **Read** `.claude/skills/imperium-quality/SKILL.md` — internalize the pre-write checklist
4. **Run** `git status` — if there are uncommitted changes:
   - Offer to create a safety branch: `git checkout -b imperium/before-scaffold-{timestamp}`
   - Or ask user to commit/stash first
   - Don't proceed on a dirty tree without acknowledgment
5. **Read** the user's `package.json` to confirm what dependencies are available

## Mode A: full scaffold (from `/imperium-setup`)

Build every page listed in `.imperium/spec.md`. For each page:

### Per-page workflow

1. **Match base**: read spec entry → identify `closest base` (already specified in spec) → confirm by checking `.claude/catalog/pages.md`

2. **Copy the base**:
   ```bash
   cp -r src/app/(main)/dashboard/(examples)/{base}/ src/app/(main)/dashboard/{new-name}/
   ```
   Use `cp -r` because we're treating examples as a read-only library — never `git mv` them out.

3. **Rename component exports** (if the example component names are too generic):
   - File contents: PascalCase identifiers
   - Filenames stay kebab-case
   - Update internal imports to match

4. **Swap mock data** to match the user's domain:
   - Find `_components/data.{ts,tsx,json}`
   - Replace records / numbers / labels with domain-appropriate fake data
   - Keep realistic structure (real-sounding names, realistic numbers, recent dates)
   - DON'T just rename "customers" to "podcasts" — actually craft data that makes sense for the page

5. **Adapt sections**:
   - Read the page's component list from the spec
   - Remove sections the user didn't ask for
   - Rename section titles to match the user's vocabulary (e.g., "Recent Customers" → "Recent Episodes" for a podcast dashboard)
   - DON'T add sections the user didn't ask for

6. **Add nav entry**: edit `src/navigation/sidebar/sidebar-items.ts`. Add the page under an appropriate group (create a new group if their pages don't fit existing ones).

7. **Quality check**: mentally run `imperium-quality` pre-write checklist on every file you wrote

### After all pages

1. **Run** `npm run check` — autofix what you can, then read remaining errors
2. **Fix** any biome errors. Common ones after scaffolding:
   - Unused imports (remove)
   - Filename casing (kebab-case)
   - Tailwind class order (`npm run check:fix`)
3. **Re-run** `npm run check` until 0 errors
4. **Verify** the user's example route group is intact at `src/app/(main)/dashboard/(examples)/`
5. **Report** to user:
   ```
   Scaffolded {N} pages from your spec:
   - /dashboard/{page-1}  ← copied from {base}
   - /dashboard/{page-2}  ← copied from {base}
   ...

   Sidebar updated. Biome check passed.

   Run `npm run dev` to see your dashboard.

   Mock data is in place. When ready for real data, ask me to connect Supabase
   (manual setup for now — automated in v2).
   ```

## Mode B: single page (from `/imperium-add-page`)

User invoked with a specific request. Workflow:

1. Ask 2-3 quick questions if not clear:
   - What's the page for?
   - What 3-5 metrics / sections should it have?
   - Closest existing dashboard you've seen that's similar? (or let Claude pick from catalog)

2. Update `.imperium/spec.md` to ADD this page to the existing list (don't overwrite — append)

3. Run the per-page workflow from Mode A

4. Run `npm run check`, report.

## Critical rules

- **NEVER delete files in `(examples)/`** — they're the reference library
- **NEVER generate components from scratch** when an example has a similar one
- **NEVER hardcode hex colors** — always theme tokens
- **NEVER skip the biome check** — broken commits punish the user
- **NEVER add features the spec didn't ask for** — stay disciplined to scope
- **DO copy generously** from examples — that's the point of having them
- **DO match the user's vocabulary** when renaming labels

## When things go wrong

### Biome errors after scaffolding
1. Read each error carefully
2. Most are autofixable: `npm run check:fix`
3. Remaining: fix manually using the failure-mode table in `imperium-quality/SKILL.md`

### User's spec page concept doesn't fit any example well
Pick the *closest* base and explain the trade-off: "I'll start from the {X} example because it has the closest structure. We may need to add a custom section for {Y} that doesn't exist in any example."

### Sidebar nav gets messy
The sidebar uses route groups. Add user pages to a single group called the user's business name (from spec). Keep the "Coming Soon" group as-is. The `(examples)` reappear only when `NEXT_PUBLIC_SHOW_EXAMPLES=true`.

### User has uncommitted work and refuses to branch
Offer to stash, commit, OR proceed with a clear warning that they have no rollback path. Don't proceed silently.

## Output

Every scaffold run ends with:
1. A summary of pages created
2. `npm run check` output showing 0 errors
3. A suggestion to run `npm run dev`
4. Updated `.imperium/spec.md` reflecting current state

That's it. No surprises. No extra refactors. No "improvements" the user didn't ask for.
