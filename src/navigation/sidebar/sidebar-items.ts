import {
  Banknote,
  ChartBar,
  Fingerprint,
  Forklift,
  Gauge,
  GraduationCap,
  LayoutDashboard,
  ListTodo,
  type LucideIcon,
  Mail,
  ShoppingBag,
  Users,
} from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

// Example dashboards are kept in src/app/(main)/dashboard/(examples)/ as a reference library
// for Claude Code to copy from when scaffolding new pages. They are hidden from the sidebar
// by default. Set NEXT_PUBLIC_SHOW_EXAMPLES=true in .env.local to surface them while
// developing or comparing patterns.
const showExamples = process.env.NEXT_PUBLIC_SHOW_EXAMPLES === "true";

const exampleGroups: NavGroup[] = [
  {
    id: 90,
    label: "Examples — Dashboards",
    items: [
      { title: "Default", url: "/dashboard/default", icon: LayoutDashboard },
      { title: "CRM", url: "/dashboard/crm", icon: ChartBar },
      { title: "Finance", url: "/dashboard/finance", icon: Banknote },
      { title: "Analytics", url: "/dashboard/analytics", icon: Gauge },
      { title: "Productivity", url: "/dashboard/productivity", icon: ListTodo },
      { title: "E-commerce", url: "/dashboard/ecommerce", icon: ShoppingBag },
      { title: "Academy", url: "/dashboard/academy", icon: GraduationCap },
      { title: "Logistics", url: "/dashboard/logistics", icon: Forklift },
    ],
  },
  {
    id: 91,
    label: "Examples — Pages",
    items: [
      { title: "Email", url: "/dashboard/mail", icon: Mail },
      { title: "Users", url: "/dashboard/users", icon: Users },
      {
        title: "Authentication",
        url: "/auth",
        icon: Fingerprint,
        subItems: [
          { title: "Login v1", url: "/auth/v1/login", newTab: true },
          { title: "Login v2", url: "/auth/v2/login", newTab: true },
          { title: "Register v1", url: "/auth/v1/register", newTab: true },
          { title: "Register v2", url: "/auth/v2/register", newTab: true },
        ],
      },
    ],
  },
  {
    id: 92,
    label: "Examples — Legacy",
    items: [
      {
        title: "Legacy Dashboards",
        url: "/dashboard/default-v1",
        subItems: [
          { title: "Default V1", url: "/dashboard/default-v1" },
          { title: "CRM V1", url: "/dashboard/crm-v1" },
          { title: "Finance V1", url: "/dashboard/finance-v1" },
          { title: "Analytics V1", url: "/dashboard/analytics-v1" },
        ],
      },
    ],
  },
];

// The default nav is intentionally empty. /imperium-setup populates it with the user's
// scaffolded pages. This keeps the dashboard from showing template fluff (auth subitems,
// coming-soon placeholders, example dashboards) before customization.
//
// Set NEXT_PUBLIC_SHOW_EXAMPLES=true in .env.local to surface the example groups while
// developing or comparing patterns.
const baseNav: NavGroup[] = [];

export const sidebarItems: NavGroup[] = showExamples ? [...baseNav, ...exampleGroups] : baseNav;
