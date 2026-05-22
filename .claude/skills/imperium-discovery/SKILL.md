---
name: imperium-discovery
description: Conversational discovery flow for new Imperium Admin users. Invoked at start of /imperium-setup when no .imperium/spec.md exists. Asks structured questions, lets the user brain-dump, refines via follow-ups, and produces a clean spec.md that the scaffold skill consumes. Use when user says "set me up", "let's customize", "I just cloned this", or invokes /imperium-setup for the first time.
---

# Imperium Discovery Skill

Run a focused conversation to capture the user's dashboard vision and write it to `.imperium/spec.md`. The output of this skill is the input to `imperium-scaffold`.

## Goals

1. Understand the **business context** (what does this dashboard serve?)
2. Identify the **pages** the user wants (and which are critical vs nice-to-have)
3. For each page, capture the **key metrics / data** that matter
4. Note any **branding** tweaks needed (app name, primary color)
5. Flag **data source intent** (mock for now, Supabase later, external API)
6. Produce a clean, structured spec the user can review

## Tone

- Warm and direct, not chatty
- One main question per turn, but allow follow-ups
- Encourage brain dumps ("just describe everything, I'll organize it after")
- Refine, don't interrogate

## Step-by-step flow

### Step 1 — Opening

Greet briefly and ask the big question:

> Welcome to Imperium Admin. I'll help you customize this dashboard for your business.
>
> Quick big-picture first: what's this dashboard for? Give me a 1-2 sentence description of the business or workflow you're building this around.

Wait for response.

### Step 2 — Capture business identity

From their answer, note:
- Business name / brand
- Sector / use case (content, finance, HR, ops, etc.)
- Primary user(s) — themselves, their team, customers

Briefly reflect what you heard, then move on.

### Step 3 — Brain dump invitation

Ask the brain-dump question:

> Now the fun part: brain-dump everything you envision for this dashboard. What pages do you want? What metrics matter? When you log in every morning, what's the dream — what do you want to see?
>
> Don't worry about organization or polish. Just describe it all. I'll structure it after.

Let them talk freely. If they give a one-liner, encourage more detail: "tell me more about X" or "what else?"

### Step 4 — Probe gaps (max 5 refinement turns)

After the brain dump, identify gaps and ask focused follow-ups. Common gaps:

- **Per-page purpose**: "You mentioned a Content page. What's the main thing it should answer at a glance?"
- **Metrics**: "For the Financials page, what 3-4 numbers are the most important to see first?"
- **Data sources**: "Are these numbers you'd type in manually, or do they already live somewhere (a tool, a spreadsheet, an API)?"
- **Priority**: "Of the X pages you mentioned, which are must-haves for v1 versus nice-to-have later?"
- **Visual preferences**: "Any specific layout you have in mind for [page]? Cards-and-charts, table-heavy, master-detail?"

**HARD LIMIT: 5 refinement turns.** After that, write the spec with any remaining gaps marked `ASSUMED:` so the user can correct in review.

### Step 5 — Synthesize the spec

Write `.imperium/spec.md` in this exact structure:

```markdown
# Dashboard Spec

## Business Identity

- **Name**: {business name}
- **Sector / Use case**: {sector}
- **Primary user(s)**: {who uses this}
- **One-liner**: {1-sentence description}

## Pages

### 1. {Page Name}

- **Purpose**: {what this page answers at a glance}
- **Closest base**: {one of: default, crm, finance, analytics, productivity, ecommerce, academy, logistics, users, mail — pick from .claude/catalog/pages.md}
- **Primary metrics / data**:
  - {metric 1}
  - {metric 2}
  - ...
- **Key sections**:
  - {section 1, e.g., "Hero KPIs"}
  - {section 2, e.g., "Recent activity feed"}
  - ...
- **Data source intent**: {mock | supabase | external API: [name]}
- **Priority**: {must-have | nice-to-have}

### 2. {Page Name}
...

## Branding

- **App name**: {leave "Imperium Admin" or override}
- **Primary color**: {leave default Imperium green, or specify}
- **Other tweaks**: {optional}

## Open questions / assumptions

- ASSUMED: {anything you couldn't confirm — user reviews in step 6}

## Integration intent (v2)

- Supabase backend: {yes/no/maybe}
- External APIs to connect: {list, or "none yet"}
```

Match each user-described page to the **closest base** from `.claude/catalog/pages.md`. Be honest in the match — if the user wants "content tracker", base = `productivity`. If they want "client pipeline", base = `crm`.

### Step 6 — Present and refine

Show the spec back to the user:

> Here's what I've captured. Read through it — anything wrong, missing, or that needs to change?

Loop on edits. Common changes:
- Adding/removing pages
- Reordering priority
- Tweaking metrics
- Renaming things

Update the spec file in place each time.

### Step 7 — Approval

Once the user says "looks good" or equivalent, save the spec and hand off:

> Spec is locked at `.imperium/spec.md`. I'll now invoke the scaffold to build these pages. This will:
>
> 1. Check git is clean (or branch into `imperium/before-scaffold-{timestamp}`)
> 2. For each page, copy the closest example and adapt it
> 3. Update the sidebar navigation
> 4. Run `npm run check` to verify everything passes biome
>
> Ready to proceed?

Once user confirms, hand off to `imperium-scaffold` skill.

## What NOT to do

- Don't make the conversation feel like a survey — let the user breathe
- Don't push the user past 5 refinement turns. If it's still fuzzy, mark assumptions and let them correct in review.
- Don't generate code in this skill — your only output is `.imperium/spec.md`
- Don't propose pages the user didn't ask for. If they want 3 pages, give them 3 pages.
- Don't try to be exhaustive. The goal is "80% in one shot", not "100% perfect spec".
- Don't ask about Supabase or backend wiring in v1 detail — just capture intent ("yes / no / maybe") and move on.

## Edge cases

- **User gives a 1-sentence vision and nothing else**: Ask 2-3 follow-ups, then synthesize with explicit ASSUMED tags. Their review pass will fill gaps.
- **User wants 20+ pages**: Push back gently — "that's a lot for v1. Which 3-5 are the daily-driver pages? We can add the rest after you see v1 live."
- **User asks for something we don't have a base for** (e.g., "I want a 3D visualization"): Be honest. "We don't have that pattern yet. I can build a simpler version, or you can add a custom component later. Want me to scaffold a placeholder and you customize?"
- **User wants real-time data from Supabase right now**: Tell them v1 ships with mock data, and `/imperium-connect-supabase` is the v2 command for real data wiring. Capture the intent, scaffold with mock for now.
