import { fetchDashboardCompanies, fetchIssuerDetail, type BackendCompanySummary } from "./ubverse-api";

export type Offering = {
  id?: string;
  slug: string;
  name: string;
  round: string;
  goal: string;
  min: string;
  filing: string;
  art: string;
  imageUrl?: string;
  initials: string;
  status: string;
  /** Long-form intro paragraph on the deal page. Truncated with a "View
      More" toggle when longer than ~220 chars, matching the reference. */
  description: string;
  legalOfferor: string;
  lawFirm: string;
  aboutBody: string;
  categories: string[];
  stats: {
    interestIndicated: string | null;
    committed: string | null;
    funded: string | null;
  };
};

export const defaultOfferings: Offering[] = [
  {
    id: "6a13ecf060f222865a4316d1",
    slug: "virani-chem-pvt-limited",
    name: "Virani Chem. Pvt. Limited.",
    round: "Friends & Family",
    goal: "$5K",
    min: "$5",
    filing: "Reg D, 506b",
    art: "linear-gradient(135deg, oklch(0.96 0.02 20), oklch(0.9 0.06 25))",
    initials: "VC",
    status: "Open Now",
    description: "qwer",
    legalOfferor: "test",
    lawFirm: "yew",
    aboutBody: "qwer",
    categories: ["3D Printing", "AgTech", "Agribusiness"],
    stats: { interestIndicated: "$5", committed: "$2", funded: "$65" },
  },
  {
    id: "6a17db67c79bc1c0e694dcdc",
    slug: "infopulse-technology",
    name: "Infopulse Technology",
    round: "Friends & Family",
    goal: "$2M",
    min: "$10K",
    filing: "Regulation CF",
    art: "linear-gradient(135deg, oklch(0.55 0.22 262), oklch(0.45 0.2 268))",
    initials: "IP",
    status: "Open Now",
    description: "zsdsfdsafd",
    legalOfferor: "test",
    lawFirm: "test",
    aboutBody: "zsdsfdsafd",
    categories: ["AdTech"],
    stats: { interestIndicated: "$120K", committed: "$30K", funded: "$20K" },
  },
  {
    id: "6a1e6611c79bc1c0e6956a93",
    slug: "unbound-x",
    name: "Unbound X",
    round: "Not sure · need guidance",
    goal: "$20.2K",
    min: "$100K",
    filing: "Reg D Rule 506(b)",
    art: "conic-gradient(from 200deg, oklch(0.78 0.17 75), oklch(0.55 0.24 300), oklch(0.6 0.2 250), oklch(0.78 0.17 75))",
    initials: "UX",
    status: "Open Now",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    legalOfferor: "xyz",
    lawFirm: "test",
    aboutBody: "just testing",
    categories: [],
    stats: { interestIndicated: null, committed: null, funded: null },
  },
  {
    id: "6a5f46ecf37a301631812c1b",
    slug: "hopiyant-tech",
    name: "Hopiyant Tech",
    round: "Friends & Family",
    goal: "$5K",
    min: "$5",
    filing: "Reg D, 506b",
    art: "linear-gradient(115deg, oklch(0.28 0.07 262), oklch(0.5 0.19 250))",
    initials: "HT",
    status: "Open Now",
    description: "test",
    legalOfferor: "test",
    lawFirm: "test",
    aboutBody: "test",
    categories: [],
    stats: { interestIndicated: null, committed: null, funded: null },
  },
];

export const offerings: Offering[] = defaultOfferings;

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatCurrency(val?: string | number | null): string {
  if (!val && val !== 0) return "--";
  const str = String(val).trim();
  if (str.startsWith("$")) return str;
  const num = parseFloat(str.replace(/[^0-9.]/g, ""));
  if (isNaN(num)) return str;
  if (num >= 1_000_000) {
    const formatted = num % 1_000_000 === 0 ? (num / 1_000_000).toFixed(0) : (num / 1_000_000).toFixed(1);
    return `$${formatted}M`;
  }
  if (num >= 1_000) {
    const formatted = num % 1_000 === 0 ? (num / 1_000).toFixed(0) : (num / 1_000).toFixed(1);
    return `$${formatted}K`;
  }
  return `$${num}`;
}

function formatStage(stage?: string): string {
  if (!stage) return "Friends & Family";
  if (stage === "friends-family") return "Friends & Family";
  if (stage === "unsure") return "Not sure · need guidance";
  if (stage === "seed") return "Seed";
  if (stage === "series-a") return "Series A";
  return stage
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatFiling(filing?: string): string {
  if (!filing) return "Reg D, 506b";
  if (filing.toLowerCase().includes("cf")) return "Regulation CF";
  if (filing.toLowerCase().includes("506b")) return "Reg D, 506b";
  if (filing.toLowerCase().includes("506c")) return "Reg D, 506c";
  if (filing.toLowerCase().includes("reg a")) return "Regulation A+";
  return filing;
}

function getInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

/**
 * Maps a company summary from the backend dashboard to the frontend Offering structure.
 */
function mapBackendCompany(c: BackendCompanySummary): Offering {
  const slug = slugify(c.name);
  const fallback = defaultOfferings.find((d) => d.slug === slug || d.id === c.id);

  const goal = formatCurrency(c.valueTotalAmountPlaning || c.totalAmountPlaning) !== "--"
    ? formatCurrency(c.valueTotalAmountPlaning || c.totalAmountPlaning)
    : fallback?.goal || "$5K";

  const min = formatCurrency(c.minimuminvestmentAmount) !== "--"
    ? formatCurrency(c.minimuminvestmentAmount)
    : fallback?.min || "$5";

  return {
    id: c.id,
    slug,
    name: c.name || fallback?.name || "Company Offering",
    round: formatStage(c.fundingRoundStage),
    goal,
    min,
    filing: formatFiling(c.securitiesFiling),
    art: fallback?.art || "linear-gradient(135deg, oklch(0.55 0.22 262), oklch(0.45 0.2 268))",
    imageUrl: c.image || undefined,
    initials: getInitials(c.name),
    status: "Open Now",
    description: fallback?.description || "Structured private offering on UBverse.",
    legalOfferor: fallback?.legalOfferor || "MARV Capital, Inc.",
    lawFirm: fallback?.lawFirm || "Snell & Wilmer",
    aboutBody: fallback?.aboutBody || "Offering details and disclosure available on UBverse.",
    categories: fallback?.categories || [],
    stats: {
      interestIndicated: fallback?.stats.interestIndicated || null,
      committed: fallback?.stats.committed || null,
      funded: fallback?.stats.funded || null,
    },
  };
}

/**
 * Dynamically fetches offerings from backend API with local fallbacks.
 */
export async function getDynamicOfferings(): Promise<Offering[]> {
  try {
    const backendCompanies = await fetchDashboardCompanies();
    if (backendCompanies.length > 0) {
      return backendCompanies.map(mapBackendCompany);
    }
  } catch (err) {
    console.warn("[Offerings] Falling back to local offerings data:", err);
  }
  return defaultOfferings;
}

/**
 * Fetches single dynamic offering by slug or ID with full detail from backend.
 */
export async function getDynamicOffering(slug: string): Promise<Offering | null> {
  const normSlug = slug.toLowerCase();
  
  // 1. Get base list to find company ID
  const all = await getDynamicOfferings();
  const baseOffering = all.find((o) => o.slug === normSlug || o.id === slug) ||
    defaultOfferings.find((o) => o.slug === normSlug || o.id === slug);

  if (!baseOffering) return null;

  // 2. If we have a company ID, fetch full issuer details from backend
  if (baseOffering.id) {
    try {
      const detail = await fetchIssuerDetail(baseOffering.id);
      if (detail) {
        const info = detail.companyInformation;
        const about = detail.aboutUs;
        const prog = detail.funding_target_progress;

        return {
          ...baseOffering,
          name: info?.companyLegalName || baseOffering.name,
          description: info?.companyDescription || baseOffering.description,
          filing: formatFiling(info?.securityFilling || baseOffering.filing),
          imageUrl: info?.image?.url || baseOffering.imageUrl,
          categories: about?.categories?.length ? about.categories : baseOffering.categories,
          legalOfferor: about?.valueLegalOfferor || baseOffering.legalOfferor,
          lawFirm: about?.valueLegalFirm || baseOffering.lawFirm,
          aboutBody: about?.aboutUs || baseOffering.aboutBody,
          round: formatStage(prog?.fundingRoundStage || baseOffering.round),
          goal: formatCurrency(prog?.valueTotalAmountPlaning) !== "--"
            ? formatCurrency(prog?.valueTotalAmountPlaning)
            : baseOffering.goal,
          min: formatCurrency(prog?.minimuminvestmentAmount) !== "--"
            ? formatCurrency(prog?.minimuminvestmentAmount)
            : baseOffering.min,
          stats: {
            interestIndicated: prog?.valueCapitalIndicated ? formatCurrency(prog.valueCapitalIndicated) : (baseOffering.stats.interestIndicated || null),
            committed: prog?.committed ? formatCurrency(prog.committed) : (baseOffering.stats.committed || null),
            funded: prog?.funded ? formatCurrency(prog.funded) : (baseOffering.stats.funded || null),
          },
        };
      }
    } catch (err) {
      console.warn(`[Offerings] Error fetching detail for ${baseOffering.slug}:`, err);
    }
  }

  return baseOffering;
}

export function getOffering(slug: string) {
  return offerings.find((o) => o.slug === slug);
}
