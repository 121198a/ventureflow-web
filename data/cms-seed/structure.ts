/** SEED SOURCE ONLY: categories, sidebar navigation and legacy-path redirects. */
import type { CategoryInput, NavItemInput, RedirectInput } from "../../lib/cms/types.ts";

export const seedCategories: CategoryInput[] = [
  { name: "Legal", slug: "legal", description: "Terms, privacy and policies.", sortOrder: 10, status: "active" },
  { name: "Community", slug: "community", description: "How we work together.", sortOrder: 20, status: "active" },
  { name: "Support", slug: "support", description: "Help and account requests.", sortOrder: 30, status: "active" },
];

const n = (label: string, slug: string, category: string, sortOrder: number): NavItemInput => ({
  label, slug, href: `/legal/${slug}`, category, parentId: null, sortOrder, visibility: "public", status: "active",
});

export const seedNavigation: NavItemInput[] = [
  n("Terms of Use", "terms-condition", "legal", 10),
  n("Privacy Policy", "privacy-policy", "legal", 20),
  n("Cookie Policy", "cookie-policy", "legal", 30),
  n("Acceptable Use Policy", "acceptable-use", "legal", 40),
  n("Workspace Disclaimer", "workspace-disclaimer-for-ventureflow", "legal", 50),
  n("Community Guidelines", "community-guidelines", "community", 10),
  n("Support", "support", "support", 10),
  n("Delete Your Account", "delete-your-account", "support", 20),
];

const r = (oldPath: string, newPath: string): RedirectInput => ({ oldPath, newPath, statusCode: 301, active: true });
export const seedRedirects: RedirectInput[] = [
  r("/legal/terms-of-use", "/legal/terms-condition"),
  r("/legal/terms-and-conditions", "/legal/terms-condition"),
  r("/legal/privacy", "/legal/privacy-policy"),
  r("/legal/investment-disclaimers", "/legal/workspace-disclaimer-for-ventureflow"),
  r("/legal/end-user-license-agreement-eula", "/legal/terms-condition"),
  r("/legal/dmca-and-copyright-policy", "/legal/acceptable-use"),
];
