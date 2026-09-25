/// <reference types="node" />
import test from "node:test";
import assert from "node:assert/strict";
import {
  ARTICLE_CONFIGS,
  NEWSLETTER_API_BASE_URL,
  getArticleConfig,
  getAllArticleConfigs,
} from "../lib/newsletter/config.ts";
import { articles, getArticle } from "../lib/newsletter-data.ts";
import {
  NEWSLETTER_ASSESSMENTS,
  computeReadinessBriefing,
  type AssessmentKey,
} from "../lib/newsletter/assessments.ts";

test("Base API Configuration is configured for production, not localhost", () => {
  assert.ok(
    !NEWSLETTER_API_BASE_URL.includes("localhost"),
    "NEWSLETTER_API_BASE_URL must not be localhost"
  );
  assert.ok(
    NEWSLETTER_API_BASE_URL.startsWith("https://"),
    "NEWSLETTER_API_BASE_URL must use secure HTTPS protocol"
  );
});

test("All 9 articles are mapped to their exact specified remote API endpoints", () => {
  const expectedEndpoints: Record<string, string> = {
    "1": `${NEWSLETTER_API_BASE_URL}/newsletter/article/1`,
    "2": `${NEWSLETTER_API_BASE_URL}/newsletter/article/2/article/interest-isn-t-deals`,
    "3": `${NEWSLETTER_API_BASE_URL}/newsletter/article/3/reopen-cold-leads`,
    "4": `${NEWSLETTER_API_BASE_URL}/newsletter/article/4/updates-win-investors`,
    "5": `${NEWSLETTER_API_BASE_URL}/newsletter/article/5/what-could-kill-it`,
    "6": `${NEWSLETTER_API_BASE_URL}/newsletter/article/6/post-round-ownership`,
    "7": `${NEWSLETTER_API_BASE_URL}/newsletter/article/7/the-number-you-say-first`,
    "8": `${NEWSLETTER_API_BASE_URL}/newsletter/article/8/how-much-runway`,
    "9": `${NEWSLETTER_API_BASE_URL}/newsletter/article/9/you-don-t-graduate-to-the-next-round`,
  };

  const configs = getAllArticleConfigs();
  assert.equal(configs.length, 9, "Must have exactly 9 article configurations");

  for (const [id, expectedUrl] of Object.entries(expectedEndpoints)) {
    const config = ARTICLE_CONFIGS[id];
    assert.ok(config, `Missing config for article ${id}`);
    assert.equal(
      config.apiEndpoint,
      expectedUrl,
      `Article ${id} must map to ${expectedUrl}`
    );
  }
});

test("Canonical frontend routes match /newsletter/article/{id}/{slug} and never generate double slashes //", () => {
  const configs = getAllArticleConfigs();
  for (const c of configs) {
    assert.ok(
      c.frontendPath.startsWith("/newsletter/article/"),
      `Path must start with /newsletter/article/: ${c.frontendPath}`
    );
    assert.ok(
      !c.frontendPath.includes("//"),
      `Path must not contain double slashes //: ${c.frontendPath}`
    );
    assert.equal(
      c.frontendPath,
      `/newsletter/article/${c.articleId}/${c.slug}`
    );
  }
});

test("Article 1 CTA 1 maps to pitch-check and CTA 2 maps to dev-ubverse book-call", () => {
  const c1 = ARTICLE_CONFIGS["1"];
  assert.equal(
    c1.ctaConfig.assessmentEndpoint,
    `${NEWSLETTER_API_BASE_URL}/newsletter/pitch-check`
  );
  assert.ok(
    c1.ctaConfig.howItWorksEndpoint.includes("/newsletter/book-call")
  );

  const ctaAssessment = c1.ctaConfig.ctas.find((c) => c.actionType === "assessment");
  assert.ok(ctaAssessment, "Assessment CTA should exist");
  assert.equal(ctaAssessment!.buttonLabel, "Run the readiness assessment →");

  const ctaPlatform = c1.ctaConfig.ctas.find((c) => c.actionType === "how-it-works");
  assert.ok(ctaPlatform, "Platform CTA should exist");
  assert.equal(ctaPlatform!.buttonLabel, "See how the platform works →");
});

test("Articles 2-9 CTA configurations match all specified requirements", () => {
  // Article 2
  const c2 = ARTICLE_CONFIGS["2"];
  assert.equal(c2.ctaConfig.assessmentEndpoint, `${NEWSLETTER_API_BASE_URL}/newsletter/close-check`);
  assert.equal(c2.ctaConfig.howItWorksEndpoint, `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`);
  assert.equal(c2.ctaConfig.bookCallEndpoint, `${NEWSLETTER_API_BASE_URL}/newsletter/book-call`);

  // Article 3
  const c3 = ARTICLE_CONFIGS["3"];
  assert.equal(c3.ctaConfig.assessmentEndpoint, `${NEWSLETTER_API_BASE_URL}/newsletter/followup-check`);

  // Article 4 (No distinct assessment endpoint)
  const c4 = ARTICLE_CONFIGS["4"];
  assert.equal(c4.ctaConfig.assessmentEndpoint, undefined, "Article 4 must NOT invent an assessment endpoint");
  assert.equal(c4.ctaConfig.howItWorksEndpoint, `${NEWSLETTER_API_BASE_URL}/newsletter/how-it-works`);

  // Article 5
  const c5 = ARTICLE_CONFIGS["5"];
  assert.equal(c5.ctaConfig.assessmentEndpoint, `${NEWSLETTER_API_BASE_URL}/newsletter/risk-check`);

  // Article 6
  const c6 = ARTICLE_CONFIGS["6"];
  assert.equal(c6.ctaConfig.assessmentEndpoint, `${NEWSLETTER_API_BASE_URL}/newsletter/ownership-check`);

  // Article 7
  const c7 = ARTICLE_CONFIGS["7"];
  assert.equal(c7.ctaConfig.assessmentEndpoint, `${NEWSLETTER_API_BASE_URL}/newsletter/valuation-check`);

  // Article 8
  const c8 = ARTICLE_CONFIGS["8"];
  assert.equal(c8.ctaConfig.assessmentEndpoint, `${NEWSLETTER_API_BASE_URL}/newsletter/runway-check`);

  // Article 9
  const c9 = ARTICLE_CONFIGS["9"];
  assert.equal(c9.ctaConfig.assessmentEndpoint, `${NEWSLETTER_API_BASE_URL}/newsletter/stage-check`);
});

test("getArticleConfig and articles registry resolve accurately", () => {
  assert.equal(articles.length, 9, "Articles dataset must have exactly 9 entries");
  const byId = getArticleConfig("1");
  assert.ok(byId);
  assert.equal(byId!.slug, "five-critical-numbers");

  const bySlug = getArticleConfig("five-critical-numbers");
  assert.ok(bySlug);
  assert.equal(bySlug!.articleId, "1");
});

test("All 9 articles have complete body and valid headlines in the dataset", () => {
  for (let i = 1; i <= 9; i++) {
    const art = getArticle(String(i));
    assert.ok(art, `Failed to load article ${i}`);
    assert.equal(art!.id, String(i));
    assert.ok(art!.headline.length > 5, `Article ${i} must have valid headline`);
    assert.ok(art!.body && art!.body.length > 0, `Article ${i} must have body content`);
  }
});

test("Authentic assessments data is loaded with exactly 8 questions per check", () => {
  const assessmentKeys: AssessmentKey[] = [
    "pitchCheck",
    "closeCheck",
    "followupCheck",
    "updateCheck",
    "riskCheck",
    "ownershipCheck",
    "valuationCheck",
    "runwayCheck",
    "stageCheck",
  ];

  for (const k of assessmentKeys) {
    const meta = NEWSLETTER_ASSESSMENTS[k];
    assert.ok(meta, `Missing assessment ${k}`);
    assert.equal(
      meta.questions.length,
      8,
      `Assessment ${k} must have exactly 8 verified questions`
    );

    for (const q of meta.questions) {
      assert.ok(q.cat.length > 0, "Question category required");
      assert.ok(q.q.length > 0, "Question text required");
      assert.ok(q.fix.length > 0, "Question fix advice required");
      assert.ok(q.why.length > 0, "Question diligence why required");
    }
  }
});

test("computeReadinessBriefing computes correct score, tier, and priority action items", () => {
  const pitch = NEWSLETTER_ASSESSMENTS.pitchCheck;
  // All yes answers
  const allYes = { 0: "yes", 1: "yes", 2: "yes", 3: "yes", 4: "yes", 5: "yes", 6: "yes", 7: "yes" } as const;
  const readyResult = computeReadinessBriefing(pitch, allYes);
  assert.equal(readyResult.score, 8);
  assert.equal(readyResult.status, "ready");
  assert.equal(readyResult.priorityItems.length, 0);

  // Mixed answers (4 yes, 2 mid, 2 no)
  const mixed = { 0: "yes", 1: "yes", 2: "yes", 3: "yes", 4: "mid", 5: "mid", 6: "no", 7: "no" } as const;
  const partialResult = computeReadinessBriefing(pitch, mixed);
  assert.equal(partialResult.score, 4);
  assert.equal(partialResult.status, "partial");
  assert.equal(partialResult.priorityItems.length, 4);
  assert.equal(partialResult.priorityItems[0].status, "mid");
});
