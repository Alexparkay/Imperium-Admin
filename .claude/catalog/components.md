# Components Catalog

Reusable patterns from `(examples)/` plus shadcn primitives. Format: **path + signature + when to use + 5-line snippet**. Read the source file when you need full implementation details.

**Hard rules:**
- Only import from packages declared in `package.json` (no hallucinated dependencies)
- Use shadcn primitives from `@/components/ui/*` — never re-implement
- Use `lucide-react` icons exclusively — no inline SVGs
- Charts use the wrapper at `@/components/ui/chart` (not raw recharts)

---

## Layout primitives

### Card
**Path**: `@/components/ui/card`
**Use when**: container for any panel or section
**Snippet**:
```tsx
<Card>
  <CardHeader><CardTitle>Title</CardTitle><CardDescription>Sub</CardDescription></CardHeader>
  <CardContent>...</CardContent>
</Card>
```

### Sidebar / SidebarInset
**Path**: `@/components/ui/sidebar`
**Use when**: every dashboard page — the dashboard layout already provides it. Don't re-create.

### Tabs
**Path**: `@/components/ui/tabs`
**Use when**: a page has 3+ logical views of the same data (e.g., Finance dashboard has Dashboard/Accounts/Transactions)
**Snippet**:
```tsx
<Tabs defaultValue="overview">
  <TabsList><TabsTrigger value="overview">Overview</TabsTrigger></TabsList>
  <TabsContent value="overview">...</TabsContent>
</Tabs>
```

### Separator
**Path**: `@/components/ui/separator`
**Use when**: dividing horizontal sections inside a card

### Resizable panels
**Path**: `@/components/ui/resizable`
**Use when**: master/detail UIs (see Mail dashboard)

---

## KPI / metric cards

### MetricCards (4-up KPI grid)
**Reference**: `(examples)/default/_components/metric-cards.tsx`
**Use when**: page hero showing 3-5 headline numbers with trend deltas
**Pattern**: 4-column grid of Cards, each with icon + label + large number + trend badge
**Variant for 6+ KPIs**: see `KpiStrip` below

### KpiStrip (single-row strip)
**Reference**: `(examples)/ecommerce/_components/kpi-strip.tsx`, `(examples)/analytics/_components/analytics-kpi-strip.tsx`
**Use when**: 5-8 compact metrics in a horizontal strip, denser than MetricCards
**Pattern**: Card with horizontal flex of inline metrics separated by vertical Separators

### KpiCards (variable layout)
**Reference**: `(examples)/crm/_components/kpi-cards.tsx`, `(examples)/academy/_components/kpi-cards.tsx`
**Use when**: 3-4 KPIs, each with secondary detail (mini-chart, sub-metric)

### SectionCards / Trend chips
**Reference**: `(examples)/(legacy)/default-v1/_components/section-cards.tsx`
**Use when**: KPI with a small inline trend chart (sparkline-style)

---

## Charts (see [charts.md](charts.md) for full reference)

### ChartContainer wrapper
**Path**: `@/components/ui/chart` (`ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`)
**Use when**: ALWAYS wrap recharts components in `ChartContainer`. Never use raw `<ResponsiveContainer>`.
**Snippet**:
```tsx
<ChartContainer config={chartConfig} className="h-64">
  <AreaChart data={data}>...</AreaChart>
</ChartContainer>
```

### Common chart types — see [charts.md](charts.md) for which file to copy from.

---

## Tables

### TanStack Data Table
**Reference**:
- `(examples)/users/_components/users-table.tsx` (fullest example — filters, sort, paginate)
- `(examples)/default/_components/recent-customers-table/table.tsx` (simpler)
- `(examples)/ecommerce/_components/recent-orders-table/columns.tsx` (column patterns)
**Use when**: any tabular data with sorting/filtering/pagination needs
**Pattern**: separate `columns.tsx` (column defs), `schema.ts` (zod schema if needed), `table.tsx` (rendering), `data.json` (mock data). Always colocate.
**Key bits**:
- Status badges via `<Badge variant="outline">` with custom className per status
- Sort headers via `<Button variant="ghost">` with ArrowUpDown icon
- Pagination via `<DataTablePagination>` pattern in the same folder

---

## Lists / activity feeds

### PipelineActivity (timestamped event feed)
**Reference**: `(examples)/crm/_components/pipeline-activity.tsx`
**Use when**: chronological activity log (someone did X at Y time)
**Pattern**: Card → vertical list of rows, each with avatar/icon + actor + verb + object + relative timestamp

### TaskReminders (interactive task list)
**Reference**: `(examples)/crm/_components/task-reminders.tsx`, `(examples)/productivity/_components/tasks-section.tsx`
**Use when**: checkboxable to-dos with priority/due-date metadata
**Pattern**: Card → list of rows with `<Checkbox>` + text + meta chips

### UpcomingTransactions / UpcomingEvents
**Reference**: `(examples)/finance/_components/upcoming-transactions.tsx`, `(examples)/academy/_components/upcoming-events.tsx`
**Use when**: forward-looking schedule of things to come (paying bills, attending events)

### RecentNotesCard (compact note list)
**Reference**: `(examples)/productivity/_components/recent-notes-card.tsx`
**Use when**: short text snippets with dates

---

## Progress / Goal visualization

### Dot-bar pattern (PREMIUM — use this for goal progress)
**Reference**: `(examples)/crm/_components/task-reminders.tsx` — see `proposalGoalBars`
**Use when**: showing progress toward a discrete goal ("12 of 18 deals", "$45k of $60k", "67% to monthly target")
**Pattern**: array of 30-50 vertical bars (`w-1.5 h-10 rounded-full`), active filled with `bg-muted-foreground/75`, inactive with `bg-muted-foreground/25`
**DO NOT** use shadcn `<Progress>` primitive for this — it looks generic. The dot-bar is the premium choice.

### Progress (loading / processing only)
**Path**: `@/components/ui/progress`
**Use when**: indeterminate or determinate loading states, file uploads, multi-step wizards
**Don't use**: for goal progress (see dot-bar above)

### Mini sparkline
**Reference**: `(examples)/(legacy)/default-v1/_components/section-cards.tsx`
**Use when**: trend shape inside a KPI card (no axes, no tooltips, ~40px tall)

---

## Status badges / pills

### Badge (basic)
**Path**: `@/components/ui/badge`
**Variants**: `default | primary | destructive | outline | secondary`
**Use when**: any status, category, or count chip

### Trend badge (positive/negative with arrow)
**Reference**: `(examples)/default/_components/metric-cards.tsx` (inline pattern)
**Pattern**:
```tsx
<Badge variant="outline" className={cn(isPositive ? "text-emerald-600" : "text-destructive")}>
  {isPositive ? <TrendingUp /> : <TrendingDown />} {delta}%
</Badge>
```

### Status pill (Active/Pending/Locked etc.)
**Reference**: `(examples)/users/_components/data.tsx` (see `statusMeta`)
**Pattern**: theme-color-aware badge classes, paired with a colored dot

---

## Forms / inputs

### LoginForm pattern
**Reference**: `src/app/(main)/auth/_components/login-form.tsx`
**Use when**: any credential or email/password form
**Pattern**: react-hook-form + zod resolver, `@/components/ui/field` field primitives

### Field primitive
**Path**: `@/components/ui/field`
**Use when**: ALL form inputs — wraps label + input + error message consistently

### Combobox / Select
**Path**: `@/components/ui/combobox`, `@/components/ui/select`
**Use when**: dropdowns. Use Combobox for searchable, Select for short fixed lists

### DateRangePicker
**Path**: `@/components/date-range-picker`
**Use when**: any "from-to" date filter (charts, reports)

---

## Greeting / hero blocks

### Productivity greeting
**Reference**: `(examples)/productivity/page.tsx` (the "Good morning, Alex" hero)
**Use when**: personalized dashboard homepage
**Pattern**: large heading + muted subhead, full-width above the fold

### Welcome / empty states
**Pattern**: Card with centered icon + heading + description + CTA button

---

## Quick Actions / button groups

### QuickActions panel
**Reference**: `(examples)/productivity/_components/quick-actions.tsx`, `(examples)/finance/_components/quick-actions.tsx`
**Use when**: 3-6 primary actions a user might want to take from the page (e.g., "Send invoice", "Add transaction")
**Pattern**: Card → grid of buttons each with icon + label

---

## Map components (for geographic data)

### ShipmentRouteMap (d3-geo + topojson)
**Reference**: `(examples)/logistics/_components/shipment-route-map.tsx`
**Use when**: any geographic visualization (routes, distribution by country, store locations)
**Dependencies in package.json**: `d3-geo`, `topojson-client` — already installed

---

## Anti-patterns (don't do these)

- ❌ Importing icons from anywhere other than `lucide-react`
- ❌ Hardcoding hex colors — use `bg-primary`, `text-muted-foreground`, `border-border` etc.
- ❌ `<img>` tags — use `next/image`
- ❌ Inline SVGs for icons (use lucide)
- ❌ `<div></div>` empty elements — use `<div />`
- ❌ Using `||` for nullish defaults — use `??`
- ❌ Adding `: string` type annotations when value is a string literal — let inference work
- ❌ Floating Promises — every async call needs `await`, `void`, or `.catch()`
- ❌ Importing UI components from non-shadcn libraries — everything from `@/components/ui/*`
- ❌ Re-implementing components that already exist — check the catalog first

---

## When you need a component that's not catalogued

1. Check `src/components/ui/*` (shadcn primitives) — most common needs are there
2. Check `(examples)/` for similar patterns to adapt
3. Only as a last resort, build new — and follow [style-guide.md](style-guide.md) strictly
4. New custom components go in `src/components/custom/` (gitkept directory for user-authored components)
