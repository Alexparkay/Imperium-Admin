---
name: imperium-deploy
description: Guided flow to disconnect from the Imperium-Admin upstream template, create the user's own GitHub repo, push their customized dashboard, and deploy to Vercel. Use when user says "deploy", "ship it", "push to github", "go live", "deploy to vercel", "publish", or invokes /imperium-deploy. Handles both CLI tools (gh, vercel) and web-UI fallbacks for users without those installed.
---

# Imperium Deploy Skill

Walk the user through getting their customized dashboard onto their own GitHub repo and deployed live on Vercel. This is a destructive operation in the git sense — by default it severs the connection to the Imperium-Admin upstream template so the user truly owns their codebase.

## When to invoke

- User runs `/imperium-deploy`
- User says: "deploy", "ship it", "publish", "push to github", "go live", "deploy to vercel"
- After `/imperium-setup` finishes, suggest this as the next step

## Pre-flight checks

Before doing anything destructive:

1. **Spec exists**: read `.imperium/spec.md`. If it's still the placeholder, ask: "You haven't customized the dashboard yet. Want to run `/imperium-setup` first?"
2. **Git status clean**: run `git status`. If dirty, ask user to commit / discard first. Don't proceed with uncommitted changes.
3. **`npm run check` passes**: run it. If errors, fix or ask user to fix. Don't push broken code.
4. **`npm run build` works**: run it. Catches Next.js build errors that biome won't catch. Don't push code that can't deploy.
5. **Confirm current remote**: run `git remote -v`. Show user what's there. Most likely `origin → Alexparkay/Imperium-Admin`.

## Step 1 — Decide history strategy

Show the user two options and let them pick:

> Your repo currently points to `Alexparkay/Imperium-Admin` upstream. To make it yours, pick one:
>
> **Option A — Clean slate (recommended for white-labeling)**
> Wipe git history and start fresh. Your repo will have one initial commit with all your customizations. No trace of the upstream template. You won't easily pull future Imperium-Admin updates.
>
> **Option B — Preserve history**
> Keep the full commit history. Repoint origin to your new repo. You can later add Imperium-Admin as a second remote and pull template updates.
>
> Which do you want — A or B?

Apply user's choice in Step 3.

## Step 2 — Identify or create the user's GitHub repo

Ask the user:

> Have you created a GitHub repo for this project yet?

### If yes:
Ask for the URL. Validate format: `https://github.com/{owner}/{name}.git` or `git@github.com:{owner}/{name}.git`. Save it.

### If no:

Check if GitHub CLI is installed:
```bash
gh --version
```

**If `gh` is installed and authed (`gh auth status` returns OK)**:
```
I can create the repo for you with GitHub CLI. What should I call it?
(Suggested: {slug of business name from .imperium/spec.md})
```
Then run:
```bash
gh repo create {name} --private --source=. --remote=imperium-temp --description "Customized from Imperium-Admin"
```
This creates the repo without setting the remote (we'll handle remotes in Step 3). Note: `--source=.` would auto-set origin, but we use `--remote=imperium-temp` and remove it after so Step 3 has clean control. Actually simpler — pass `--clone=false` to avoid auto-set:
```bash
gh repo create {owner}/{name} --private --description "Customized from Imperium-Admin"
```
Capture the resulting URL from `gh repo view {name} --json sshUrl,url`.

**If `gh` is NOT installed**:
Tell the user:
```
GitHub CLI isn't installed. Easiest path:

1. Open https://github.com/new in your browser
2. Repository name: {suggested name}
3. Set visibility (Private recommended for now — you can flip to Public later)
4. DO NOT initialize with README, .gitignore, or license — the repo already has those
5. Click "Create repository"
6. Copy the URL shown on the next page (looks like https://github.com/YOUR-NAME/YOUR-REPO.git)
7. Paste it back here when ready
```
Wait for user to paste URL.

Optional offer: "Want me to install GitHub CLI for you? `winget install --id GitHub.cli` on Windows, or `brew install gh` on Mac. It makes future deploys faster."

## Step 3 — Apply history strategy

### Option A — Clean slate (nuke and reinit)

These are destructive operations. **Confirm one more time** before running:

> I'm about to:
> 1. Delete the `.git` folder (wipes all upstream history)
> 2. Run `git init -b main` (fresh repo)
> 3. Configure git user (use current global settings unless you want to override)
> 4. Stage all files and create one "Initial commit"
> 5. Add your GitHub repo as origin
> 6. Push
>
> Last chance to bail. Proceed?

If yes:
```bash
# Verify user config
git config user.name
git config user.email
```
If either is empty, ask user for them and run:
```bash
git config --local user.name "User Name"
git config --local user.email "user@example.com"
```

Then:
```bash
rm -rf .git
git init -b main
git add -A
git commit -m "Initial commit" --no-verify
git remote add origin {user-github-url}
git push -u origin main
```

The `--no-verify` is necessary because husky's pre-commit hook hasn't been set up yet in the fresh repo (hooksPath isn't configured). Future commits will run the hook normally.

### Option B — Preserve history (repoint remote)

Less destructive:
```bash
git remote set-url origin {user-github-url}
git push -u origin main
```

If the user wants to keep Imperium-Admin as a secondary remote for future updates:
```bash
git remote add upstream https://github.com/Alexparkay/Imperium-Admin.git
```
Tell them: "Pull future Imperium-Admin template updates with `git fetch upstream main` then cherry-pick or merge what you want."

## Step 4 — Verify push succeeded

Run:
```bash
git remote -v
git log -1 --format='Author: %an <%ae>%nMessage: %s'
```

Report to user:
```
Pushed successfully.

Your repo: {user-github-url}
Latest commit: {commit-message} by {author}

Next: deploy to Vercel.
```

## Step 5 — Vercel deployment

Check if Vercel CLI is installed:
```bash
vercel --version
```

### Path A — Vercel CLI installed

```
I'll use Vercel CLI for the deployment. First time setup:

1. Link this project to your Vercel account
2. Deploy to production
```

Run:
```bash
vercel link
```
This is interactive — user picks their team, project name, etc. Walk them through:
> Vercel will ask:
> - "Set up and deploy?" → Yes
> - Choose your scope (your username or a team)
> - "Link to existing project?" → No (unless they already have one)
> - "What's your project's name?" → Suggested: same as GitHub repo
> - "In which directory is your code located?" → `./` (default)
> - "Want to modify these settings?" → No (the defaults are correct for Next.js)

Then deploy:
```bash
vercel deploy --prod --yes
```

Capture the production URL from output. Report:
```
Deployed to: {url}

To trigger future deploys, just `git push` to GitHub — Vercel auto-deploys on push to main.
```

### Path B — Vercel CLI not installed

Offer the install OR walk through web UI:

> Vercel CLI isn't installed. Two paths:
>
> **Path 1 — Install Vercel CLI** (faster for future deploys):
> ```
> npm i -g vercel
> ```
> Then re-run `/imperium-deploy` from this point.
>
> **Path 2 — Web UI** (zero CLI setup):
> 1. Open https://vercel.com/new in your browser
> 2. Sign in with GitHub (if not already)
> 3. Click "Import" next to your `{repo-name}` repository
> 4. Framework Preset should auto-detect as "Next.js" — leave defaults
> 5. Click "Deploy"
> 6. Wait 1-2 minutes for the first build
> 7. Vercel gives you a `.vercel.app` URL — paste it back here so I can confirm
>
> Which path?

Wait for response.

## Step 6 — Post-deploy housekeeping

Once deployed (either path):

1. **Vercel-specific tweaks**:
   - The `postinstall` script in `package.json` prints the "say: set me up" banner. This runs on Vercel builds too, which is harmless but noisy in deploy logs. Offer: "Want me to make the postinstall banner local-only (skip during Vercel builds)?" If yes:
     ```js
     // package.json postinstall
     "postinstall": "node -e \"if(!process.env.VERCEL) console.log('...')\""
     ```

2. **Environment variables placeholder**:
   - Tell user: "If you connect Supabase or other services later (v2 work), set env vars at vercel.com/your-project/settings/environment-variables — never commit `.env.local`."

3. **Custom domain** (optional offer):
   - "Want to set up a custom domain? vercel.com/your-project/settings/domains. Or stick with the `.vercel.app` URL for now."

4. **Sync upstream** (if Option B was chosen):
   - Tell user: "You kept history. To pull future Imperium-Admin template improvements:"
     ```bash
     git fetch upstream main
     git log HEAD..upstream/main --oneline   # see what's new
     git cherry-pick {commit-sha}            # pull individual changes
     ```

5. **Final summary**:
```
Deployment complete.

Repo:   {github-url}
Live:   {vercel-url}

What you can do now:
- Edit your dashboard locally → `git push` → Vercel auto-deploys
- Add a new page → `/imperium-add-page` in Claude Code
- Iterate visuals → just describe changes to Claude

When ready for real data, Supabase wiring is the v2 work — not yet automated but I can guide manual setup if you ask.
```

## Critical rules

- **NEVER push without `npm run build` passing first**. Broken builds waste user's Vercel build minutes and embarrass them.
- **NEVER do `rm -rf .git` without explicit user confirmation in the same turn**. Use AskUserQuestion or wait for "yes proceed" before destructive ops.
- **NEVER commit `.env.local`** or any file with secrets. Check `.gitignore` covers it (it should already).
- **NEVER overwrite the user's git config globally** — only set local config (`git config --local`) for this repo.
- **NEVER force-push to main** — if the push is rejected (e.g., user accidentally initialized GitHub repo with a README), tell them and ask before forcing.
- **DO recheck the live URL works** after Vercel reports success — fetch the URL and confirm it returns 200, even if just via showing the URL to the user to visit.

## Edge cases

### User has a private GitHub repo with 2FA
- The push will prompt for credentials. On Windows, Git Credential Manager handles this. If it fails, walk user through generating a personal access token at github.com/settings/tokens.

### User's GitHub repo was initialized with a README
- The first push will fail with "non-fast-forward". Two options:
  - `git pull --rebase origin main && git push` (merges their README)
  - `git push --force origin main` (overwrites — only safe on a brand-new empty repo). ASK before using `--force`.

### Vercel deploy fails on first try
- Common causes: missing env vars, broken build, Vercel can't access private GitHub repo (permissions).
- For env vars: this v1 has none required. Confirm via `vercel env ls`.
- For build: run `npm run build` locally first — must pass.
- For permissions: in Vercel dashboard, install the Vercel GitHub app for the repo (vercel.com/account/integrations).

### User wants to deploy to a non-Vercel platform (Netlify, Railway, self-host)
- This skill is Vercel-specific because of `vercel.ts`/`vercel.json` first-class support and Next.js 16's optimization for Vercel runtime.
- Tell user: "This template is optimized for Vercel deploy. For Netlify/Railway/self-host, the Next.js app will still work — `npm run build && npm run start` — but image optimization, edge functions, and ISR may need additional config. Want me to point you at platform-specific docs?"

### User wants to NOT push to GitHub at all (local-only or different git host)
- Skip Step 3's `git remote add origin`. Tell user to set their preferred remote manually:
  ```bash
  git remote add origin <their-remote-url>
  git push -u origin main
  ```

## Output

Every deploy run ends with:
1. Confirmation that origin remote points to user's repo (not Alexparkay/Imperium-Admin)
2. Live Vercel URL (or chosen platform URL)
3. Next-step suggestions for iteration

That's it. No surprises. No extra refactors during deploy — code should already be in deployable state from `/imperium-setup`.
