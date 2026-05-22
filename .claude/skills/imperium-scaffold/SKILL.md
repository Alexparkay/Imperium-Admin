---
name: imperium-scaffold
description: Read .imperium/spec.md and scaffold the user's pages by copying from src/app/(main)/dashboard/(examples)/ and adapting. Updates sidebar navigation. Applies layout preferences (auth screens, header search, theme modes). Used after imperium-discovery has produced an approved spec, OR directly when user runs /imperium-add-page. Always consults imperium-quality and component-selector before writing code.
---

# Imperium Scaffold Skill

Read `.imperium/spec.md` (or single-page args), then build the user's dashboard by copying patterns from `(examples)/` — **never substituting generic primitives for the polished patterns that exist**.

## Pre-flight (every time)

1. **Read** `.imperium/spec.md` — abort if missing (tell user to run `/imperium-setup` first)
2. **Read** `.claude/catalog/pages.md` — example library map
3. **Read** `.claude/catalog/component-selector.md` — intent-to-component decision tree
4. **Read** `.claude/skills/imperium-quality/SKILL.md` — biome guardrails
5. **Run** `git status` — if dirty:
   - Offer safety branch: `git checkout -b imperium/before-scaffold-{timestamp}`
   - Or ask user to commit/stash
   - Don't proceed silently on dirty tree
6. **Read** `package.json` — confirm available dependencies

## Mode A: full scaffold (from `/imperium-setup`)

Build every page listed in the spec. For each page:

### Per-page workflow

#### 1. Match base
- Read spec entry → identify the declared `closest base`
- Confirm by cross-referencing `.claude/catalog/pages.md`
- If the spec didn't declare one, pick the best match from the catalog and tell the user before proceeding

#### 2. Copy the base (don't move it)
```bash
cp -r src/app/(main)/dashboard/(examples)/{base}/ src/app/(main)/dashboard/{new-name}/
```
Examples remain in `(examples)/` as the read-only reference library. Never `mv`.

#### 3. Rename component exports
- Filenames stay kebab-case
- Internal `export function {Name}()` → match the user's domain
- Update intra-file imports to match

#### 4. Apply component-preference callouts from the spec
The spec's per-page section lists "Component preferences" (set during discovery). Apply these literally. Examples:
- "Progress visualization uses dot-bar pattern, NOT shadcn Progress" → use the `proposalGoalBars` pattern from `task-reminders.tsx`
- "KPI tiles use MetricCards pattern (4 tiles, not strip)" → keep MetricCards layout
- "Pipeline stages use filled colored pills" → use the opportunity-stage column pattern, not plain badges

When in doubt about a section's component choice, **re-read `component-selector.md`** before writing code. The intent → component mapping there is the source of truth.

#### 5. Swap mock data to match domain
- Find `_components/data.{ts,tsx,json}`
- Replace records / numbers / labels with domain-appropriate fake data
- Keep realistic structure (real-sounding names, realistic numbers, recent dates)
- Don't just rename "customers" to "podcasts" — actually craft data that makes sense (episode titles, guest names, publish dates, durations)
- Keep status meta tables (like `statusMeta` in `users/_components/data.tsx`) — they're battle-tested visual patterns

#### 6. Adapt sections (remove what wasn't asked for)
- Read the spec's `Key sections` for this page
- Remove any section the user didn't list
- Rename section titles to match user vocabulary ("Recent Customers" → "Recent Episodes")
- DON'T add sections the user didn't ask for, even if the base had them and they "look nice"

#### 7. Add nav entry
Edit `src/navigation/sidebar/sidebar-items.ts`:
- Add the new page under a single group named after the user's business or use case
- If multiple pages, group them logically
- Set the right icon from `lucide-react` (match the page's purpose)
- Do NOT re-add example pages or the Coming Soon group unless the user asked

#### 8. Quality self-check
Run the `imperium-quality` skill's pre-write checklist mentally on every file you wrote/edited.

### After all pages are scaffolded

#### 9. Apply layout preferences from spec
Open `.imperium/spec.md` → "Layout preferences" section. Apply each:

- **Auth screens** = `none` → delete `src/app/(main)/auth/v1/` AND `src/app/(main)/auth/v2/` (entire trees). Remove the auth route group if empty.
- **Auth screens** = `v1` → delete `src/app/(main)/auth/v2/`
- **Auth screens** = `v2` → delete `src/app/(main)/auth/v1/`
- **Greeting block** = `none` → if any scaffolded page has a "Good morning, X" hero (from productivity base), strip it
- **Header search (cmd+J)** = `remove` → remove `<SearchDialog />` from `src/app/(main)/dashboard/layout.tsx` and delete `src/app/(main)/dashboard/_components/sidebar/search-dialog.tsx`
- **Theme modes** = `just X` → in `src/lib/preferences/theme.ts` (manual edit) restrict THEME_MODE_OPTIONS, or in `layout-controls.tsx` hide the toggles for unwanted modes
- **Coming-soon group** = `no` → already removed in default; confirm sidebar-items.ts doesn't reintroduce it
- **Mail/inbox page** = `no` → delete `src/app/(main)/mail/` entire tree
- **Account switcher** = `no` → remove `<AccountSwitcher>` from `src/app/(main)/dashboard/layout.tsx` header

#### 10. Polish pass (mandatory)
Before declaring done, run the **premium-feel checklist** from `.claude/catalog/style-guide.md`:

- [ ] Every panel wraps in `<Card>`, not raw `<div>`
- [ ] Spacing: `gap-4` inside cards, `gap-6` between sections
- [ ] Typography hierarchy clear (heading > subhead > body > muted)
- [ ] All colors from theme tokens — search for hex (`#`) in scaffolded files; replace any found
- [ ] Icons from `lucide-react`, sized consistently (`size-4` / `size-5`)
- [ ] Numbers use `tabular-nums`
- [ ] Status info uses Badge variants with proper meta (dots + tinted backgrounds), NOT plain colored text
- [ ] Charts wrapped in `<ChartContainer>` with proper `chartConfig`
- [ ] No "lorem ipsum" — every label is realistic and on-topic for the user's business
- [ ] No shadcn `<Progress>` for goal visualization (use dot-bar pattern)
- [ ] No generic `<Badge>` for pipeline stages (use filled colored pills)
- [ ] No raw `<MetricCard>` style implementations — use the established MetricCards or KpiStrip pattern

If anything fails, fix it before moving on.

#### 11. Biome validation
1. Run `npm run check`
2. Autofix what's autofixable: `npm run check:fix`
3. For remaining errors: fix manually using the failure-mode table in `imperium-quality/SKILL.md`
4. Re-run until 0 errors

#### 12. Report
```
Scaffolded {N} pages from your spec:
- /dashboard/{page-1}  ← copied from {base}
- /dashboard/{page-2}  ← copied from {base}

Layout preferences applied:
- Auth screens: {result}
- Header search: {kept/removed}
- Theme modes: {final state}
- Removed: {list anything deleted per preferences}

Sidebar updated. Biome check: 0 errors.

Run `npm run dev` to see your dashboard.

Mock data is in place. When ready for real data, that's the v2 work — Supabase
wiring is on the roadmap (not yet automated).
```

---

## Mode B: single page (from `/imperium-add-page`)

User invoked with a specific request. Workflow:

1. Read existing `.imperium/spec.md` for context (sector, branding, layout prefs)
2. Ask 2-3 quick clarifying questions if unclear:
   - What's the page for?
   - What 3-5 metrics / sections?
   - Any specific component preferences? (offer to consult `component-selector.md` if helpful)
3. Append the new page to `.imperium/spec.md` (don't overwrite)
4. Run per-page workflow from Mode A (steps 1-8)
5. Run polish pass + biome (steps 10-11)
6. Report

---

## The "copy more, change less" rule

This is the single most important rule. AI generation defaults to "rewriting things to fit" — that produces AI-slop. Instead:

- **Component structure**: copy verbatim from the example. Don't restructure.
- **Tailwind classes**: copy verbatim. Don't "optimize."
- **Visual patterns**: copy verbatim. Don't substitute primitives.
- **Helper functions**: copy verbatim. Don't inline.

**You should change:**
- Component identifier names (PascalCase exports)
- Data content (records, numbers, labels)
- Section titles and descriptive text
- The set of sections present (remove what's not asked for)

**You should NOT change:**
- The choice of which UI primitive renders each thing (e.g., don't swap dot-bar for Progress)
- The color choice (everything is theme tokens already)
- The spacing scale (gap-4, gap-6)
- The typography (already correct in the examples)
- The animation/transition behavior (if any)

When in doubt: **the example is right. Copy it. Move on.**

---

## Critical rules summary

- **NEVER delete files in `(examples)/`** — they're the reference library
- **NEVER generate components from scratch** when an example exists
- **NEVER hardcode hex colors** — theme tokens only
- **NEVER skip the polish pass** — it's the difference between premium and AI-slop
- **NEVER skip biome check** — broken commits punish the user
- **NEVER add features the spec didn't ask for** — discipline matters
- **DO copy generously** — copying IS the design pattern
- **DO consult `component-selector.md`** before choosing any component
- **DO apply spec layout preferences** literally (delete what the user said to remove)

---

## When things go wrong

### Biome errors after scaffolding
1. Read each error carefully — they tell you exactly what to fix
2. Run `npm run check:fix` for autofixable
3. Manually fix the rest using `imperium-quality/SKILL.md` failure-mode table

### A page concept doesn't fit any example
- Pick the closest base from `pages.md`
- Tell the user: "I'll start from {X} because it has the closest structure. We may need to add a custom section for {Y} that doesn't exist in any example. Want me to scaffold a placeholder section, or skip {Y} for now?"

### Sidebar nav gets messy
- One group per logical area
- Use the user's business name as group label if appropriate
- Don't reintroduce removed example groups
- Coming Soon group stays out unless explicitly requested

### User wants Supabase wired immediately
- Capture intent in spec
- Tell them: "Supabase wiring is v2 work. For now I'm scaffolding with mock data shaped like real data. When you're ready, the env file at `.env.local` is where credentials go. I can walk you through the manual setup if you'd like, or wait for v2."

### Scaffolded code doesn't look premium
- Run polish pass again, item-by-item
- Compare your scaffolded page side-by-side with its example base — what's different visually?
- If you changed something that wasn't in the spec, revert it
- Re-read `component-selector.md` and check if you substituted a generic primitive
