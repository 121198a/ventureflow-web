import sanitizeHtml from "sanitize-html";

const CMS_BASE =
  process.env.NEXT_PUBLIC_CMS_API_URL ||
  "https://api.ventureflow.example/api/user-service/user/cms-pages";

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
  { slug: "terms-condition", label: "Terms of Use" },
  { slug: "privacy-policy", label: "Privacy Policy" },
  { slug: "workspace-disclaimer-for-ventureflow", label: "Workspace Disclaimer" },
  { slug: "cookie-policy", label: "Cookie Policy" },
  { slug: "acceptable-use", label: "Acceptable Use Policy" },
];

export function rewriteCmsLinks(html: string): string {
  return html.replace(/href="\/legal\/legal"/gi, 'href="/legal"');
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
