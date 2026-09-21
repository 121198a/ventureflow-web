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
  id: string;
  number: number;
  slug: string;
  kicker: string;
  title: string;
  blurb: string;
  date: string;
  read: string;
  headline: string;
  summary: string;
  /** Full long-form body, block-by-block. Populated across all 9 briefings. */
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

const interestIsntDealsBody: ArticleBlock[] = [
  {
    type: "p",
    text: "A verbal commitment is not closed capital. The gap between an investor saying 'we're in' and the funds landing in your account is where rounds stall.",
  },
  {
    type: "p",
    text: "Across hundreds of early-stage rounds, the average gap between commitment and funded capital is 23 days. Without structured closing rails, more than 30% of soft commitments either fall out or require renegotiation.",
  },
  { type: "h2", roman: "I", text: "Why soft circles decay" },
  {
    type: "p",
    text: "Momentum in private raises is perishable. When diligence materials are scattered across email attachments and closing documents aren't pre-drafted, each day of delay introduces reconsiderations, partner vetoes, or shifting macro priorities.",
  },
  {
    type: "table",
    columns: ["What founders hear", "What the round actually requires"],
    rows: [
      ["\"We love the space and want to lead.\"", "Formal lead partner sign-off and executed subscription documents."],
      ["\"Count us in for 250K.\"", "Dependent on a minimum aggregate syndicate close."],
      ["\"We'll send wiring instructions next week.\"", "Pending data room audit and accredited status verification."],
    ],
  },
  {
    type: "darkbox",
    label: "Closing Rule — Operational Discipline",
    text: "\"Never consider a check closed until subscription documents are counter-signed and funds have cleared escrow through a registered broker-dealer.\"",
  },
  { type: "h2", roman: "II", text: "The three conditions that ensure a close" },
  {
    type: "p",
    text: "Closing fast requires three non-negotiable foundations: standardized SAFE or convertible notes with unambiguous terms, verified investor accreditation upfront, and a dedicated closing ledger tracking every allocated dollar in real time.",
  },
  {
    type: "recap",
    heading: "Key Takeaways",
    items: [
      { bold: "Soft circles decay rapidly.", rest: "The 23-day closing window requires aggressive administrative discipline." },
      { bold: "Eliminate document friction.", rest: "Provide a one-click digital signing flow and instant escrow instructions." },
      { bold: "Track in public or private ledger.", rest: "Maintain an immutable record of commitments, signatures, and wires." },
    ],
  },
  {
    type: "cta",
    heading: "Raising in the next six months?",
    text: "A twenty-minute working session with our capital markets team. Your round, mapped across the Closing Ledger — every investor, every open item.",
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

const reopenColdLeadsBody: ArticleBlock[] = [
  {
    type: "p",
    text: "Why investors go silent, the one line that reopens a thread, and a before-and-after rewrite of the follow-up most founders send.",
  },
  {
    type: "p",
    text: "Investors rarely say 'no' outright; they go quiet. A quiet investor isn't necessarily uninterested—they are waiting for verifiable proof that your trajectory is accelerating without them.",
  },
  { type: "h2", roman: "I", text: "The mistake founders make when following up" },
  {
    type: "table",
    columns: ["What founders usually send", "What actually reopens the conversation"],
    rows: [
      ["\"Just checking in to see if you had time to look at our deck.\"", "\"Closed $18K in new contracted ARR this week. Round is now 75% allocated.\""],
      ["\"Wanted to bump this to the top of your inbox.\"", "\"Key customer renewal closed at 140% net expansion. Sharing updated model.\""],
    ],
  },
  {
    type: "darkbox",
    label: "The Reopening Sentence",
    text: "\"We are closing allocation on Friday and wanted to confirm your position before final allocation of the remaining $150K.\"",
  },
  {
    type: "recap",
    heading: "Summary",
    items: [
      { bold: "Provide new signal, not reminders.", rest: "Every message must contain a verifiable metric change or customer win." },
      { bold: "Create factual urgency.", rest: "Reference actual round capacity and allocation deadlines, not artificial pressure." },
    ],
  },
  {
    type: "cta",
    heading: "Need help reviving stalled discussions?",
    text: "Let our capital markets team audit your investor communication pipeline.",
    buttonLabel: "Schedule a consultation",
    note: "20 minutes · Confidential",
  },
];

const updatesWinInvestorsBody: ArticleBlock[] = [
  {
    type: "p",
    text: "Why a quiet investor is usually a founder who went quiet first, the four lines a good update needs, and a filled-in example you can copy.",
  },
  {
    type: "p",
    text: "Regular monthly investor updates are the single highest ROI activity between rounds. Investors back founders who demonstrate predictable cadence, transparency on challenges, and crisp execution against stated goals.",
  },
  { type: "h2", roman: "I", text: "The four non-negotiable sections of an update" },
  {
    type: "table",
    columns: ["Section", "Essential Information"],
    rows: [
      ["1. Highlights", "Top 3 quantitative wins (ARR, pilots, hiring, shipping milestones)."],
      ["2. Lowlights", "The biggest obstacle faced this month and the exact plan to fix it."],
      ["3. Runway & Cash", "Cash in bank, monthly net burn, and zero-cash date."],
      ["4. Asks", "Specific introductions, partner referrals, or advisory needs."],
    ],
  },
  {
    type: "quote",
    text: "\"Consistency in updates turns casual observers into lead investors when you next come to market.\"",
  },
  {
    type: "cta",
    heading: "Automate your investor communications",
    text: "UBverse provides company spaces where updates, data rooms, and cap tables live securely together.",
    buttonLabel: "Explore company spaces",
    note: "Free to set up",
  },
];

const whatCouldKillItBody: ArticleBlock[] = [
  {
    type: "p",
    text: "Why investors go looking for your weakest point, how to find it before they do, and the same risk stated two ways.",
  },
  {
    type: "p",
    text: "Every experienced investor evaluates a pitch by searching for what could kill the company. When founders proactively articulate their existential risks and demonstrate mitigating moats, skepticism turns into conviction.",
  },
  { type: "h2", roman: "I", text: "Articulating risks with command" },
  {
    type: "table",
    columns: ["Defensive / Evasive", "High-Command Candor"],
    rows: [
      ["\"We don't really have direct competitors in this space.\"", "\"Legacy incumbents hold distribution; our wedge is 10x faster implementation at 50% lower TCO.\""],
      ["\"Customer acquisition will scale organically via word of mouth.\"", "\"Blended CAC is currently $1,400; payback period is 6.2 months across verified cohorts.\""],
    ],
  },
  {
    type: "darkbox",
    label: "Diligence Principle",
    text: "\"Admitting the hardest problem your company faces shows you have the strategic clarity required to solve it.\"",
  },
  {
    type: "cta",
    heading: "Prepare your diligence data room",
    text: "Audit your venture disclosures before your first institutional partner meeting.",
    buttonLabel: "Start diligence prep",
    note: "Structured review · 20 min",
  },
];

const postRoundOwnershipBody: ArticleBlock[] = [
  {
    type: "p",
    text: "Why founders hesitate when investors ask about post-round ownership, what belongs in the calculation, and how to answer with confidence without reaching for the cap table.",
  },
  {
    type: "p",
    text: "Cap table dilution math should never be a mystery. Knowing your exact founder equity, post-money SAFE conversion impact, and unallocated option pool expansion gives you negotiating leverage.",
  },
  { type: "h2", roman: "I", text: "The three dilution components" },
  {
    type: "table",
    columns: ["Factor", "Economic Impact"],
    rows: [
      ["Pre-Money SAFE Notes", "Converts at effective cap; dilution shared among existing equity."],
      ["Post-Money SAFE Notes", "Fixes investor ownership percentage, pushing all dilution onto common holders."],
      ["Option Pool Expansion", "Typically 10–15% carved out of pre-money valuation."],
    ],
  },
  {
    type: "darkbox",
    label: "The Ten-Second Ownership Answer",
    text: "\"Founders currently own 68%. Factoring this round and a 10% pool refresh, founder ownership settles at 54%.\"",
  },
  {
    type: "cta",
    heading: "Model your cap table on UBverse",
    text: "Interactive scenario modeling for founders raising priced rounds or convertible notes.",
    buttonLabel: "Open cap table tools",
    note: "Precise dilution math",
  },
];

const theNumberYouSayFirstBody: ArticleBlock[] = [
  {
    type: "p",
    text: "Why your opening valuation matters, how investors interpret an anchor, and how to frame valuation discussions without setting a ceiling.",
  },
  {
    type: "p",
    text: "Valuation anchoring sets the tone for your entire round. Naming an unrealistic figure invites adversarial scrutiny, while failing to anchor lets opportunistic investors dictate punitive terms.",
  },
  { type: "h2", roman: "I", text: "Anchoring to milestones, not aspirations" },
  {
    type: "table",
    columns: ["Weak Anchor", "Milestone-Grounded Range"],
    rows: [
      ["\"We are raising at a $25M valuation because our market is huge.\"", "\"We are raising $2.5M on a $12M–$15M range to reach $3M ARR by Q4.\""],
      ["\"Whatever the market will bear.\"", "\"We've benchmarked against comparable Series Seed financings with similar retention.\""],
    ],
  },
  {
    type: "quote",
    text: "\"A defensible valuation is a function of the milestone the capital unlocks, not founder vanity.\"",
  },
  {
    type: "cta",
    heading: "Benchmark your round",
    text: "Compare valuation ranges with active deals currently raising on UBverse.",
    buttonLabel: "View active offerings",
    note: "Real private market data",
  },
];

const howMuchRunwayBody: ArticleBlock[] = [
  {
    type: "p",
    text: "Why a month count can misstate what a round will support, what belongs in the model, and how to connect the capital requested to the milestone it must reach.",
  },
  {
    type: "p",
    text: "Runway isn't simply cash divided by average burn. It is the duration during which you have sufficient operating capital to achieve the quantifiable milestone that unlocks your next round.",
  },
  { type: "h2", roman: "I", text: "Dynamic runway modeling" },
  {
    type: "table",
    columns: ["Incomplete Calculation", "Defensible Operating Plan"],
    rows: [
      ["Dividing raise amount by last month's net burn.", "Factoring progressive hiring, vendor commitments, and cash collection delays."],
      ["Assuming steady revenue growth from day one.", "Building a 90-day buffer for sales cycle expansion and client pilot delays."],
    ],
  },
  {
    type: "darkbox",
    label: "Runway Formula",
    text: "\"Target runway should equal time to reach milestone + 6 months buffer for next round diligence and close.\"",
  },
  {
    type: "cta",
    heading: "Need a capital model review?",
    text: "Our analysts examine burn rates and runway targets with institutional rigor.",
    buttonLabel: "Book a consultation",
    note: "20 minutes · Confidential",
  },
];

const youDontGraduateBody: ArticleBlock[] = [
  {
    type: "p",
    text: "Why funding stages are not automatic promotions, what each stage is expected to prove, and how to decide whether the company is ready to raise again.",
  },
  {
    type: "p",
    text: "Founders often treat rounds as a conveyor belt: Angel leads to Seed, Seed leads to Series A. In reality, each round is an entirely different test with distinct investor expectations.",
  },
  { type: "h2", roman: "I", text: "What each round must prove" },
  {
    type: "table",
    columns: ["Stage", "Primary Proof Point"],
    rows: [
      ["Friends & Family / Pre-Seed", "The problem is real, painful, and the team has the technical capacity to build the solution."],
      ["Seed / Reg CF", "Initial product in market with measurable engagement and early customer willingness to pay."],
      ["Series A", "Repeatable, scalable go-to-market engine where $1 of sales expenditure predictably yields $3+ of LTV."],
    ],
  },
  {
    type: "quote",
    text: "\"Raising a larger round before proving the current milestone accelerates burn without accelerating value.\"",
  },
  {
    type: "cta",
    heading: "Assess your round readiness",
    text: "Evaluate which regulatory and capital pathway matches your current stage of company development.",
    buttonLabel: "Compare service tiers",
    note: "Reg CF · Reg D · Reg A+",
  },
];

const raw = [
  {
    id: "1",
    number: 1,
    kicker: "The Pitch Playbook",
    title: "Five Critical Numbers",
    blurb: "Confidence in your numbers matters more than answering tough questions.",
    date: "Jul 2026",
    read: "4 min read",
    headline: "Five numbers. Ten seconds each.",
    summary:
      "The five questions that arrive in nearly every first meeting, the answer format each one requires, and the number founders fumble most.",
    body: fiveNumbersBody,
  },
  {
    id: "2",
    number: 2,
    kicker: "The Fundraising Playbook",
    title: "Interest Isn't Deals",
    blurb: "A handshake doesn't close a deal — verified details do.",
    date: "Jul 2026",
    read: "4 min read",
    headline: "Interest is not the same as closing",
    summary:
      "The 23-day gap between commitment and funded capital, and the three conditions that decide whether your round pays it.",
    body: interestIsntDealsBody,
  },
  {
    id: "3",
    number: 3,
    kicker: "The Follow-Up Playbook",
    title: "Reopen Cold Leads",
    blurb: "Why investors go silent — and how to win them back.",
    date: "Jul 2026",
    read: "4 min read",
    headline: "The follow-up that revives a cold investor",
    summary:
      "Why investors go quiet, the one line that reopens a thread, and a before-and-after rewrite of the follow-up most founders send.",
    body: reopenColdLeadsBody,
  },
  {
    id: "4",
    number: 4,
    kicker: "The Investor Update Playbook",
    title: "Updates Win Investors",
    blurb: "Write investor updates that get replies, with a ready-to-use example.",
    date: "Jul 2026",
    read: "4 min read",
    headline: "Your investor update is part of the raise",
    summary:
      "Why silent investors often start with silent founders. Discover the four lines every update needs, plus a real example you can copy.",
    body: updatesWinInvestorsBody,
  },
  {
    id: "5",
    number: 5,
    kicker: "The Risk Playbook",
    title: "What Could Kill It",
    blurb: "Every investor looks for the weakest part of your pitch.",
    date: "Jul 2026",
    read: "4 min read",
    headline: "What breaks this company",
    summary:
      "Why investors go looking for your weakest point, how to find it before they do, and the same risk stated two ways.",
    body: whatCouldKillItBody,
  },
  {
    id: "6",
    number: 6,
    kicker: "The Ownership Playbook",
    title: "Post-Round Ownership",
    blurb: "Understand dilution before investors ask.",
    date: "Jul 2026",
    read: "4 min read",
    headline: "What this round does to your ownership",
    summary:
      "Why founders freeze when asked about post-round ownership. Learn what belongs in the math, and how to answer without opening your cap table.",
    body: postRoundOwnershipBody,
  },
  {
    id: "7",
    number: 7,
    kicker: "The Valuation Playbook",
    title: "The Number You Say First",
    blurb: "Why your opening valuation matters.",
    date: "Jul 2026",
    read: "4 min read",
    headline: "The valuation number you should never say first",
    summary:
      "Why your starting valuation matters and how investors view an anchor. Learn how to discuss price without capping your upside.",
    body: theNumberYouSayFirstBody,
  },
  {
    id: "8",
    number: 8,
    kicker: "The Fundraising Playbook",
    title: "How Much Runway?",
    blurb: "Know what your round needs to achieve.",
    date: "Aug 2026",
    read: "4 min read",
    headline: "How much runway are you actually raising for?",
    summary:
      "Why a simple month count can misstate what a round supports. Learn how to build your model and connect every dollar to a clear milestone.",
    body: howMuchRunwayBody,
  },
  {
    id: "9",
    number: 9,
    kicker: "The Fundraising Playbook",
    title: "You Don't Graduate to the Next Round",
    blurb: "Know what each round must prove.",
    date: "Aug 2026",
    read: "4 min read",
    headline: "You do not graduate from one round to the next",
    summary:
      "Why funding stages are not automatic milestones. Learn what each stage must prove, and how to know when you are ready to raise again.",
    body: youDontGraduateBody,
  },
];

export const articles: Article[] = raw.map((a) => ({
  ...a,
  slug: slugify(a.title),
}));

/**
 * Resolves an article by numeric ID (e.g. "1", 1) or by title slug.
 */
export function getArticle(slugOrId: string | number): Article | undefined {
  const norm = String(slugOrId).toLowerCase().trim();
  return articles.find(
    (a) =>
      a.id === norm ||
      String(a.number) === norm ||
      a.slug === norm ||
      a.slug === norm.replace(/^article-/, "")
  );
}

/**
 * Asynchronously loads article data. Allows future remote API extension with local guarantee.
 */
export async function fetchArticles(): Promise<Article[]> {
  return articles;
}

export async function fetchArticle(slugOrId: string | number): Promise<Article | null> {
  return getArticle(slugOrId) || null;
}

