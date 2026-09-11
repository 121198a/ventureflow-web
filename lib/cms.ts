import sanitizeHtml from "sanitize-html";

const CMS_BASE =
  process.env.NEXT_PUBLIC_CMS_API_URL ||
  "https://development.unboundxinc.us/api/user-service/user/cms-pages";

export type CmsPage = {
  id: number;
  slug: string;
  parent_slug: string | null;
  title: string;
  content: { body: string; html: string };
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

type CmsResponse<T> = { status: number; message: string; data: T };

export async function getCmsPage(slug: string): Promise<CmsPage | null> {
  try {
    const res = await fetch(`${CMS_BASE}/${slug}`, {
      headers: {
        "api-version": "v1",
        "x-custom-lang": "en",
        accept: "application/json",
      },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const json = (await res.json()) as CmsResponse<CmsPage>;
    if (json.status !== 200 || !json.data) return null;
    return json.data;
  } catch {
    return null;
  }
}

export const LEGAL_PAGES: { slug: string; label: string }[] = [
  { slug: "reg-bi-disclosure", label: "Reg BI disclosure" },
  { slug: "terms-condition", label: "Terms & Condition" },
  { slug: "crs", label: "Customer Relationship Summary" },
  { slug: "investment-disclaimers", label: "Investment & Securities Disclaimers" },
  { slug: "marv-agreement", label: "Customer Brokerage Agreement – MARV Capital Inc." },
  { slug: "post-disclaimer", label: "Post Disclaimer" },
  { slug: "ubverse-disclaimer-for-unboundx", label: "UBverse Platform Disclaimer" },
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "cookie-policy", label: "Cookie Policy" },
  { slug: "acceptable-use", label: "Acceptable Use Policy" },
  { slug: "eula", label: "End User License Agreement (EULA)" },
  { slug: "community-guidelines", label: "Community Guidelines" },
  { slug: "dmca-policy", label: "DMCA and Copyright Policy" },
  { slug: "rewards-terms", label: "Rewards Program Terms and Conditions" },
  { slug: "sweepstakes-rules", label: "Sweepstakes Program Terms" },
  { slug: "delete-account", label: "Delete Your Account" },
  { slug: "marv-capital-customer-agreement", label: "MARV Capital Inc Customer Options Agreement" },
  { slug: "marv-capital-disclosure", label: "MARV Capital Inc. Options Disclosure Form" },
  { slug: "support", label: "Support" },
  { slug: "contact-us", label: "Contact Us" },
];

export function rewriteCmsLinks(html: string): string {
  return html
    .replace(/https?:\/\/(www\.)?website-dev\.unboundxinc\.us\/([a-z0-9-]+)\/?/gi, "/legal/$2")
    .replace(/https?:\/\/(www\.)?unboundxinc\.com\/legal\/([a-z0-9-]+)\/?/gi, "/legal/$2")
    .replace(/https?:\/\/(www\.)?unboundxinc\.com\/([a-z0-9-]+)\/?/gi, "/legal/$2")
    .replace(/href="\/legal\/legal"/gi, 'href="/legal"');
}

export function sanitizeCmsHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: [
      "p", "br", "hr", "b", "i", "em", "strong", "u", "s", "small",
      "h1", "h2", "h3", "h4", "h5", "h6",
      "ul", "ol", "li", "blockquote", "a", "span", "div",
      "table", "thead", "tbody", "tr", "th", "td",
    ],
    allowedAttributes: {
      a: ["href", "target", "rel"],
      span: ["class"],
      div: ["class"],
      table: ["class"],
      th: ["colspan", "rowspan"],
      td: ["colspan", "rowspan"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    textFilter: (text, tagName) => {
      if (tagName !== "span" || text.length < 80 || text !== text.toUpperCase()) {
        return text;
      }

      return text.toLowerCase().replace(/[a-z]/, (character) => character.toUpperCase());
    },
    transformTags: {
      a: (tagName, attribs) => ({
        tagName,
        attribs: { ...attribs, rel: "noopener noreferrer" },
      }),
    },
  });
}
