/**
 * Base configuration and article endpoint registry for UBverse Newsletter.
 *
 * All remote data requests target the production/development API base (defaulting
 * to https://development.unboundxinc.us) and never depend on localhost:3000.
 */

import type { AssessmentKey } from "./assessments";

export const NEWSLETTER_API_BASE_URL =
  process.env.NEXT_PUBLIC_NEWSLETTER_API_BASE_URL ||
  "https://development.unboundxinc.us";

export type ArticleCTA = {
  id: string;
  text: string;
  buttonLabel: string;
  heading?: string;
  note?: string;
  actionType: "assessment" | "briefing" | "how-it-works" | "book-call" | "custom";
  endpoint?: string;
};

export type ArticleConfig = {
  articleId: string;
  number: number;
  slug: string;
  altSlugs?: string[];
  apiEndpoint: string;
  frontendPath: string;
  kicker: string;
  fallbackTitle: string;
  fallbackHeadline: string;
  ctaConfig: {
    assessmentEndpoint?: string;
    assessmentKey?: AssessmentKey;
    howItWorksEndpoint: string;
    bookCallEndpoint: string;
    ctas: ArticleCTA[];
  };
};

export const ARTICLE_CONFIGS: Record<string, ArticleConfig> = {
  "1": {
    articleId: "1",
    number: 1,
    slug: "five-critical-numbers",
    altSlugs: ["article-1"],
    apiEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/article/1`,
    frontendPath: "/newsletter/article/1/five-critical-numbers",
    kicker: "The Pitch Playbook",
    fallbackTitle: "Five Critical Numbers",
    fallbackHeadline: "Five numbers. Ten seconds each.",
    ctaConfig: {
      assessmentEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/pitch-check`,
      assessmentKey: "pitchCheck",
      howItWorksEndpoint: "https://dev-ubverse.unboundxinc.us/newsletter/book-call",
      bookCallEndpoint: "https://dev-ubverse.unboundxinc.us/newsletter/book-call",
      ctas: [
        {
          id: "cta-1-assessment",
          heading: "How many of the five could you answer in ten seconds, right now?",
          text: "The assessment checks eight.",
          buttonLabel: "Run the readiness assessment →",
          note: "8 questions · 2 minutes · confidential",
          actionType: "assessment",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/pitch-check`,
        },
        {
          id: "cta-1-platform",
          text: "Everything in this briefing lives in one place on UBverse: your five numbers, your documents, and your investor conversations, current before the meeting instead of assembled after it.",
          buttonLabel: "See how the platform works →",
          note: "The complete workflow, step by step · 2 minutes",
          actionType: "how-it-works",
          endpoint: "https://dev-ubverse.unboundxinc.us/newsletter/book-call",
        },
        {
          id: "cta-1-consultation",
          heading: "Raising in the next six months?",
          text: "A twenty-minute working session with our capital markets team. Your five numbers, pressure-tested the way an investor would test them.",
          buttonLabel: "Schedule a consultation →",
          note: "20 minutes · You keep the ledger either way · No pitch",
          actionType: "book-call",
          endpoint: "https://dev-ubverse.unboundxinc.us/newsletter/book-call",
        },
      ],
    },
  },
  "2": {
    articleId: "2",
    number: 2,
    slug: "interest-isn-t-deals",
    altSlugs: ["interest-isnt-deals", "article-2"],
    apiEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/article/2/article/interest-isn-t-deals`,
    frontendPath: "/newsletter/article/2/interest-isn-t-deals",
    kicker: "The Fundraising Playbook",
    fallbackTitle: "Interest Isn't Deals",
    fallbackHeadline: "Interest is not the same as closing",
    ctaConfig: {
      assessmentEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/close-check`,
      assessmentKey: "closeCheck",
      howItWorksEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
      bookCallEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
      ctas: [
        {
          id: "cta-2-assessment",
          text: "Evaluate your closing infrastructure across 8 non-negotiable legal and escrow checkpoints.",
          buttonLabel: "Run the readiness assessment →",
          note: "8 questions · 2 minutes · confidential",
          actionType: "assessment",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/close-check`,
        },
        {
          id: "cta-2-briefing",
          text: "Submit your readiness answers to generate an instant institutional diagnostic briefing.",
          buttonLabel: "View my readiness briefing →",
          note: "Instant diagnostic summary with priority actions",
          actionType: "briefing",
        },
        {
          id: "cta-2-platform",
          text: "Discover how UBverse standardizes SAFE instruments, investor accreditation, and live closing ledgers.",
          buttonLabel: "See how the platform works →",
          note: "Institutional closing rails · 2 min",
          actionType: "how-it-works",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
        },
        {
          id: "cta-2-consultation",
          heading: "Raising in the next six months?",
          text: "A twenty-minute working session with our capital markets team. Your round, mapped across the Closing Ledger — every investor, every open item.",
          buttonLabel: "Schedule a consultation →",
          note: "20 minutes · You keep the ledger either way · No pitch",
          actionType: "book-call",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
        },
      ],
    },
  },
  "3": {
    articleId: "3",
    number: 3,
    slug: "reopen-cold-leads",
    altSlugs: ["article-3"],
    apiEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/article/3/reopen-cold-leads`,
    frontendPath: "/newsletter/article/3/reopen-cold-leads",
    kicker: "The Follow-Up Playbook",
    fallbackTitle: "Reopen Cold Leads",
    fallbackHeadline: "The follow-up that revives a cold investor",
    ctaConfig: {
      assessmentEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/followup-check`,
      assessmentKey: "followupCheck",
      howItWorksEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
      bookCallEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
      ctas: [
        {
          id: "cta-3-assessment",
          text: "Check whether your investor communication creates factual urgency or gets archived.",
          buttonLabel: "Run the readiness assessment →",
          note: "8 questions · 2 minutes · confidential",
          actionType: "assessment",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/followup-check`,
        },
        {
          id: "cta-3-briefing",
          text: "View your investor engagement score and diagnostic report.",
          buttonLabel: "View my readiness briefing →",
          actionType: "briefing",
        },
        {
          id: "cta-3-platform",
          text: "See how founders manage deal momentum and follow-up threads on UBverse.",
          buttonLabel: "See how the platform works →",
          actionType: "how-it-works",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
        },
        {
          id: "cta-3-consultation",
          heading: "Need help reviving stalled discussions?",
          text: "Let our capital markets team audit your investor communication pipeline.",
          buttonLabel: "Schedule a consultation →",
          note: "20 minutes · Confidential",
          actionType: "book-call",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
        },
      ],
    },
  },
  "4": {
    articleId: "4",
    number: 4,
    slug: "updates-win-investors",
    altSlugs: ["article-4"],
    apiEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/article/4/updates-win-investors`,
    frontendPath: "/newsletter/article/4/updates-win-investors",
    kicker: "The Investor Update Playbook",
    fallbackTitle: "Updates Win Investors",
    fallbackHeadline: "Your investor update is part of the raise",
    ctaConfig: {
      // Article 4's first CTA has no distinct assessment endpoint specified per instructions.
      howItWorksEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
      bookCallEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
      ctas: [
        {
          id: "cta-4-platform",
          heading: "Automate your investor communications",
          text: "UBverse provides company spaces where updates, data rooms, and cap tables live securely together.",
          buttonLabel: "See how the platform works →",
          note: "Free to set up",
          actionType: "how-it-works",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
        },
        {
          id: "cta-4-briefing",
          text: "Review your update cadence and reporting readiness with our structured briefing tool.",
          buttonLabel: "View my readiness briefing →",
          actionType: "briefing",
        },
        {
          id: "cta-4-consultation",
          heading: "Want help designing your monthly investor memo?",
          text: "Connect with our team to establish an investor update framework that keeps LPs engaged.",
          buttonLabel: "Schedule a consultation →",
          note: "20 minutes · Confidential",
          actionType: "book-call",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
        },
      ],
    },
  },
  "5": {
    articleId: "5",
    number: 5,
    slug: "what-could-kill-it",
    altSlugs: ["article-5"],
    apiEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/article/5/what-could-kill-it`,
    frontendPath: "/newsletter/article/5/what-could-kill-it",
    kicker: "The Risk Playbook",
    fallbackTitle: "What Could Kill It",
    fallbackHeadline: "What breaks this company",
    ctaConfig: {
      assessmentEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/risk-check`,
      assessmentKey: "riskCheck",
      howItWorksEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
      bookCallEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
      ctas: [
        {
          id: "cta-5-assessment",
          heading: "Prepare your diligence data room",
          text: "Audit your venture disclosures before your first institutional partner meeting.",
          buttonLabel: "Run the readiness assessment →",
          note: "Structured review · 20 min",
          actionType: "assessment",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/risk-check`,
        },
        {
          id: "cta-5-briefing",
          text: "Get your custom risk mitigation briefing based on institutional diligence criteria.",
          buttonLabel: "View my readiness briefing →",
          actionType: "briefing",
        },
        {
          id: "cta-5-platform",
          text: "Explore how UBverse structures disclosures and diligence Q&A for high-growth offerings.",
          buttonLabel: "See how the platform works →",
          actionType: "how-it-works",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
        },
        {
          id: "cta-5-consultation",
          heading: "Need diligence advisory?",
          text: "Schedule a 20-minute working session with our team to review your risk disclosures.",
          buttonLabel: "Schedule a consultation →",
          note: "20 minutes · Confidential",
          actionType: "book-call",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
        },
      ],
    },
  },
  "6": {
    articleId: "6",
    number: 6,
    slug: "post-round-ownership",
    altSlugs: ["article-6"],
    apiEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/article/6/post-round-ownership`,
    frontendPath: "/newsletter/article/6/post-round-ownership",
    kicker: "The Ownership Playbook",
    fallbackTitle: "Post-Round Ownership",
    fallbackHeadline: "What this round does to your ownership",
    ctaConfig: {
      assessmentEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/ownership-check`,
      assessmentKey: "ownershipCheck",
      howItWorksEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
      bookCallEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
      ctas: [
        {
          id: "cta-6-assessment",
          heading: "Model your cap table on UBverse",
          text: "Interactive scenario modeling for founders raising priced rounds or convertible notes.",
          buttonLabel: "Run the readiness assessment →",
          note: "Precise dilution math",
          actionType: "assessment",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/ownership-check`,
        },
        {
          id: "cta-6-briefing",
          text: "Generate your post-round ownership and pool refresh diagnostic briefing.",
          buttonLabel: "View my readiness briefing →",
          actionType: "briefing",
        },
        {
          id: "cta-6-platform",
          text: "See how cap tables and convertible notes convert in real-time on UBverse.",
          buttonLabel: "See how the platform works →",
          actionType: "how-it-works",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
        },
        {
          id: "cta-6-consultation",
          heading: "Cap table advisory session",
          text: "Review SAFE conversion scenarios and option pool expansion with a capital markets analyst.",
          buttonLabel: "Schedule a consultation →",
          note: "20 minutes · Confidential",
          actionType: "book-call",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
        },
      ],
    },
  },
  "7": {
    articleId: "7",
    number: 7,
    slug: "the-number-you-say-first",
    altSlugs: ["article-7"],
    apiEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/article/7/the-number-you-say-first`,
    frontendPath: "/newsletter/article/7/the-number-you-say-first",
    kicker: "The Valuation Playbook",
    fallbackTitle: "The Number You Say First",
    fallbackHeadline: "The valuation number you should never say first",
    ctaConfig: {
      assessmentEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/valuation-check`,
      assessmentKey: "valuationCheck",
      howItWorksEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
      bookCallEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
      ctas: [
        {
          id: "cta-7-assessment",
          heading: "Benchmark your round",
          text: "Compare valuation ranges with active deals currently raising on UBverse.",
          buttonLabel: "Run the readiness assessment →",
          note: "Real private market data",
          actionType: "assessment",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/valuation-check`,
        },
        {
          id: "cta-7-briefing",
          text: "Receive your valuation anchoring diagnostic briefing.",
          buttonLabel: "View my readiness briefing →",
          actionType: "briefing",
        },
        {
          id: "cta-7-platform",
          text: "Learn how UBverse structures milestone-anchored terms for institutional leads.",
          buttonLabel: "See how the platform works →",
          actionType: "how-it-works",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
        },
        {
          id: "cta-7-consultation",
          heading: "Valuation benchmark review",
          text: "Review recent round comps and valuation range defensibility with our team.",
          buttonLabel: "Schedule a consultation →",
          note: "20 minutes · Confidential",
          actionType: "book-call",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
        },
      ],
    },
  },
  "8": {
    articleId: "8",
    number: 8,
    slug: "how-much-runway",
    altSlugs: ["article-8"],
    apiEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/article/8/how-much-runway`,
    frontendPath: "/newsletter/article/8/how-much-runway",
    kicker: "The Fundraising Playbook",
    fallbackTitle: "How Much Runway?",
    fallbackHeadline: "How much runway are you actually raising for?",
    ctaConfig: {
      assessmentEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/runway-check`,
      assessmentKey: "runwayCheck",
      howItWorksEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
      bookCallEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
      ctas: [
        {
          id: "cta-8-assessment",
          heading: "Need a capital model review?",
          text: "Our analysts examine burn rates and runway targets with institutional rigor.",
          buttonLabel: "Run the readiness assessment →",
          note: "20 minutes · Confidential",
          actionType: "assessment",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/runway-check`,
        },
        {
          id: "cta-8-briefing",
          text: "Review your milestone-to-burn buffer diagnostic.",
          buttonLabel: "View my readiness briefing →",
          actionType: "briefing",
        },
        {
          id: "cta-8-platform",
          text: "See how founders align runway targets with round allocations on UBverse.",
          buttonLabel: "See how the platform works →",
          actionType: "how-it-works",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
        },
        {
          id: "cta-8-consultation",
          heading: "Capital modeling session",
          text: "Stress test your burn, zero-cash date, and milestone timing before pitching.",
          buttonLabel: "Schedule a consultation →",
          note: "20 minutes · Confidential",
          actionType: "book-call",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
        },
      ],
    },
  },
  "9": {
    articleId: "9",
    number: 9,
    slug: "you-don-t-graduate-to-the-next-round",
    altSlugs: ["you-dont-graduate-to-the-next-round", "article-9"],
    apiEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/article/9/you-don-t-graduate-to-the-next-round`,
    frontendPath: "/newsletter/article/9/you-don-t-graduate-to-the-next-round",
    kicker: "The Fundraising Playbook",
    fallbackTitle: "You Don't Graduate to the Next Round",
    fallbackHeadline: "You do not graduate from one round to the next",
    ctaConfig: {
      assessmentEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/stage-check`,
      assessmentKey: "stageCheck",
      howItWorksEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
      bookCallEndpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
      ctas: [
        {
          id: "cta-9-assessment",
          heading: "Assess your round readiness",
          text: "Evaluate which regulatory and capital pathway matches your current stage of company development.",
          buttonLabel: "Run the readiness assessment →",
          note: "Reg CF · Reg D · Reg A+",
          actionType: "assessment",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/stage-check`,
        },
        {
          id: "cta-9-briefing",
          text: "Generate your round proof and stage qualification diagnostic report.",
          buttonLabel: "View my readiness briefing →",
          actionType: "briefing",
        },
        {
          id: "cta-9-platform",
          text: "Discover how UBverse navigates exemptions and investor syndicates across stages.",
          buttonLabel: "See how the platform works →",
          actionType: "how-it-works",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`,
        },
        {
          id: "cta-9-consultation",
          heading: "Exemption & stage consultation",
          text: "Evaluate Reg CF, Reg D 506(c), or institutional syndicates with our team.",
          buttonLabel: "Schedule a consultation →",
          note: "20 minutes · Confidential",
          actionType: "book-call",
          endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`,
        },
      ],
    },
  },
};

/**
 * Normalizes an identifier (ID or slug) to find the matching article config.
 */
export function getArticleConfig(
  idOrSlug: string | number
): ArticleConfig | undefined {
  const norm = String(idOrSlug).toLowerCase().trim();

  // 1. Direct key match (e.g. "1")
  if (ARTICLE_CONFIGS[norm]) {
    return ARTICLE_CONFIGS[norm];
  }

  // 2. Slug or altSlug match
  for (const config of Object.values(ARTICLE_CONFIGS)) {
    if (
      config.slug === norm ||
      config.altSlugs?.includes(norm) ||
      config.articleId === norm ||
      `article-${config.articleId}` === norm
    ) {
      return config;
    }
  }

  return undefined;
}

/**
 * Returns all article configurations in ordered sequence (1 through 9).
 */
export function getAllArticleConfigs(): ArticleConfig[] {
  return Object.values(ARTICLE_CONFIGS).sort((a, b) => a.number - b.number);
}

