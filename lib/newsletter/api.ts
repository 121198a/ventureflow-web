import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import { cache } from "react";
import {
  ARTICLE_CONFIGS,
  getArticleConfig,
  type ArticleConfig,
} from "./config";
import {
  getArticle as getCuratedArticle,
  type Article,
  type ArticleBlock,
} from "@/lib/newsletter-data";

/**
 * Zod schema for external newsletter article JSON payload.
 * Gracefully handles varied shapes while rejecting malformed inputs.
 */
const ExternalArticleSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  title: z.string().optional(),
  headline: z.string().optional(),
  summary: z.string().optional(),
  blurb: z.string().optional(),
  kicker: z.string().optional(),
  date: z.string().optional(),
  read: z.string().optional(),
  content: z.string().optional(),
  html: z.string().optional(),
  body: z
    .array(
      z.union([
        z.object({
          type: z.literal("p"),
          text: z.string(),
        }),
        z.object({
          type: z.literal("h2"),
          roman: z.string().optional().default("I"),
          text: z.string(),
        }),
        z.object({
          type: z.literal("table"),
          columns: z.tuple([z.string(), z.string()]),
          rows: z.array(z.tuple([z.string(), z.string()])),
        }),
        z.object({
          type: z.literal("quote"),
          text: z.string(),
        }),
        z.object({
          type: z.literal("darkbox"),
          label: z.string(),
          text: z.string(),
        }),
        z.object({
          type: z.literal("cta"),
          heading: z.string().optional(),
          text: z.string(),
          buttonLabel: z.string(),
          note: z.string().optional(),
        }),
        z.object({
          type: z.literal("recap"),
          heading: z.string(),
          items: z.array(
            z.object({
              bold: z.string(),
              rest: z.string(),
            })
          ),
        }),
        z.object({
          type: z.literal("emailCapture"),
          heading: z.string(),
          text: z.string(),
          buttonLabel: z.string(),
        }),
      ])
    )
    .optional(),
});

export type ExternalArticlePayload = z.infer<typeof ExternalArticleSchema>;

export type NewsletterArticleResult = {
  article: Article;
  config: ArticleConfig;
  source: "api" | "curated";
  isFallback: boolean;
  status: "success" | "empty" | "error";
  statusCode?: number;
  errorMessage?: string;
};

/**
 * Sanitizes an HTML string and returns safe paragraphs.
 */
function parseHtmlToBlocks(rawHtml: string): ArticleBlock[] {
  const clean = sanitizeHtml(rawHtml, {
    allowedTags: ["p", "h2", "h3", "b", "strong", "i", "em", "blockquote", "ul", "ol", "li"],
    allowedAttributes: {},
  });

  // Extract clean text paragraphs
  const matches = clean.match(/<(p|h2|blockquote)[^>]*>([\s\S]*?)<\/\1>/gi);
  if (!matches || matches.length === 0) {
    const plain = clean.replace(/<[^>]+>/g, " ").trim();
    return plain ? [{ type: "p", text: plain }] : [];
  }

  const blocks: ArticleBlock[] = [];
  for (const m of matches) {
    const isH2 = /^<h2/i.test(m);
    const isQuote = /^<blockquote/i.test(m);
    const text = m.replace(/<[^>]+>/g, "").trim();
    if (!text) continue;

    if (isH2) {
      blocks.push({ type: "h2", roman: "·", text });
    } else if (isQuote) {
      blocks.push({ type: "quote", text });
    } else {
      blocks.push({ type: "p", text });
    }
  }

  return blocks;
}

/**
 * Fetches and normalizes a newsletter article from the configured remote API.
 * Uses React cache() to deduplicate requests between metadata generation and page render.
 * Gracefully falls back to curated verified dataset if the remote API is
 * unreachable, returns 404/500, or returns invalid content.
 */
export const getNewsletterArticle = cache(async function getNewsletterArticle(
  articleIdOrSlug: string | number,
  optionalSlug?: string
): Promise<NewsletterArticleResult | null> {
  const config =
    getArticleConfig(articleIdOrSlug) ||
    (optionalSlug ? getArticleConfig(optionalSlug) : undefined);

  if (!config) {
    return null;
  }

  const curated = getCuratedArticle(config.articleId) || getCuratedArticle(config.slug);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const res = await fetch(config.apiEndpoint, {
      method: "GET",
      headers: {
        Accept: "application/json, text/html, */*",
        "User-Agent": "Ventureflow-NewsletterService/1.0",
      },
      signal: controller.signal,
      next: { revalidate: 300 },
    });

    clearTimeout(timeoutId);

    if (res.ok) {
      const contentType = res.headers.get("content-type") || "";
      let parsedPayload: ExternalArticlePayload | null = null;
      let htmlContent: string | null = null;

      if (contentType.includes("application/json")) {
        const json = await res.json().catch(() => null);
        const parsed = ExternalArticleSchema.safeParse(json);
        if (parsed.success) {
          parsedPayload = parsed.data;
        }
      } else {
        const text = await res.text().catch(() => "");
        // Only treat as HTML article content if not an empty response
        if (text && text.trim().length > 0 && !text.includes("<!DOCTYPE html>")) {
          htmlContent = text;
        }
      }

      if (parsedPayload || htmlContent) {
        let finalBody: ArticleBlock[] = [];
        if (parsedPayload?.body && parsedPayload.body.length > 0) {
          finalBody = parsedPayload.body as ArticleBlock[];
        } else if (parsedPayload?.content || parsedPayload?.html) {
          finalBody = parseHtmlToBlocks(parsedPayload.content || parsedPayload.html || "");
        } else if (htmlContent) {
          finalBody = parseHtmlToBlocks(htmlContent);
        } else if (curated?.body) {
          finalBody = curated.body;
        }

        const normalizedArticle: Article = {
          id: config.articleId,
          number: config.number,
          slug: config.slug,
          kicker: parsedPayload?.kicker || curated?.kicker || config.kicker,
          title: parsedPayload?.title || curated?.title || config.fallbackTitle,
          headline: parsedPayload?.headline || curated?.headline || config.fallbackHeadline,
          summary: parsedPayload?.summary || curated?.summary || "",
          blurb: parsedPayload?.blurb || curated?.blurb || "",
          date: parsedPayload?.date || curated?.date || "Jul 2026",
          read: parsedPayload?.read || curated?.read || "4 min read",
          body: finalBody.length > 0 ? finalBody : curated?.body,
        };

        return {
          article: normalizedArticle,
          config,
          source: "api",
          isFallback: false,
          status: "success",
          statusCode: res.status,
        };
      }
    }

    // Remote API returned non-200 or empty response — use curated authentic briefing
    if (curated) {
      return {
        article: {
          ...curated,
          id: config.articleId,
          number: config.number,
          slug: config.slug,
        },
        config,
        source: "curated",
        isFallback: true,
        status: res.status === 404 ? "empty" : "error",
        statusCode: res.status,
        errorMessage: `Remote endpoint returned status ${res.status}; served verified briefing.`,
      };
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Fetch failed";
    if (curated) {
      return {
        article: {
          ...curated,
          id: config.articleId,
          number: config.number,
          slug: config.slug,
        },
        config,
        source: "curated",
        isFallback: true,
        status: "error",
        errorMessage: `Network error (${errorMsg}); served verified briefing.`,
      };
    }
  }

  return null;
});

/**
 * Returns all article configurations in ordered sequence (1 through 9).
 */
export function getAllArticleConfigs(): ArticleConfig[] {
  return Object.values(ARTICLE_CONFIGS).sort((a, b) => a.number - b.number);
}
