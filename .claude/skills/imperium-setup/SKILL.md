---
name: imperium-setup
description: Top-level orchestrator for the Imperium Admin clone-and-customize flow. Invoke when user says "set me up", "let's customize", "I just cloned this", "get started", "start setup", "customize this dashboard", or runs the /imperium-setup slash command. Detects first-run vs returning, then routes to discovery (new spec) or offers to edit/extend the existing spec.
---

# Imperium Setup Skill

The entry point for customizing this dashboard. Orchestrates discovery → scaffold.

## Detect first-run vs returning user

1. Check if `.imperium/spec.md` exists AND has more than placeholder content
2. If first-run (no spec or placeholder only):
   - Invoke `imperium-discovery` to build a spec via conversation
   - Once spec is approved, invoke `imperium-scaffold` to build the pages
3. If returning (spec exists with real content):
   - Greet briefly and offer three paths:
     a. **Review / edit current spec** — read spec, propose changes via conversation, update file
     b. **Add a new page** — invoke `imperium-scaffold` in single-page mode
     c. **Start over** — confirm destructive intent, archive current spec to `.imperium/spec-{timestamp}.md.bak`, then invoke discovery fresh

## First-run flow

```
1. Read .imperium/spec.md (if placeholder content, treat as no spec)
2. Greet user, explain what's about to happen
3. Invoke imperium-discovery skill
4. Discovery produces approved .imperium/spec.md
5. Confirm user is ready to scaffold
6. Invoke imperium-scaffold skill
7. Scaffold reports completion
8. Suggest `npm run dev` to see the result
9. Offer next steps (add more pages, connect data, etc.)
```

## Returning user flow

```
1. Read .imperium/spec.md
2. Brief summary: "You have {N} pages spec'd: {list}. Last updated {date if available}."
3. Ask: review/edit, add new page, or start over?
4. Route to appropriate sub-flow
```

## Greeting style

Keep the opening warm but tight. Avoid over-explanation. The user just wants to start.

**Good opening**:
> Welcome. I'll help you customize Imperium Admin for your business.
>
> A quick brain-dump conversation gives me what I need to scaffold your dashboard. We'll cover: what your business does, what pages you want, and what metrics matter on each.
>
> Ready when you are — what's this dashboard for?

**Bad opening** (don't):
> Hello! Welcome to the Imperium Admin clone-and-customize template! In this skill, we will perform the following six-step process:
> 1. Discovery
> 2. ...

## What this skill does NOT do

- Doesn't generate any code (delegate to scaffold)
- Doesn't ask discovery questions itself (delegate to discovery)
- Doesn't modify files except triggering sub-skills

It's a thin orchestrator. The real work happens in `imperium-discovery` and `imperium-scaffold`.

## What this skill MUST do

- Be the single entry point users can rely on
- Handle both first-run and returning user cases gracefully
- Never lose the user mid-flow — always end with "what's next?"
- Always end the scaffold step with a concrete `npm run dev` suggestion so the user can SEE the result
