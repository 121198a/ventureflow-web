export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; roman: string; text: string }
  | { type: "table"; columns: [string, string]; rows: [string, string][] }
  | { type: "quote"; text: string }
  | { type: "darkbox"; label: string; text: string }
  | {
      type: "cta";
      heading?: string;
      text: string;
      buttonLabel: string;
      note?: string;
    }
  | { type: "recap"; heading: string; items: { bold: string; rest: string }[] }
  | { type: "emailCapture"; heading: string; text: string; buttonLabel: string };

export type Article = {
  slug: string;
  kicker: string;
  title: string;
  blurb: string;
  date: string;
  read: string;
  headline: string;
  summary: string;
  /** Full long-form body, block-by-block. Only populated where the reference
      video actually showed the full article text (see comment on the first
      entry below) — left undefined elsewhere rather than fabricated. */
  body?: ArticleBlock[];
};

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const fiveNumbersBody: ArticleBlock[] = [
  {
    type: "p",
    text: "A founder can survive a hard question. It is much harder to survive sounding unsure about their own numbers.",
  },
  {
    type: "p",
    text: "Investors do not expect every early-stage metric to be perfect. They know young companies are still changing. What they expect is that the founder knows the business beneath the story. In our experience, nearly every first meeting turns on the same five numbers, asked in some form, in some order.",
  },
  {
    type: "p",
    text: "Each one has a ten-second answer. This briefing sets out the five, the format each answer takes, and the one that costs founders the most.",
  },
  { type: "h2", roman: "I", text: "The five, and the answer each requires" },
  {
    type: "p",
    text: "The five below fit almost any early-stage company. The test is not precision to the decimal. The test is whether the answer arrives as one sentence, from memory, in the present tense.",
  },
  {
    type: "p",
    text: "Burn is net cash out per month, this month, not an average from last quarter. Runway is the month you reach zero at current burn, and how the raise moves it. Revenue is the current figure and the growth rate over the last three months; pre-revenue, the same discipline applies to signed pilots and contracted pipeline. Unit economics is what you spend to acquire a customer and when it comes back. Ownership is what you hold today and what you will hold after the round.",
  },
  { type: "p", text: "The same answer, given two ways, leaves two different impressions." },
  {
    type: "table",
    columns: ["Ready answer", "Reaching for the spreadsheet"],
    rows: [
      ["\"Net burn is 85K a month as of July.\"", "\"Somewhere between 80 and 100, roughly.\""],
      [
        "\"We reach zero in March 2028. The round takes us to late 2029.\"",
        "\"We have plenty of runway for now.\"",
      ],
      [
        "\"ARR is 58K, up from 41K over the last quarter.\"",
        "\"Revenue is growing really fast.\"",
      ],
      [
        "\"We spend about 1,200 to acquire and earn it back in seven months.\"",
        "\"CAC is still settling. It depends on the channel.\"",
      ],
    ],
  },
  { type: "h2", roman: "II", text: "The expensive fumble: ownership after the round" },
  {
    type: "p",
    text: "Four of the five describe the business. The fifth describes the deal, and it is the one founders fumble most. Not because the math is hard, but because it is the number founders least want to look at.",
  },
  {
    type: "p",
    text: "An investor hears the fumble differently than the founder intends. Unsure about burn reads as a bookkeeping gap. Unsure about your own ownership after the round reads as a founder who has not done the math on their own deal, and that is the more expensive impression to leave. The answer has a shape, and it can be rehearsed:",
  },
  {
    type: "darkbox",
    label: "Word for word — use as written",
    text: "\"We hold 62 percent today. At the target valuation, with the option pool refresh, this round takes us to 51 percent. We modeled it before we set the terms.\"",
  },
  {
    type: "p",
    text: "The numbers themselves will differ. What carries is the shape: two percentages, the pool accounted for, stated without hesitation. Investors read that as a founder who negotiates from knowledge rather than hope.",
  },
  {
    type: "p",
    text: "Each of the five live as inputs in your dashboard on UBverse, so when an investor asks, the number comes from a live record rather than memory.",
  },
  {
    type: "cta",
    text: "How many of the five could you answer in ten seconds, right now? The assessment checks eight.",
    buttonLabel: "Run the readiness assessment",
    note: "8 questions · 2 minutes · confidential",
  },
  {
    type: "quote",
    text: "\"Unsure about ownership reads as a founder who has not done the math on their own deal.\"",
  },
  { type: "h2", roman: "III", text: "Adapt the five to your model" },
  {
    type: "p",
    text: "The five are a default, not a doctrine. The right set is the five questions your investor is most likely to ask, and that varies by model. What does not vary is the count: five numbers, held from memory, is the standard the room expects.",
  },
  { type: "p", text: "Swap by model, keep the format: one sentence, current period, from memory." },
  {
    type: "table",
    columns: ["Business model", "Add or swap in"],
    rows: [
      ["SaaS", "Net revenue churn, alongside the growth rate"],
      ["Marketplace", "Take rate and GMV, in place of plain revenue"],
      ["Hardware", "Gross margin per unit, alongside acquisition cost"],
      ["Pre-revenue", "Signed pilots and contracted pipeline, in place of ARR"],
    ],
  },
  {
    type: "p",
    text: "The preparation is not performance. A founder who rehearses the five discovers the weak number before the investor does, and a weak number found early becomes a plan instead of a stumble.",
  },
  {
    type: "cta",
    text: "Everything in this briefing lives in one place on UBverse: your five numbers, your documents, and your investor conversations, current before the meeting instead of assembled after it.",
    buttonLabel: "See how the platform works",
    note: "The complete workflow, step by step · 2 minutes",
  },
  {
    type: "recap",
    heading: "If you remember three things",
    items: [
      {
        bold: "Five numbers, ten seconds each.",
        rest: "Burn, runway, revenue and growth, unit economics, ownership after the round.",
      },
      {
        bold: "The format is the tell.",
        rest: "One sentence, current period, from memory. \"It depends\" means not ready.",
      },
      {
        bold: "Ownership is the expensive fumble.",
        rest: "Two percentages, pool included, modeled before the terms were set.",
      },
    ],
  },
  {
    type: "cta",
    heading: "Raising in the next six months?",
    text: "A twenty-minute working session with our capital markets team. Your five numbers, pressure-tested the way an investor would test them.",
    buttonLabel: "Schedule a consultation",
    note: "20 minutes · You keep the ledger either way · No pitch",
  },
  {
    type: "emailCapture",
    heading: "Keep this briefing",
    text: "Receive the written version, with the checklist, as a document.",
    buttonLabel: "Send it to me",
  },
];

const raw: Omit<Article, "slug">[] = [
  {
    kicker: "The Pitch Playbook",
    title: "Five Critical Numbers",
    blurb: "Confidence in your numbers matters more than answering tough questions.",
    date: "Jul 2026",
    read: "4 min read",
    headline: "Five numbers. Ten seconds each.",
    summary:
      "The five questions that arrive in nearly every first meeting, the answer format each one requires, and the number founders fumble most.",
    // Transcribed in full from the reference video (the only supplied source
    // that contains this article's actual body copy) — not fabricated.
    body: fiveNumbersBody,
  },
  {
    kicker: "The Fundraising Playbook",
    title: "Interest Isn't Deals",
    blurb: "A handshake doesn't close a deal — verified details do.",
    date: "Jul 2026",
    read: "4 min read",
    headline: "Interest is not the same as closing",
    summary:
      "The 23-day gap between commitment and funded capital, and the three conditions that decide whether your round pays it.",
  },
  {
    kicker: "The Follow-Up Playbook",
    title: "Reopen Cold Leads",
    blurb: "Why investors go silent — and how to win them back.",
    date: "Jul 2026",
    read: "4 min read",
    headline: "The follow-up that revives a cold investor",
    summary:
      "Why investors go quiet, the one line that reopens a thread, and a before-and-after rewrite of the follow-up most founders send.",
  },
  {
    kicker: "The Investor Update Playbook",
    title: "Updates Win Investors",
    blurb: "Write investor updates that get replies, with a ready-to-use example.",
    date: "Jul 2026",
    read: "4 min read",
    headline: "Your investor update is part of the raise",
    summary:
      "Why a quiet investor is usually a founder who went quiet first, the four lines a good update needs, and a filled-in example you can copy.",
  },
  {
    kicker: "The Risk Playbook",
    title: "What Could Kill It",
    blurb: "Every investor looks for the weakest part of your pitch.",
    date: "Jul 2026",
    read: "4 min read",
    headline: "What breaks this company",
    summary:
      "Why investors go looking for your weakest point, how to find it before they do, and the same risk stated two ways.",
  },
  {
    kicker: "The Ownership Playbook",
    title: "Post-Round Ownership",
    blurb: "Understand dilution before investors ask.",
    date: "Jul 2026",
    read: "4 min read",
    headline: "What this round does to your ownership",
    summary:
      "Why founders hesitate when investors ask about post-round ownership, what belongs in the calculation, and how to answer without reaching for the cap table.",
  },
  {
    kicker: "The Valuation Playbook",
    title: "The Number You Say First",
    blurb: "Why your opening valuation matters.",
    date: "Jul 2026",
    read: "4 min read",
    headline: "The valuation number you should never say first",
    summary:
      "Why your opening valuation matters, how investors interpret an anchor, and how to frame valuation discussions without setting a ceiling.",
  },
  {
    kicker: "The Fundraising Playbook",
    title: "How Much Runway?",
    blurb: "Know what your round needs to achieve.",
    date: "Aug 2026",
    read: "4 min read",
    headline: "How much runway are you actually raising for?",
    summary:
      "Why a month count can misstate what a round will support, what belongs in the model, and how to connect the capital requested to the milestone it must reach.",
  },
  {
    kicker: "The Fundraising Playbook",
    title: "You Don't Graduate to the Next Round",
    blurb: "Know what each round must prove.",
    date: "Aug 2026",
    read: "4 min read",
    headline: "You do not graduate from one round to the next",
    summary:
      "Why funding stages are not automatic promotions, what each stage is expected to prove, and how to decide whether the company is ready to raise again.",
  },
];

export const articles: Article[] = raw.map((a) => ({ ...a, slug: slugify(a.title) }));

export function getArticle(slug: string) {
  return articles.find((a) => a.slug === slug);
}
