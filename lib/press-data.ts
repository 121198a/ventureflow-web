export interface PressRelease {
  slug: string;
  title: string;
  date: string;
  summary: string;
  category: "Product Launch" | "Research" | "Ecosystem" | "Corporate";
  href: string;
}

export const pressReleases: PressRelease[] = [
  {
    slug: "public-record-keeping-layer-social-investing",
    title: "UnBound X Launches Public Record-Keeping Layer for Social Investing",
    date: "Sep 2026",
    summary:
      "UnBound X introduces a verifiable platform turning social investment claims into immutable track records with targets, horizons, and outcomes.",
    category: "Product Launch",
    href: "/blog/architecture-of-a-verified-thesis",
  },
  {
    slug: "five-critical-numbers-diligence-framework",
    title: "Five Critical Numbers: UnBound X Releases Venture Diligence Framework",
    date: "Aug 2026",
    summary:
      "An institutional teardown of what early-stage venture investors require from founders during initial meetings and capital allocation discussions.",
    category: "Research",
    href: "/blog/five-critical-numbers",
  },
  {
    slug: "collaborative-due-diligence-spaces",
    title: "Collaborative Due Diligence in Spaces: The Future of Distributed Syndicates",
    date: "Jul 2026",
    summary:
      "How institutional and retail investors are structuring deal analysis and collaborative evaluation through dedicated thesis spaces.",
    category: "Ecosystem",
    href: "/blog/collaborative-due-diligence-in-spaces",
  },
];

export const companyBoilerplate =
  "UnBound X is a capital markets technology company building the public, verifiable record-keeping layer for social investing and venture diligence. Founded in 2024 and headquartered in New York, UnBound X equips retail and institutional allocators with verifiable track records, structured thesis spaces, and quantitative diligence tools.";

export const brandColors = [
  { name: "Brand Primary", hex: "#2563EB", class: "bg-blue-600", usage: "Primary CTAs, active indicators, brand accent" },
  { name: "Navy Dark", hex: "#0F172A", class: "bg-slate-900", usage: "Headings, primary typography, high-contrast borders" },
  { name: "Surface Alt", hex: "#F8FAFC", class: "bg-slate-50", usage: "Card backgrounds, section contrast, subtle containers" },
  { name: "Border Hairline", hex: "#E2E8F0", class: "bg-slate-200", usage: "Dividers, hairline borders, structural separators" },
];

export const fastFacts = [
  { label: "Founded", value: "2024" },
  { label: "Headquarters", value: "New York, NY" },
  { label: "Co-Founders", value: "Maneesh Awasthi & Arnav Awasthi" },
  { label: "Industry", value: "FinTech / Capital Markets Technology" },
  { label: "Core Products", value: "UnBound X Protocol & UBverse" },
  { label: "Mission", value: "Turn investment claims into verifiable records" },
];
