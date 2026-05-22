# Component Selector — Intent → Component Decision Tree

This file solves the most important problem in scaffolding: **picking the RIGHT component for the section, not just A working component**. AI generation defaults to "generic but works." This catalog forces "premium and on-brand."

**Hard rule**: When scaffolding, ALWAYS consult this file before reaching for shadcn primitives. If a more polished pattern exists in the example library, use it. Don't substitute.

---

## Progress / Goal visualization

When the user wants to show "how far along we are toward a goal" — pick by **what kind of goal**:

### 1. Discrete goal progress (best, premium feel)
**Pattern**: Dot-bar array — 30-50 vertical bars, active ones in primary color, inactive muted
**Reference**: [`(examples)/crm/_components/task-reminders.tsx`](../../src/app/(main)/dashboard/(examples)/crm/_components/task-reminders.tsx) — see `proposalGoalBars`
**Use when**: "X of Y sent", "12 of 18 deals closed", "67% to monthly target"
**Don't use**: shadcn `<Progress>` for this case — it looks generic
**Adapt**: change bar count (30-50), the active threshold, and label

```tsx
const goalBars = Array.from({ length: 42 }, (_, i) => ({ active: i < activeCount }));
<div className="flex h-10 w-full items-end gap-0.5">
  {goalBars.map((bar) => (
    <div key={bar.id} className={cn("h-10 w-1.5 rounded-full",
      bar.active ? "bg-muted-foreground/75" : "bg-muted-foreground/25")} />
  ))}
</div>
```

### 2. Continuous percentage (loading/processing)
**Pattern**: shadcn `<Progress>` primitive
**Reference**: `@/components/ui/progress`
**Use when**: loading states, file uploads, indeterminate steps
**Don't use**: for goal-progress (use dot-bar above)

### 3. Radial / circular progress
**Pattern**: Recharts RadialBarChart
**Use when**: dashboard-corner KPI tile showing a single percentage
**Note**: rarely the best choice — dot-bar is usually better for goals, Progress is better for loading

### 4. Sparkline-with-current-vs-target
**Pattern**: Area chart with reference line for target
**Reference**: `(examples)/(legacy)/finance-v1/_components/kpis/savings-rate.tsx`
**Use when**: trend toward a target over time

---

## Status indication

When user wants to show "what state is this thing in" — pick by **how prominent**:

### 1. Inline cell status (in a table)
**Pattern**: colored dot + label with semantic background tint
**Reference**: [`(examples)/users/_components/data.tsx`](../../src/app/(main)/dashboard/(examples)/users/_components/data.tsx) — see `statusMeta`
**Use when**: status is a column in a table

```tsx
<Badge variant="outline" className={statusMeta[status].badgeClass}>
  <span className={cn("size-1.5 rounded-full", statusMeta[status].dotClass)} />
  {status}
</Badge>
```

### 2. Trend chip (positive/negative delta)
**Pattern**: Badge with TrendingUp/TrendingDown icon + colored text
**Reference**: [`(examples)/default/_components/metric-cards.tsx`](../../src/app/(main)/dashboard/(examples)/default/_components/metric-cards.tsx)
**Use when**: showing % change next to a KPI value
**Colors**: `text-emerald-600` for positive, `text-destructive` for negative — semantic, theme-aware

### 3. Plain category tag
**Pattern**: shadcn `<Badge variant="outline">` or `<Badge variant="secondary">`
**Use when**: tagging things by category (priority, source, channel) without semantic meaning

### 4. Pipeline stage marker
**Pattern**: filled colored pill with icon
**Reference**: [`(examples)/crm/_components/opportunities-table/columns.tsx`](../../src/app/(main)/dashboard/(examples)/crm/_components/opportunities-table/columns.tsx)
**Use when**: discrete pipeline stages (Lead → Qualified → Won)

---

## KPI display

When user wants to show "key numbers at a glance" — pick by **how many KPIs and how much detail per KPI**:

### 1. Three to four hero KPIs with sub-detail
**Pattern**: Grid of full Card components with icon + label + value + delta + optional mini-chart
**Reference**: [`(examples)/default/_components/metric-cards.tsx`](../../src/app/(main)/dashboard/(examples)/default/_components/metric-cards.tsx)
**Use when**: page hero showing the top 3-4 numbers
**Layout**: `grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4`

### 2. Five to eight compact KPIs (strip)
**Pattern**: Single horizontal Card with vertical separators between inline metrics
**Reference**: [`(examples)/ecommerce/_components/kpi-strip.tsx`](../../src/app/(main)/dashboard/(examples)/ecommerce/_components/kpi-strip.tsx), [`(examples)/analytics/_components/analytics-kpi-strip.tsx`](../../src/app/(main)/dashboard/(examples)/analytics/_components/analytics-kpi-strip.tsx)
**Use when**: dense overview with 5+ KPIs

### 3. KPI with embedded sparkline
**Pattern**: SectionCard with mini area chart underneath the number
**Reference**: [`(examples)/(legacy)/default-v1/_components/section-cards.tsx`](../../src/app/(main)/dashboard/(examples)/(legacy)/default-v1/_components/section-cards.tsx)
**Use when**: trend shape matters as much as the number

### 4. Side-stacked KPIs
**Pattern**: Vertical card with multiple labeled values
**Reference**: [`(examples)/finance/_components/overview-kpis.tsx`](../../src/app/(main)/dashboard/(examples)/finance/_components/overview-kpis.tsx)
**Use when**: page sidebar / narrow column

**Anti-pattern**: don't use a generic `<Card>` with `<CardTitle>` for a KPI. Always wrap in MetricCards or KpiStrip pattern — the typography hierarchy matters.

---

## Data over time (charts)

When user wants to show "how X changed" — pick by **chart-specific intent**, see [charts.md](charts.md) for full reference. Quick decision:

| Intent | Chart |
|---|---|
| Smooth ascending story (revenue, users) | AreaChart |
| Sharp inflection / exact values | LineChart |
| Compare categories | BarChart (horizontal if long labels) |
| Breakdown of total | DonutChart (3-6 segments max) |
| Two metrics, different scales | ComposedChart |
| Mini in-card sparkline | AreaChart with no axes/grid/tooltip |

**Always wrap in `<ChartContainer>`** from `@/components/ui/chart`. Never raw recharts.

---

## Lists vs tables

When user wants to display "multiple records" — pick by **whether sort/filter matters**:

### 1. Sortable, filterable table
**Pattern**: TanStack Table with columns + filters + pagination
**Reference**: [`(examples)/users/_components/users-table.tsx`](../../src/app/(main)/dashboard/(examples)/users/_components/users-table.tsx) (full-featured), [`(examples)/default/_components/recent-customers-table/`](../../src/app/(main)/dashboard/(examples)/default/_components/recent-customers-table) (simpler)
**Use when**: 10+ rows, user needs to find/sort/filter

### 2. Chronological activity feed
**Pattern**: Vertical list with avatar/icon + actor + action + timestamp
**Reference**: [`(examples)/crm/_components/pipeline-activity.tsx`](../../src/app/(main)/dashboard/(examples)/crm/_components/pipeline-activity.tsx)
**Use when**: "who did what when" log, recent events

### 3. Task / checklist list
**Pattern**: List rows with checkbox + text + priority/due chips
**Reference**: [`(examples)/productivity/_components/tasks-section.tsx`](../../src/app/(main)/dashboard/(examples)/productivity/_components/tasks-section.tsx), [`(examples)/crm/_components/task-reminders.tsx`](../../src/app/(main)/dashboard/(examples)/crm/_components/task-reminders.tsx)
**Use when**: actionable to-dos

### 4. Forward schedule
**Pattern**: List rows with date + label + value (right-aligned)
**Reference**: [`(examples)/finance/_components/upcoming-transactions.tsx`](../../src/app/(main)/dashboard/(examples)/finance/_components/upcoming-transactions.tsx), [`(examples)/academy/_components/upcoming-events.tsx`](../../src/app/(main)/dashboard/(examples)/academy/_components/upcoming-events.tsx)
**Use when**: "what's coming up" forward-looking lists

### 5. Compact card list (notes/snippets)
**Pattern**: Card with vertical list of small text blocks + dates
**Reference**: [`(examples)/productivity/_components/recent-notes-card.tsx`](../../src/app/(main)/dashboard/(examples)/productivity/_components/recent-notes-card.tsx)
**Use when**: short text snippets, narrow column

---

## Flow / process visualization

When user wants to show "a sequence of steps or a workflow":

### 1. Numbered step card
**Pattern**: Card with numbered list of steps, each with icon + title + description
**No existing reference**: build from primitives (`<Card>` + numbered `<ol>` styled with shadcn typography)
**Use when**: onboarding flows, checkout steps, process explanation

### 2. Pipeline stage tracker
**Pattern**: Horizontal connected steps with active/completed/upcoming states
**Closest existing**: [`(examples)/(legacy)/default-v1/_components/proposal-sections-table/`](../../src/app/(main)/dashboard/(examples)/(legacy)/default-v1/_components/proposal-sections-table) shows status progression
**Use when**: deal pipeline visualization, multi-step process tracker

### 3. Timeline / meeting schedule
**Pattern**: Horizontal bar with positioned events along it
**Reference**: [`(examples)/crm/_components/task-reminders.tsx`](../../src/app/(main)/dashboard/(examples)/crm/_components/task-reminders.tsx) — the "Upcoming Meetings" card with positioned meeting block
**Use when**: showing daily/hourly schedule with events as blocks

### 4. Flowchart / decision tree
**No existing pattern**. If user asks for one, suggest one of:
- Static SVG inline (Claude generates the markup)
- External tool (excalidraw, figjam) and embed iframe
- Simple numbered card list (option 1 above)
Tell the user it's not a native pattern and offer the closest alternative.

---

## Hero / page intro blocks

When user wants the "top of the page" to feel welcoming or contextual:

### 1. Personalized greeting
**Pattern**: Large heading + muted subhead
**Reference**: [`(examples)/productivity/page.tsx`](../../src/app/(main)/dashboard/(examples)/productivity/page.tsx) (line 17-22)
**Use when**: personal dashboard with single-user context ("Good morning, Alex.")

### 2. Quick stats banner
**Pattern**: Inline stats row, no card wrapper
**Use when**: contextual summary above the main content

### 3. Empty state card
**Pattern**: Centered Card with icon + heading + description + CTA
**Use when**: a section has no data yet ("No projects yet — create your first")

### 4. Section divider with context
**Pattern**: Heading + description text, no card wrapper, before a content block
**Use when**: separating logical sections of a long page

---

## Forms / input collection

When user wants to capture data from the user:

### 1. Login / register form
**Pattern**: react-hook-form + zod resolver + shadcn `<Field>` primitive
**Reference**: [`src/app/(main)/auth/_components/login-form.tsx`](../../src/app/(main)/auth/_components/login-form.tsx)
**Use when**: any auth or simple credential form

### 2. Multi-field settings form
**Pattern**: Card with grouped Field rows, save button at bottom
**Build from primitives** — no full example yet. Use shadcn `<Field>`, `<Input>`, `<Switch>`, `<Select>` patterns

### 3. Single-action input (search, filter)
**Pattern**: Compact `<Input>` with leading icon
**Reference**: search dialog at [`src/app/(main)/dashboard/_components/sidebar/search-dialog.tsx`](../../src/app/(main)/dashboard/_components/sidebar/search-dialog.tsx)

### 4. Date range
**Pattern**: `<DateRangePicker>`
**Reference**: [`src/components/date-range-picker.tsx`](../../src/components/date-range-picker.tsx)
**Use when**: filtering by time range

---

## Geographic / spatial

When user wants to show "where things are happening":

### 1. World/country map
**Pattern**: d3-geo + topojson with countries colored or marked
**Reference**: [`(examples)/logistics/_components/shipment-route-map.tsx`](../../src/app/(main)/dashboard/(examples)/logistics/_components/shipment-route-map.tsx)
**Use when**: distribution by country, customer geography

### 2. Country flag list
**Pattern**: List rows with `<span class="fi fi-us" />` flag class + label + value
**Reference**: [`(examples)/analytics/_components/top-pages.tsx`](../../src/app/(main)/dashboard/(examples)/analytics/_components/top-pages.tsx), CSS in [`src/styles/flag-icons/flags.css`](../../src/styles/flag-icons/flags.css)
**Use when**: country/region rankings (denser than a map)

---

## Quick-action button groups

When user wants "what can I do from here":

**Pattern**: Card with grid of icon+label buttons
**Reference**: [`(examples)/productivity/_components/quick-actions.tsx`](../../src/app/(main)/dashboard/(examples)/productivity/_components/quick-actions.tsx), [`(examples)/finance/_components/quick-actions.tsx`](../../src/app/(main)/dashboard/(examples)/finance/_components/quick-actions.tsx)
**Use when**: 3-6 primary actions from a page (compose, add, send, etc.)
**Anti-pattern**: don't just throw raw `<Button>`s in a row — wrap in a Card with proper spacing

---

## Critical anti-patterns (in order of frequency)

| User asks for... | Wrong choice | Right choice |
|---|---|---|
| "goal progress" / "X of Y" | `<Progress>` primitive | Dot-bar pattern from `task-reminders.tsx` |
| "active deals pipeline" | Generic data table | Pipeline stage column with filled colored pills (`crm/opportunities-table`) |
| "key metric" | `<Card>` with `<CardTitle>` | MetricCards or KpiStrip pattern |
| "trend over last 30 days" | Raw recharts AreaChart | `<ChartContainer>` wrapped with proper chartConfig |
| "status badge" | Plain colored text | `statusMeta` pattern with dot + tinted background (`users/_components/data.tsx`) |
| "what's coming up" | Generic list | UpcomingTransactions/UpcomingEvents pattern with date column |
| "show a workflow" | Hand-drawn SVG | Numbered step card OR timeline pattern from `task-reminders.tsx` |
| "header search" | Plain `<Input>` | `<SearchDialog>` cmd+J pattern |

---

## The component selection workflow

When scaffolding a section:

1. Read the spec entry → identify the user's intent
2. Open this file → find the matching intent category
3. Find the most specific match in that category
4. Open the referenced file → copy the implementation
5. Adapt data/labels only — don't substitute components

If a user's intent isn't in this file:
1. Check [components.md](components.md) for the closest pattern
2. If still nothing, check shadcn primitives at `@/components/ui/*`
3. Last resort: build from primitives following [style-guide.md](style-guide.md)
4. Mention to the user: "I built this fresh because no existing pattern matched — let me know if it feels off."

**Never silently substitute a generic primitive when a polished pattern exists. That's the single biggest source of AI-slop in this codebase.**
