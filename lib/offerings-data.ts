import { fetchDashboardCompanies, fetchIssuerDetail, type BackendCompanySummary } from "./workspace-api";

/**
 * Startup profile shown in the workspace directory.
 * All bundled records are fictional demo profiles.
 */
export type Offering = {
  id?: string;
  slug: string;
  name: string;
  /** Company stage, e.g. "Early Stage". */
  round: string;
  category: string;
  location: string;
  /** Short label shown as a badge, e.g. "Sample". */
  tag: string;
  art: string;
  imageUrl?: string;
  initials: string;
  status: string;
  description: string;
  aboutBody: string;
  categories: string[];
};

export const defaultOfferings: Offering[] = [
  {
    slug: "northhstar-lab-pvt-ltd",
    name: "Northhstar Lab Pvt. Ltd.",
    round: "Early Stage",
    category: "Technology & AI",
    location: "Demo Workspace",
    tag: "Sample",
    art: "linear-gradient(135deg, oklch(0.55 0.22 262), oklch(0.45 0.2 268))",
    imageUrl: "/brand/companies/northhstar-lab-pvt-ltd.webp",
    initials: "NL",
    status: "Sample",
    description: "Northhstar Lab Pvt. Ltd. delivers precision technology, AI workflows, and strategic system architecture.",
    aboutBody:
      "Northhstar Lab Pvt. Ltd. is an innovative technology enterprise. This profile illustrates how a venture profile looks in the VentureFlow workspace with complete documentation, team composition, and collaboration capabilities.",
    categories: ["Technology", "AI"],
  },
  {
    slug: "novaforge",
    name: "Novaforge Pvt. Ltd.",
    round: "Growth",
    category: "Innovation & Crafting",
    location: "Demo Workspace",
    tag: "Sample",
    art: "linear-gradient(115deg, oklch(0.28 0.07 262), oklch(0.5 0.19 250))",
    imageUrl: "/brand/companies/novaforge-pvt-ltd.webp",
    initials: "NF",
    status: "Sample",
    description: "Novaforge Pvt. Ltd. specializes in rapid hardware, engineering, and manufacturing innovation.",
    aboutBody:
      "Novaforge Pvt. Ltd. is featured to preview startup discovery, saved investor lists, and workspace notes.",
    categories: ["Product", "Innovation", "Engineering"],
  },
  {
    slug: "vertexworks",
    name: "Vertex Works Pvt. Ltd.",
    round: "Early Growth",
    category: "Advanced Consulting & Integration",
    location: "Demo Workspace",
    tag: "Sample",
    art: "linear-gradient(135deg, oklch(0.45 0.15 200), oklch(0.35 0.12 240))",
    imageUrl: "/brand/companies/vertex-works-pvt-ltd.webp",
    initials: "VW",
    status: "Sample",
    description: "Vertex Works Pvt. Ltd. delivers advanced consulting, architecture, and system integration.",
    aboutBody:
      "Vertex Works Pvt. Ltd. showcases introductions, enterprise deal messaging, and secure document rooms.",
    categories: ["Enterprise", "Consulting", "Integration"],
  },
];

export const offerings: Offering[] = defaultOfferings;

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function formatStage(stage?: string): string {
  if (!stage) return "Early Stage";
  return stage
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function getInitials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

/** Maps a company summary from the backend to the frontend profile structure. */
function mapBackendCompany(c: BackendCompanySummary): Offering {
  const slug = slugify(c.name);
  const fallback = defaultOfferings.find((d) => d.slug === slug);
  return {
    id: c.id,
    slug,
    name: c.name || fallback?.name || "Startup profile",
    round: formatStage(c.fundingRoundStage),
    category: fallback?.category || "Technology",
    location: fallback?.location || "Workspace",
    tag: fallback?.tag || "Profile",
    art: fallback?.art || defaultOfferings[0].art,
    imageUrl: c.image || fallback?.imageUrl || undefined,
    initials: getInitials(c.name),
    status: fallback?.status || "Active",
    description: fallback?.description || "Startup profile on VentureFlow.",
    aboutBody: fallback?.aboutBody || "Profile details are available in the VentureFlow workspace.",
    categories: fallback?.categories || [],
  };
}

/** Fetches profiles from the configured backend, falling back to demo profiles. */
export async function getDynamicOfferings(): Promise<Offering[]> {
  try {
    const backendCompanies = await fetchDashboardCompanies();
    if (backendCompanies.length > 0) {
      return backendCompanies.map(mapBackendCompany);
    }
  } catch (err) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[Profiles] Falling back to local demo data:", err);
    }
  }
  return defaultOfferings;
}

function normalizeSlug(slug: string): string {
  const norm = slug.toLowerCase().trim();
  if (norm === "northstar-labs" || norm === "northstar" || norm === "northhstar" || norm === "northhstar-lab") {
    return "northhstar-lab-pvt-ltd";
  }
  if (norm === "novaforge-pvt-ltd") {
    return "novaforge";
  }
  if (norm === "vertex-works" || norm === "vertex-works-pvt-ltd") {
    return "vertexworks";
  }
  return norm;
}

/** Fetches a single profile by slug or ID, with detail from the backend when available. */
export async function getDynamicOffering(slug: string): Promise<Offering | null> {
  const normSlug = normalizeSlug(slug);
  const all = await getDynamicOfferings();
  const baseOffering =
    all.find((o) => o.slug === normSlug || o.id === slug) ||
    defaultOfferings.find((o) => o.slug === normSlug || o.id === slug);

  if (!baseOffering) return null;

  if (baseOffering.id) {
    try {
      const detail = await fetchIssuerDetail(baseOffering.id);
      if (detail) {
        const info = detail.companyInformation;
        const about = detail.aboutUs;
        return {
          ...baseOffering,
          name: info?.companyLegalName || baseOffering.name,
          description: info?.companyDescription || baseOffering.description,
          imageUrl: info?.image?.url || baseOffering.imageUrl,
          categories: about?.categories?.length ? about.categories : baseOffering.categories,
          aboutBody: about?.aboutUs || baseOffering.aboutBody,
          round: formatStage(detail.funding_target_progress?.fundingRoundStage || baseOffering.round),
        };
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[Profiles] Error fetching detail for ${baseOffering.slug}:`, err);
      }
    }
  }

  return baseOffering;
}

export function getOffering(slug: string) {
  const norm = normalizeSlug(slug);
  return offerings.find((o) => o.slug === norm || o.slug === slug);
}
