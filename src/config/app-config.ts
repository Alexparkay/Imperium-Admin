import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Imperium Admin",
  version: packageJson.version,
  copyright: `© ${currentYear}, Imperium Admin.`,
  meta: {
    title: "Imperium Admin - Modern Next.js Dashboard",
    description:
      "Imperium Admin is a modern dashboard built with Next.js 16, Tailwind CSS v4, and shadcn/ui. SaaS-ready, fully customizable, production-grade.",
  },
};
