# Charts Catalog

All charts use **recharts** wrapped in the shadcn `ChartContainer` primitive at `@/components/ui/chart`. Never use raw `<ResponsiveContainer>`.

**Always:**
- Wrap in `<ChartContainer config={chartConfig} className="h-64">`
- Use `ChartTooltip` + `ChartTooltipContent` for tooltips
- Reference chart colors via `var(--chart-1)` through `var(--chart-5)` — never hardcode hex
- Provide a `chartConfig` object mapping data keys to label + color

---

## AreaChart (smooth or stepped fills)

**Best example**: `(examples)/default/_components/performance-overview.tsx`
**Also**: `(examples)/analytics/_components/realtime-visitors.tsx`
**Use when**: showing a continuous metric over time (revenue trend, traffic, active users). Especially good for "smooth ascending" stories.
**Data shape**: `[{ date: string, value: number }]` or with multiple series `[{ date, seriesA, seriesB }]`
**Variants**: stacked areas (multiple series), gradient fills, dashed reference lines

---

## BarChart (categorical comparisons)

**Best example**: `(examples)/ecommerce/_components/top-products.tsx`
**Also**: `(examples)/crm/_components/task-reminders.tsx` (the proposal goal bars)
**Use when**: comparing discrete categories (top products, channels, regions). Horizontal bars work better for long category labels.
**Data shape**: `[{ name: string, value: number, fill?: string }]`
**Variants**: grouped bars (multiple values per category), stacked bars (parts of a whole)

---

## LineChart (trend lines)

**Best example**: `(examples)/analytics/_components/traffic-quality.tsx`
**Also**: `(examples)/ecommerce/_components/store-traffic.tsx` (dual-axis)
**Use when**: trends with sharp inflection points where you want to see exact values at each tick. Multi-line for comparing series.
**Data shape**: `[{ date, lineA, lineB, lineC }]`
**Variants**: dual-axis (two Y scales), dotted vs solid, with reference dots

---

## PieChart / DonutChart (parts of a whole)

**Best example**: `(examples)/finance/_components/income-breakdown.tsx`
**Also**: `(examples)/ecommerce/_components/traffic-sources.tsx`
**Use when**: showing composition of a total (≤6 segments, ideally 3-5). Donut variant is preferred over solid pie because the center can hold a label.
**Data shape**: `[{ name: string, value: number, fill: string }]`
**Anti-pattern**: don't use for 8+ segments — use a horizontal bar chart instead

---

## ComposedChart (bars + line overlay)

**Best example**: `(examples)/finance/_components/transactions-overview-card.tsx`
**Use when**: two metrics on the same chart that benefit from different visual languages (e.g., revenue as bars + cumulative line)
**Data shape**: `[{ date, barValue, lineValue }]`

---

## RadialBarChart / Gauge (single-metric progress)

**Best example**: see Recharts docs — not heavily used in this codebase
**Use when**: representing a single metric as a percentage of a goal (e.g., "67% to monthly goal")
**Alternative**: a simple Progress bar (`@/components/ui/progress`) is often simpler and matches the design system better

---

## Sparkline (inline mini-chart)

**Best example**: `(examples)/(legacy)/default-v1/_components/section-cards.tsx`
**Use when**: tiny chart next to a KPI value, no axes, just shape
**Pattern**: AreaChart with no axes, no grid, no tooltips, height ~40px, fixed minimal config

---

## Map (geographic distribution)

**Best example**: `(examples)/logistics/_components/shipment-route-map.tsx`
**Use when**: regional/country-level data, route visualization
**Dependencies**: `d3-geo`, `topojson-client` (already installed)
**Note**: not a recharts chart — uses raw d3 + SVG. More complex; only use when geography is essential.

---

## Choosing the right chart

| User intent | Best chart |
|---|---|
| "How did X change over time?" | AreaChart or LineChart |
| "Compare X across categories" | BarChart |
| "What's the breakdown of total X?" | DonutChart |
| "How are we doing vs goal?" | Progress bar OR RadialBarChart |
| "Where are X happening geographically?" | Map (d3-geo) |
| "Two metrics in the same view" | ComposedChart or dual-axis LineChart |
| "Trend at a glance, no exact values needed" | Sparkline |

---

## chartConfig pattern (always required)

```tsx
const chartConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
  expenses: { label: "Expenses", color: "var(--chart-2)" },
} satisfies ChartConfig;
```

Then in the chart:
```tsx
<ChartContainer config={chartConfig} className="h-64">
  <AreaChart data={data}>
    <Area dataKey="revenue" fill="var(--color-revenue)" stroke="var(--color-revenue)" />
    <ChartTooltip content={<ChartTooltipContent />} />
  </AreaChart>
</ChartContainer>
```

The `var(--color-{key})` syntax is auto-bound by ChartContainer from your config.

---

## Don't reinvent — copy from these files

Before writing any new chart, open the best-example file listed above, copy the entire component, and adapt the data + config. This guarantees you'll match the project's chart styling exactly.
