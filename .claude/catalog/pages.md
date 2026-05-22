# Pages Catalog

Reference library of every example dashboard at `src/app/(main)/dashboard/(examples)/`. Use these as the **base to copy** when scaffolding new pages — never generate from scratch.

When scaffolding a new page:
1. Match the user's stated need to the closest example below
2. Copy the entire example directory to `src/app/(main)/dashboard/{new-name}/`
3. Rename component exports, swap mock data to match the spec, prune unused sections
4. Always reference [components.md](components.md) for which components to use and [style-guide.md](style-guide.md) for visual rules

---

## Default — Sales / Revenue overview

**Path**: `src/app/(main)/dashboard/(examples)/default/`
**URL**: `/dashboard/default`
**What it does**: Headline business KPIs (total revenue, new customers, active accounts, growth rate), an interactive area chart of customer activity, a subscriber overview, and a recent-customers data table.
**Key components**: `MetricCards`, `PerformanceOverview` (area chart), `SubscriberOverview`, `RecentCustomersTable` (TanStack)
**Mock data**: `_components/data.json` (50+ customer records), inline metric data
**Use as base when user wants**:
- A general-purpose business overview dashboard
- KPI tiles + headline chart + recent activity table
- "Just give me the main numbers" kind of homepage

---

## CRM — Sales pipeline

**Path**: `src/app/(main)/dashboard/(examples)/crm/`
**URL**: `/dashboard/crm`
**What it does**: Sales KPI cards (deals, pipeline value, conversion, deal cycle), pipeline activity feed, task reminders with calendar slot, opportunities data table.
**Key components**: `KpiCards`, `PipelineActivity` (activity feed), `TaskReminders`, `OpportunitiesSection` (table)
**Mock data**: `_components/opportunities-table/data.json`
**Use as base when user wants**:
- Sales pipeline / deal tracking
- Activity feeds with timestamps
- Task lists tied to calendar slots
- Anything pipeline-stage-based (lead → qualified → closed)

---

## Finance — Personal / business finances

**Path**: `src/app/(main)/dashboard/(examples)/finance/`
**URL**: `/dashboard/finance`
**What it does**: Tabbed layout (Dashboard / Accounts / Transactions) with overview KPIs, income breakdown donut, transactions chart, balance distribution, wallet card, upcoming transactions list.
**Key components**: `OverviewKpis`, `IncomeBreakdown` (donut chart), `TransactionsOverviewCard` (composed chart), `BalanceDistributionCard`, `Wallet`, `UpcomingTransactions`
**Mock data**: Inline in components
**Use as base when user wants**:
- Money / financial tracking (revenue, expenses, cashflow)
- Account-style dashboards (multiple accounts to switch between)
- Donut/pie chart breakdowns
- Anything with "balance" or "transactions" semantics

---

## Analytics — Web / product analytics

**Path**: `src/app/(main)/dashboard/(examples)/analytics/`
**URL**: `/dashboard/analytics`
**What it does**: Tabbed (Overview / Audience / Acquisition / Engagement / Conversions) with KPI strip, traffic quality multi-line chart, real-time visitors area chart, top pages table, top traffic sources, country flag breakdown.
**Key components**: `AnalyticsKpiStrip`, `AnalyticsToolbar` (date range), `TrafficQuality` (multi-line), `RealtimeVisitors`, `TopPages`, `TopTrafficSources`
**Mock data**: Inline, plus flag icons CSS at `src/styles/flag-icons/`
**Use as base when user wants**:
- Web analytics, GA-style dashboard
- Real-time activity monitoring
- Multi-tab analytics (audience vs acquisition vs engagement)
- Geographic breakdowns by country

---

## Productivity — Personal task / project tracker

**Path**: `src/app/(main)/dashboard/(examples)/productivity/`
**URL**: `/dashboard/productivity`
**What it does**: "Good morning" greeting, summary cards, tasks section with checkboxes, projects section, calendar panel, focus card (pomodoro-style), weekly summary, recent notes, quote card.
**Key components**: `SummaryCards`, `TasksSection`, `ProjectsSection`, `QuickActions`, `CalendarPanel`, `FocusCard`, `WeeklySummaryCard`, `RecentNotesCard`
**Mock data**: Inline
**Use as base when user wants**:
- Personal productivity / task tracking
- Greeting + summary at top
- Calendar widget
- Anything where the user is the primary actor (not just observing data)
- Content creator dashboards (tasks = videos in progress, projects = series)

---

## E-commerce — Online store overview

**Path**: `src/app/(main)/dashboard/(examples)/ecommerce/`
**URL**: `/dashboard/ecommerce`
**What it does**: Store KPI strip (revenue, orders, AOV, conversion), recent orders table, inventory levels, top products bar chart, store traffic dual-axis line chart, customer reviews list, traffic sources donut.
**Key components**: `KpiStrip`, `RecentOrders` (table), `Inventory`, `TopProducts`, `StoreTraffic`, `TrafficSources`, `CustomerReviews`
**Mock data**: `_components/recent-orders-table/data.json`
**Use as base when user wants**:
- Online store / retail dashboards
- Product catalogs with inventory levels
- Order management
- Review / rating displays

---

## Academy — Learning / education

**Path**: `src/app/(main)/dashboard/(examples)/academy/`
**URL**: `/dashboard/academy`
**What it does**: Learning KPIs, class schedule timeline, assignment status (progress bars), performance highlights, upcoming events list.
**Key components**: `KpiCards`, `ClassSchedule`, `AssignmentStatus`, `PerformanceHighlights`, `UpcomingEvents`
**Mock data**: Inline
**Use as base when user wants**:
- Education / training / coaching dashboards
- Anything schedule-based (timeline view)
- Progress tracking with bars
- HR onboarding / employee development

---

## Logistics — Shipment / route tracking

**Path**: `src/app/(main)/dashboard/(examples)/logistics/`
**URL**: `/dashboard/logistics`
**What it does**: Logistics-specific layout with shipment list, shipment details panel, route map (d3-geo + topojson), shipment data.
**Key components**: `Logistics` (parent), `ShipmentList`, `ShipmentDetails`, `ShipmentRouteMap`
**Mock data**: `_components/shipment-data.ts`
**Use as base when user wants**:
- Map-based dashboards (route tracking, geographic distribution)
- Master/detail layouts (list left, details right)
- Operations / fleet management

---

## Users — Team / member management

**Path**: `src/app/(main)/dashboard/(examples)/users/`
**URL**: `/dashboard/users`
**What it does**: Full users table with filters (role, team, status, workspace), sortable columns, pagination, last-active timestamps, role badges.
**Key components**: `Users` (parent), `UsersTable`, `UsersColumns` (TanStack config)
**Mock data**: `_components/data.tsx` (24 user records, filters, role/status meta)
**Use as base when user wants**:
- Team member / employee management
- Anything with role-based filtering
- Tables with badges, status pills, last-active times
- Permissions / access management UIs

---

## Mail — Email client (master/detail)

**Path**: `src/app/(main)/dashboard/(examples)/mail/`
**URL**: `/dashboard/mail`
**What it does**: Three-pane email client: sidebar (folders/accounts), middle list (messages), right detail view. Resizable panels.
**Key components**: `Mail`, `MailSidebar`, `MailList`, `MailView`, `MailInbox`
**Mock data**: `src/app/(main)/mail/_components/data.tsx`
**Use as base when user wants**:
- Multi-pane interfaces (left nav + list + detail)
- Inbox-style UIs (support tickets, message queues, comment moderation)
- Anything threaded or conversation-based

---

## Legacy v1 versions (also in examples)

Located at `src/app/(main)/dashboard/(examples)/(legacy)/{default-v1,crm-v1,finance-v1,analytics-v1}/`. Alternate stylings of the above. **Use only if** the user specifically asks for a "simpler" or "more compact" layout — most of the time, the modern versions above are the better starting point.

---

## Pattern decision matrix

When a user describes a need, find the closest pattern:

| User says... | Start from |
|---|---|
| "main dashboard / overview / homepage" | Default |
| "sales / deals / pipeline / CRM" | CRM |
| "money / revenue / expenses / financials" | Finance |
| "website / app / traffic analytics" | Analytics |
| "tasks / projects / to-dos / personal productivity" | Productivity |
| "store / orders / products / inventory" | E-commerce |
| "courses / classes / training / coaching" | Academy |
| "shipping / routes / maps / fleet" | Logistics |
| "team / members / users / permissions" | Users |
| "inbox / messages / tickets / threads" | Mail |
| "content creator / videos / podcasts / posts" | Productivity (adapt — tasks → content pieces) |
| "HR / employees / hiring" | Users + Academy |
| "CFO / financial reporting" | Finance + Default |
| "marketing / campaigns" | Analytics + E-commerce |

If two examples both fit, copy the closer one and pull individual components from the other via [components.md](components.md).
