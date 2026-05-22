---
name: imperium-discovery
description: Conversational discovery flow for new Imperium Admin users. Invoked at start of /imperium-setup when no .imperium/spec.md exists. Profiles the user's business sector, asks proactive preference questions to prune irrelevant options, lets the user brain-dump, refines via follow-ups, and produces a clean spec.md that the scaffold skill consumes. Use when user says "set me up", "let's customize", "I just cloned this", or invokes /imperium-setup for the first time.
---

# Imperium Discovery Skill

Run a focused conversation to capture the user's dashboard vision and write it to `.imperium/spec.md`. The output of this skill is the input to `imperium-scaffold`.

The goal is a conversation that feels **intelligent and tailored**, not a generic survey. Profile the user, prune what's irrelevant, propose what's likely-right, and let them correct anything wrong.

## Tone

- Warm and direct, never chatty
- One main question per turn, with permission to brain-dump
- Make assumptions based on sector — let the user correct, don't make them volunteer
- Refine, don't interrogate. Max 6 turns total before writing the spec.

---

## Step 1 — Open with the big question

> Welcome to Imperium Admin. I'll help you customize this dashboard for your business.
>
> Quick question first: what's this dashboard for? Give me a 1-2 sentence description of the business or workflow you're building this around.

Wait for response.

---

## Step 2 — Identify sector + apply sector defaults

From the user's answer, classify the business into one of these sectors. **Each sector has implicit defaults that prune irrelevant options**:

| Sector | Likely pages | Definitely NOT | Auth pattern |
|---|---|---|---|
| **Agency / consultancy** | Client pipeline, projects, time-tracking, deliverables, invoices | E-com, store traffic, product inventory | v2 (split-screen, premium feel for B2B) |
| **Content creator / media** | Content calendar, episodes/videos, audience analytics, sponsors | E-com (unless they sell), inventory, logistics | v1 (minimal, personal) |
| **SaaS / product** | Users/accounts, MRR/revenue, churn, feature usage, support | Logistics, content calendar | v2 (multi-user feel) |
| **HR / people ops** | Employees, hiring pipeline, performance, attendance | E-com, finance KPIs (unless requested), logistics | v2 (corporate feel) |
| **Finance / CFO** | Revenue, expenses, cashflow, forecasts, accounts | Content tools, HR (unless requested) | v2 |
| **E-commerce / retail** | Orders, products, inventory, store traffic, customers | HR (unless requested), academy | v2 |
| **Operations / logistics** | Shipments, routes, fleet, warehouse | Content tools, e-com (unless retail) | v2 |
| **Education / coaching** | Students/clients, classes, assignments, progress | E-com (unless they sell courses), logistics | v1 or v2 (their pick) |
| **Personal productivity** | Tasks, projects, calendar, focus, notes | Anything multi-user | None or v1 |

**Reflect what you heard, name the sector, state your defaults briefly**:

> Got it — that's [sector]. Based on that, I'm assuming:
> - You'll want [likely pages]
> - You probably don't need [definitely-not pages]
> - For sign-in, I'd recommend [v1/v2/none]
>
> Anything wrong with those assumptions before we go deeper?

Wait. Apply corrections.

---

## Step 3 — Brain-dump invitation

Once sector + defaults are confirmed:

> Now brain-dump. What pages do you want? What metrics matter? When you log in every morning, what's the dream — what do you want to see?
>
> Don't worry about structure — describe everything. I'll organize it after.

Let them talk freely. If they give a one-liner, encourage more: "tell me more about X" or "what else?"

---

## Step 4 — Probe gaps with targeted follow-ups (max 3 turns)

After the brain dump, identify gaps and ask focused follow-ups. Pick the 2-3 most useful from this list (don't ask all):

**Per-page purpose**:
> "You mentioned [page]. What's the one thing it should answer at a glance? (E.g., 'how many deals are open' or 'who needs my reply')"

**Key metrics**:
> "For [page], what 3-4 numbers matter most? These become the hero KPIs."

**Data sources** (just intent, not setup):
> "Are these numbers you'd type manually, or do they live somewhere already (a tool, spreadsheet, API)? Just intent — Supabase wiring is v2."

**Priority**:
> "Of the [N] pages, which 2-3 are must-haves for v1?"

**Visual preferences**:
> "Any layout in mind for [complex page]? Cards-and-charts, table-heavy, master-detail (left list + right detail)?"

**HARD LIMIT**: Stop probing at turn 3 of this step. Remaining gaps go into the spec as `ASSUMED:` — user fixes in review.

---

## Step 5 — Binary preference probing (the "what to remove" questions)

Before writing the spec, ask a quick rapid-fire round of binary questions to **cut fluff and confirm defaults**. Format them as a list — user answers in one message.

Adapt this list to their sector. Skip anything obviously irrelevant.

> Quick rapid-fire (one-word answers fine):
>
> 1. Auth screens — do you want them at all? If yes, **v1** (minimal centered, see [/auth/v1/login](https://github.com/Alexparkay/Imperium-Admin/blob/main/src/app/(main)/auth/v1/login/page.tsx)) or **v2** (split-screen with brand panel, see [/auth/v2/login](https://github.com/Alexparkay/Imperium-Admin/blob/main/src/app/(main)/auth/v2/login/page.tsx))?
> 2. Sidebar greeting block at the top of one page? (e.g., "Good morning, [name].") — **yes / no**, and if yes which page
> 3. Header search bar with cmd+J? — **keep / remove**
> 4. Light + dark + system toggle — **all three / just one (which)**
> 5. Should the sidebar show a "Coming soon" group for future pages? — usually **no** unless you want it
> 6. Want an email/inbox page? — **yes / no** (most users say no)
> 7. Multi-account switcher in the header? — **yes / no** (yes only if multiple teams)

Add 1-3 sector-specific questions:

**For agency/consultancy**:
> 8. Time tracking page — included or skip?
> 9. Invoice / billing page — included or skip?

**For content creator**:
> 8. Content calendar view — table-based, or kanban-style (note: kanban is coming v2)?
> 9. Audience analytics — heavy on charts, or table-first?

**For SaaS**:
> 8. User cohort analysis — needed or just plain user list?
> 9. Feature usage tracking — included?

**For HR**:
> 8. Hiring pipeline (like CRM but for candidates) — yes/no?
> 9. Performance reviews tracker — yes/no?

(etc. — pick relevant ones)

Wait for answers. Apply them.

---

## Step 6 — Synthesize the spec

Write `.imperium/spec.md` in this structure:

```markdown
# Dashboard Spec

## Business Identity

- **Name**: {business name or placeholder}
- **Sector**: {one of the sector labels from Step 2}
- **Primary user(s)**: {who uses this}
- **One-liner**: {1-sentence description}

## Pages

### 1. {Page Name}

- **Purpose**: {what it answers at a glance — one sentence}
- **Closest base**: {one of: default | crm | finance | analytics | productivity | ecommerce | academy | logistics | users | mail} (see .claude/catalog/pages.md)
- **Primary metrics / data**:
  - {metric 1}
  - {metric 2}
- **Key sections** (top-to-bottom):
  - {section 1, e.g., "Hero KPIs (4 tiles)"}
  - {section 2, e.g., "Pipeline chart"}
  - {section 3, e.g., "Recent activity feed"}
- **Component preferences** (where worth noting):
  - {e.g., "Progress visualization uses dot-bar pattern from task-reminders.tsx, NOT shadcn Progress"}
- **Data source intent**: {mock | supabase | external: [name]}
- **Priority**: {must-have | nice-to-have}

### 2. {Page Name}
...

## Branding

- **App name**: {keep "Imperium Admin" or override}
- **Primary color**: {keep Imperium green, or specify}

## Layout preferences (from preference probing)

- **Auth screens**: {none | v1 | v2}
- **Greeting block**: {none | on page X}
- **Header search (cmd+J)**: {keep | remove}
- **Theme modes**: {all three | just X}
- **Coming-soon group in nav**: {no | yes}
- **Mail/inbox page**: {no | yes}
- **Account switcher**: {no | yes}
- **Sector-specific decisions**: {list any}

## Pages explicitly NOT included

- {page user vetoed}
- {sector-default that was pruned}

## Open questions / assumptions

- ASSUMED: {anything that wasn't confirmed but I'm proceeding with}

## Integration intent (v2 work)

- Supabase backend: {yes/no/maybe}
- External APIs to connect: {list, or "none yet"}
```

**Match each page to a `closest base`** using `.claude/catalog/pages.md`. Be honest:
- "client pipeline" → `crm`
- "content calendar with episodes" → `productivity` (adapt tasks → episodes)
- "MRR / churn / users" → mix of `default` + `users`
- "hiring pipeline" → `crm` (deals → candidates)

**Capture component preferences explicitly** when the spec mentions something prone to bad substitution:
- Progress visualizations → call out dot-bar pattern
- Pipeline stages → call out filled colored pills, not plain badges
- KPI tiles → specify MetricCards (3-4 tiles) vs KpiStrip (5-8 metrics)

---

## Step 7 — Present and refine

Show the spec back to the user:

> Here's what I captured. Read through it — anything wrong, missing, or that needs to change?

Loop on edits. Update the spec file in place each time.

---

## Step 8 — Approval and handoff

Once user says "looks good" or equivalent:

> Spec locked at `.imperium/spec.md`. I'll now invoke the scaffold to build these pages. This will:
>
> 1. Check git is clean (or branch into `imperium/before-scaffold-{timestamp}` for safety)
> 2. For each page, copy the closest example and adapt it (component preferences applied)
> 3. Apply your layout preferences (remove header search if you said so, etc.)
> 4. Update the sidebar navigation
> 5. Run `npm run check` to verify biome passes
>
> Ready to proceed?

Once user confirms, hand off to `imperium-scaffold` skill.

---

## What NOT to do

- ❌ Don't survey the user with a long questionnaire — sector defaults do the heavy lifting
- ❌ Don't write the spec without component-preference callouts when the spec mentions known anti-pattern triggers (progress bars, generic badges, raw recharts)
- ❌ Don't accept "I want everything" — push back on scope ("which 3-5 are daily-driver pages?")
- ❌ Don't generate code in this skill — your only output is `.imperium/spec.md`
- ❌ Don't ask about Supabase setup details — just intent ("yes/no/maybe")
- ❌ Don't propose pages the user didn't ask for and the sector defaults didn't suggest
- ❌ Don't lose your turn limit — max 6 user-facing turns total before spec is written

## Edge cases

- **User gives a 1-sentence vision and bails**: Apply sector defaults aggressively, mark everything else `ASSUMED:`, hand them a spec to review
- **User wants 20+ pages**: "That's a lot for v1. Which 3-5 are daily-driver? We add the rest after you see it live."
- **User wants something not in our example library** (3D viz, kanban, calendar with all-day events): Be honest — name what we have and don't have, propose the closest fit, mark it ASSUMED, let them correct
- **User wants exact Supabase setup now**: Capture intent in the spec. Tell them `/imperium-connect-supabase` is v2 and they can wire it up manually after scaffolding if needed.
- **User says "I'm not sure, you decide"**: Use sector defaults heavily. Default to 4 pages, mark everything `ASSUMED:`. Their review pass will fix it.
