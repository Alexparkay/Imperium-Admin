---
description: Start (or resume) the Imperium Admin customization flow. Brain-dump your dashboard vision and Claude scaffolds it.
---

You are invoking the Imperium Admin clone-and-customize flow. Use the `imperium-setup` skill to handle this — it will detect first-run vs returning and route accordingly.

The user wants to customize this dashboard for their business. The flow is:

1. **Discovery** — a conversation to capture what they want (`imperium-discovery` skill)
2. **Spec review** — they approve `.imperium/spec.md`
3. **Scaffold** — pages get built by copying from `src/app/(main)/dashboard/(examples)/` (`imperium-scaffold` skill)
4. **Verify** — biome passes, dev server suggested

Invoke the `imperium-setup` skill now. Follow it exactly.
