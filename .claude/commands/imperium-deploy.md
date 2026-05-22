---
description: Push your customized dashboard to YOUR GitHub and deploy to Vercel. Severs the upstream Imperium-Admin connection by default so your repo is truly yours.
---

The user wants to deploy their customized Imperium Admin dashboard live. They've finished customizing locally and now need to:

1. Get the codebase onto their own GitHub repo (not Alexparkay/Imperium-Admin)
2. Connect to Vercel and deploy

Invoke the `imperium-deploy` skill. It handles:

- Pre-flight checks (spec exists, `npm run check` passes, `npm run build` works)
- Disconnecting from the upstream template (default: nuke and reinit for clean white-label; alternative: preserve history)
- Creating or linking the user's GitHub repo (via `gh` CLI if installed, else web UI walkthrough)
- Pushing the initial commit
- Vercel deployment (via `vercel` CLI if installed, else web UI walkthrough)
- Post-deploy housekeeping (env var setup, custom domain, upstream sync if history was preserved)

Follow the skill exactly. Don't skip pre-flight checks. Confirm before any destructive git operation.
