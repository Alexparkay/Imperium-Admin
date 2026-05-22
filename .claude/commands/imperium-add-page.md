---
description: Add a single new page to your existing Imperium Admin dashboard. Requires .imperium/spec.md to exist (run /imperium-setup first if it doesn't).
---

The user wants to add ONE new page to their existing dashboard (they've already run `/imperium-setup` at some point and have an `.imperium/spec.md` in place).

Invoke the `imperium-scaffold` skill in **single-page mode** (Mode B per the skill). The skill will:

1. Ask 2-3 quick clarifying questions about the new page (purpose, key metrics, closest existing example)
2. Append the new page to `.imperium/spec.md`
3. Copy from the matching example dashboard in `src/app/(main)/dashboard/(examples)/`
4. Adapt mock data and component naming
5. Update the sidebar nav
6. Run `npm run check` and report

If `.imperium/spec.md` doesn't exist yet, tell the user to run `/imperium-setup` first.
