import type { BlogPost, CuratedTrack, BlogCategory } from "@/types/blog";

export const authors = {
  maneesh: {
    name: "Maneesh Awasthi",
    role: "Co-Founder & CEO",
    avatar: "/image/about/1.jpeg",
    bio: "Over 20 years in institutional finance across equities, derivatives, and capital markets. Formerly co-founded a retail brokerage.",
  },
  arnav: {
    name: "Arnav Awasthi",
    role: "Co-Founder & Head of Product",
    avatar: "/image/about/2.jpeg",
    bio: "Aerospace engineer turned fintech product architect. Focused on the verifiable record-keeping layer for retail and venture markets.",
  },
  chetan: {
    name: "Chetan Chauhan",
    role: "Lead Investment Analyst",
    avatar: "/image/about/3.jpeg",
    bio: "Specializes in early-stage venture memo architecture, unit economics teardowns, and market horizon tracking.",
  },
  nimisha: {
    name: "Nimisha Pathar",
    role: "Staff Product Designer",
    avatar: "/image/about/4.jpeg",
    bio: "Crafts high-density financial interfaces and design systems at UnBound X with an obsession for clarity and signal.",
  },
  dinesh: {
    name: "Dinesh Pathak",
    role: "Principal Systems Engineer",
    avatar: "/image/about/5.jpeg",
    bio: "Distributed systems and real-time ledger engineer. Previously built high-throughput order matching and settlement engines.",
  },
};

export const blogPosts: BlogPost[] = [
  {
    slug: "five-critical-numbers",
    title: "Five Critical Numbers: The Five Questions Every Founder Fumbles in the First Meeting",
    subtitle: "Confidence in your numbers matters more than answering tough questions.",
    summary:
      "Investors don't expect every early-stage metric to be flawless. What they expect is that the founder knows the business beneath the narrative. In our experience, nearly every meeting turns on five numbers.",
    category: "Founders",
    tag: "The Pitch Playbook",
    date: "Sep 2026",
    readTime: "6 min read",
    coverImage: "/images/newsletter-hero.jpg",
    author: authors.maneesh,
    featured: true,
    trending: false,
    editorialPick: true,
    keyStats: [
      { label: "Target Response Time", value: "10 sec", change: "From memory" },
      { label: "Core Founder Metrics", value: "5", change: "Non-negotiable" },
      { label: "Dilution Fumble Rate", value: "68%", change: "Post-round equity" },
    ],
    body: [
      {
        type: "p",
        text: "A founder can survive a hard question about competitive dynamics or macro headwinds. It is much harder to survive sounding unsure about their own numbers.",
      },
      {
        type: "p",
        text: "Investors do not expect every early-stage metric to be perfect. They know young companies are in flux. What they demand is that the founder knows the arithmetic of their own company. In institutional capital meetings, nearly every initial session turns on the exact same five numbers, asked in some sequence, in some variation.",
      },
      {
        type: "callout",
        title: "The Standard",
        text: "The test is not precision to the fifth decimal. The test is whether the answer arrives as one single sentence, from memory, in the present tense, without opening a spreadsheet.",
        variant: "blue",
      },
      {
        type: "h2",
        text: "The Five Core Numbers, and What Each Requires",
        id: "the-five-core-numbers",
      },
      {
        type: "p",
        text: "Burn is net cash out per month right now—not an optimistic average from Q1. Runway is the exact month you reach zero cash at current burn, and how this round shifts it. Revenue is your current ARR and trailing 90-day growth; pre-revenue, this means signed LOIs and contracted pipeline. Unit economics is what you spend to acquire a qualified customer (CAC) and how many months until payback. Ownership is what you hold today and what you retain after the round closes.",
      },
      {
        type: "table",
        columns: ["Ready Answer (Immediate Signal)", "Reaching for the Spreadsheet"],
        rows: [
          [
            '"Net burn is $85K/month as of August."',
            '"Somewhere between $80K and $100K, roughly."',
          ],
          [
            '"We reach zero in March 2027; this round extends to Q4 2028."',
            '"We have plenty of runway for now."',
          ],
          [
            '"ARR is $58K, up 38% over the trailing quarter."',
            '"Revenue is growing really fast."',
          ],
          [
            '"We spend $1,200 to acquire and recover it within 7 months."',
            '"CAC is still settling depending on channel."',
          ],
          [
            '"We hold 62% today; at our target terms, this round leaves us at 51%."',
            '"Our lawyers will model the cap table once the lead commits."',
          ],
        ],
      },
      {
        type: "h2",
        text: "The Expensive Fumble: Ownership After the Round",
        id: "the-expensive-fumble",
      },
      {
        type: "p",
        text: "Four of the five describe operational health. The fifth describes the deal itself—and it is the one founders fumble most frequently. Not because the arithmetic is difficult, but because dilution is the number founders least enjoy confronting.",
      },
      {
        type: "quote",
        text: "Unsure about burn reads as a bookkeeping gap. Unsure about post-round ownership reads as a founder who has not done the math on their own equity, and that is a far more expensive impression to leave.",
        citation: "Maneesh Awasthi, Co-Founder & CEO",
      },
      {
        type: "callout",
        title: "Word for word — use as written",
        text: '"We hold 62 percent today. At our target valuation, with an unallocated option pool refresh of 10 percent, this round takes our founding team to 51 percent. We modeled every permutation before circulating terms."',
        variant: "dark",
      },
      {
        type: "recap",
        heading: "If you remember three things from this playbook",
        items: [
          {
            bold: "Five numbers, ten seconds each.",
            rest: "Burn, runway, revenue growth, unit economics payback, and post-round equity.",
          },
          {
            bold: "The format is the tell.",
            rest: 'One concise sentence, current period, from memory. "It depends" signals unpreparedness.',
          },
          {
            bold: "Ownership cannot be outsourced.",
            rest: "Two explicit percentages, option pool accounted for, modeled before term sheets arrive.",
          },
        ],
      },
    ],
  },
  {
    slug: "architecture-of-a-verified-thesis",
    title: "The Architecture of a Verified Thesis: Why Public Market Accountability Beats Social Hype",
    subtitle: "Turning market claims into an immutable public ledger of target, horizon, and outcome.",
    summary:
      "Everyone online claims to have bought the bottom and sold the top. None of them show a verified paper trail. How UnBound X separates real investment skill from retrospective storytelling.",
    category: "Thesis",
    tag: "Market Horizons",
    date: "Sep 2026",
    readTime: "5 min read",
    coverImage: "/images/hero-laptop.jpg",
    author: authors.arnav,
    featured: false,
    trending: true,
    editorialPick: true,
    keyStats: [
      { label: "Verified Claims Tracked", value: "24,800+", change: "+14% MoM" },
      { label: "Horizon Hit Rate", value: "54.2%", change: "Transparent" },
      { label: "Hindsight Revisions", value: "0", change: "Immutable" },
    ],
    body: [
      {
        type: "p",
        text: "Financial social media is plagued by hindsight bias. A commentator posts twelve contradictory views across six months, deletes the nine that collapsed, and pins the three that hit as proof of prophetic foresight.",
      },
      {
        type: "p",
        text: "At UnBound X, we believe real market reputation should be earned the same way institutional track records are built: on an immutable, time-stamped ledger with defined entry prices, explicit target valuations, and hard horizon dates.",
      },
      {
        type: "callout",
        title: "The Three Anatomy Pillars of a Real Thesis",
        text: "1. Defined Entry Point (live market execution price at publication)\n2. Quantified Target Price & Rationale (explicit fundamental or technical catalyst)\n3. Explicit Horizon Date (the market must settle the proposition hit or miss)",
        variant: "signal",
      },
      {
        type: "h2",
        text: "The NVDA Case Study: Setting the Bar",
        id: "the-nvda-case-study",
      },
      {
        type: "p",
        text: "Consider a member who posted a Long NVDA thesis entered at $219.86 with a target of $260.00 by December 2026. The platform locks that thesis into the public record. There is no editing the price target after earnings; there is no shifting the horizon when volatility strikes.",
      },
      {
        type: "quote",
        text: "When an investment claim has an immutable timestamp and a non-negotiable settlement date, social noise collapses into verified market signal.",
        citation: "Arnav Awasthi, Head of Product",
      },
      {
        type: "checklist",
        heading: "Audit Your Thesis Before Publishing",
        items: [
          "Is your target price linked to a verifiable multiple or discounted cash flow milestone?",
          "Does your horizon provide sufficient duration for the catalyst to materialize?",
          "Have you documented the failure condition that invalidates the premise early?",
          "Is the entry point matched to live consolidated market feed quotes?",
        ],
      },
    ],
  },
  {
    slug: "interest-isnt-deals",
    title: "Interest Isn't Deals: Bridging the 23-Day Gap Between Term Sheets and Wired Capital",
    subtitle: "A handshake doesn't close a venture round — verified documentation does.",
    summary:
      "The average seed and Series A round spends 23 agonizing days in legal purgatory between handshake commitment and money in the bank. Here is how founders eliminate the three fatal bottlenecks.",
    category: "Ventures",
    tag: "The Fundraising Playbook",
    date: "Aug 2026",
    readTime: "5 min read",
    coverImage: "/images/growth-session.jpg",
    author: authors.maneesh,
    featured: false,
    trending: true,
    editorialPick: false,
    keyStats: [
      { label: "Average Settlement Gap", value: "23 Days", change: "Pre-UBverse" },
      { label: "Slipped Soft Commits", value: "31%", change: "Unoptimized deals" },
      { label: "Closing Acceleration", value: "4.2x", change: "With clean data room" },
    ],
    body: [
      {
        type: "p",
        text: "There is a dangerous euphoria that overtakes founders the morning a lead partner says 'we are in for the round.' Founders relax their diligence pipeline, stop booking intro calls, and inform their team that the raise is effectively finished.",
      },
      {
        type: "p",
        text: "Until the subscription agreements are counter-signed and funds clear escrow, you have an expression of enthusiasm, not a funded balance sheet.",
      },
      {
        type: "h2",
        text: "The Three Conditions That Kill Slipped Commits",
        id: "three-conditions",
      },
      {
        type: "p",
        text: "1. Data Room Discrepancies: When cap tables don't reconcile with historical SAFEs, or customer contracts lack signed addendums, legal counsels halt paperwork.\n2. Side-Letter Creep: Minority angels requesting pro-rata rights or board observer seats after the lead terms are distributed.\n3. Escrow Coordination Delay: Disorganized banking instructions and KYC verifications holding back multi-party syndicates.",
      },
      {
        type: "callout",
        title: "How UBverse Eliminates the Friction",
        text: "By maintaining real-time compliance rails, verified accredited accreditation checks, and automated document generation on UBverse, rounds close in days rather than month-long legal marathons.",
        variant: "blue",
      },
    ],
  },
  {
    slug: "post-round-ownership-dilution",
    title: "Post-Round Ownership: Why Dilution Math Can't Wait for the Lawyers",
    subtitle: "Understand equity math, option pool refreshes, and unallocated SAFEs before investors ask.",
    summary:
      "Why founders hesitate when investors ask about post-round ownership, what belongs in the calculation, and how to answer with confidence without reaching for a calculator.",
    category: "Founders",
    tag: "Cap Table Masterclass",
    date: "Aug 2026",
    readTime: "7 min read",
    coverImage: "/images/life-craft.jpg",
    author: authors.chetan,
    featured: false,
    trending: false,
    editorialPick: true,
    keyStats: [
      { label: "Pre-money Pool Refresh", value: "10-15%", change: "Typical investor ask" },
      { label: "Founder Dilution Delta", value: "4-7%", change: "Post-closing surprise" },
    ],
    body: [
      {
        type: "p",
        text: "Most founders think dilution is simple: if you sell 20% of your company for $2 million at an $8 million pre-money valuation, you own 80% afterwards. In the real world of post-money SAFEs and unallocated option pools, this simplistic math almost never holds.",
      },
      {
        type: "p",
        text: "Lead investors routinely mandate that an unallocated employee incentive pool (typically 10% to 15%) be created immediately prior to the round closing. If that pool is carved out of the pre-money valuation, the dilution is borne 100% by the existing founders, not the new incoming money.",
      },
      {
        type: "quote",
        text: "Negotiating pre-money vs. post-money option pool expansion is worth more to a founder's ultimate exit proceeds than half a million dollars of headline valuation.",
        citation: "Chetan Chauhan, Lead Investment Analyst",
      },
      {
        type: "recap",
        heading: "The Essential Cap Table Checklist",
        items: [
          {
            bold: "Model unexercised options.",
            rest: "Ensure all granted vs. unvested equity grants are accounted for on a fully-diluted basis.",
          },
          {
            bold: "Clarify post-money SAFE conversion sequencing.",
            rest: "Check whether subsequent notes dilute earlier notes or dilute common stock alone.",
          },
          {
            bold: "Know your final number.",
            rest: "Never leave the investor meeting without confirming the post-closing founder percentage.",
          },
        ],
      },
    ],
  },
  {
    slug: "collaborative-due-diligence-in-spaces",
    title: "Collaborative Due Diligence: Why High-Signal Angels Are Moving to Spaces",
    subtitle: "How decentralized investor communities pool insights, research, and capital without noise.",
    summary:
      "Solo angel investing is tough and disconnected, while group chats get messy fast. Inside Spaces, accredited investors write shared memos, test founder assumptions, and co-invest together.",
    category: "UBverse",
    tag: "Spaces & Syndicates",
    date: "Aug 2026",
    readTime: "5 min read",
    coverImage: "/images/life-studio.jpg",
    author: authors.arnav,
    featured: false,
    trending: true,
    editorialPick: true,
    keyStats: [
      { label: "Active Investor Spaces", value: "320+", change: "Vetted rooms" },
      { label: "Average Co-diligence Time", value: "4.8 Days", change: "-60% vs solo" },
      { label: "Syndicate Fill Rate", value: "92%", change: "On platform" },
    ],
    body: [
      {
        type: "p",
        text: "Individual investors historically faced an asymmetric dilemma: venture funds had legions of associates to dissect technical architecture, customer references, and regulatory filings, while individual angels had an evening to skim a 15-page slide deck.",
      },
      {
        type: "p",
        text: "Spaces on UnBound X solves this structural disadvantage. By bringing domain specialists—software architects, healthcare operators, fintech CFOs—into private, structured diligence rooms, collective intelligence surfaces insights no solo investor could uncover.",
      },
      {
        type: "callout",
        title: "How Spaces Works",
        text: "Members share structured investment memos, submit diligence queries directly to founders, vote on thesis viability, and coordinate allocation tranches directly into compliant SPVs.",
        variant: "blue",
      },
    ],
  },
  {
    slug: "the-valuation-anchor-trap",
    title: "The Valuation Anchor Trap: The Number You Should Never Say First in a Seed Round",
    subtitle: "Why opening anchors limit your upside and how to discuss terms without setting a ceiling.",
    summary:
      "Prematurely throwing out a hard valuation number either prices you out of conservative syndicates or caps competitive momentum from aggressive leads. Here is the framework for guiding investor expectations.",
    category: "Investing",
    tag: "The Valuation Playbook",
    date: "Jul 2026",
    readTime: "6 min read",
    coverImage: "/images/life-remote.jpg",
    author: authors.maneesh,
    featured: false,
    trending: false,
    editorialPick: false,
    keyStats: [
      { label: "Premature Anchor Loss", value: "-22%", change: "Average round pricing" },
      { label: "Milestone-Linked Pricing", value: "3.1x", change: "More competitive bids" },
    ],
    body: [
      {
        type: "p",
        text: "In behavioral finance, the anchor effect is well-documented: the first specific number placed on the table disproportionately biases all subsequent counter-proposals.",
      },
      {
        type: "p",
        text: "When a founder announces 'we are raising $3 million at a $15 million pre-money valuation,' they believe they are projecting confidence. In reality, they have done two counterproductive things: set an absolute ceiling on their valuation upside and created an immediate filter that knocks out pragmatic seed funds.",
      },
      {
        type: "quote",
        text: "You do not set the price of your round by stating a number; you set it by orchestrating competitive timelines that force lead investors to make their best offer first.",
        citation: "Maneesh Awasthi, Co-Founder & CEO",
      },
    ],
  },
  {
    slug: "what-breaks-this-company",
    title: "What Breaks This Company: Finding Your Pitch's Fatal Flaw Before Investors Do",
    subtitle: "Every seasoned investor looks for the weakest link in your model. State it before they find it.",
    summary:
      "Weak founders try to hide real risks. Strong founders name the biggest threats early and explain exactly how their product and operations will handle them.",
    category: "Founders",
    tag: "Risk Analysis",
    date: "Jul 2026",
    readTime: "5 min read",
    coverImage: "/images/growth-session.jpg",
    author: authors.chetan,
    featured: false,
    trending: true,
    editorialPick: false,
    body: [
      {
        type: "p",
        text: "When an experienced investor listens to an early-stage presentation, they are not merely tallying positive growth signals. They are actively searching for the vulnerability that could wipe out the investment entirely.",
      },
      {
        type: "p",
        text: "If the founder glosses over that vulnerability, the investor assumes either negligence or deceit. But when a founder proactively names the risk with precision, the dynamic shifts from adversarial scrutiny to collaborative problem-solving.",
      },
    ],
  },
  {
    slug: "reg-d-506b-vs-regulation-cf",
    title: "Reg D 506(b) vs. Regulation CF: Navigating Compliant Capital Formation on UBverse",
    subtitle: "The strategic differences between private placement syndicates and public retail offerings.",
    summary:
      "Your choice between Rule 506(b), 506(c), and Regulation CF sets key fundraising rules. It decides if you can pitch publicly, how much money you can raise, and what reports you must share with investors.",
    category: "Ventures",
    tag: "Regulatory Frameworks",
    date: "Jul 2026",
    readTime: "7 min read",
    coverImage: "/images/newsletter-hero.jpg",
    author: authors.maneesh,
    featured: false,
    trending: false,
    editorialPick: true,
    keyStats: [
      { label: "Reg CF Annual Cap", value: "$5 Million", change: "SEC Limit" },
      { label: "506(b) Public Solicitation", value: "Prohibited", change: "Existing relationships" },
      { label: "506(c) Verification", value: "100% Accredited", change: "Third-party audit" },
    ],
    body: [
      {
        type: "p",
        text: "Capital formation in the modern era provides founders with unprecedented flexibility—if they understand the SEC statutory exemptions governing each pathway.",
      },
      {
        type: "p",
        text: "On the UBverse platform, offerings are structured to accommodate both private accredited placements (Reg D) and community-driven crowdfunding (Reg CF). Understanding which pathway matches your company's stage and stakeholder base is the first strategic hurdle.",
      },
    ],
  },
  {
    slug: "senior-by-default-culture",
    title: "Senior by Default: How Our Engineering Team Ships Financial Systems with High Trust",
    subtitle: "Fewer people, higher context, real ownership. Inside UnBound X's remote-first product culture.",
    summary:
      "We avoid deep corporate layers and give quality work dedicated support. Here is how our small senior team ships reliable financial systems faster than larger teams.",
    category: "Craft & Culture",
    tag: "Engineering Culture",
    date: "Jun 2026",
    readTime: "6 min read",
    coverImage: "/images/life-craft.jpg",
    author: authors.nimisha,
    featured: false,
    trending: false,
    editorialPick: false,
    body: [
      {
        type: "p",
        text: "In tech companies that scale prematurely, engineers spend more time updating sprint tickets and attending status ceremonies than writing code or profiling memory leaks.",
      },
      {
        type: "p",
        text: "At UnBound X, our careers philosophy is simple: 'Ownership, not tickets.' We hire senior operators who take a customer problem from first whiteboard diagram to production release, monitor its telemetry, and obsess over performance budgets.",
      },
      {
        type: "quote",
        text: "Craft is not an afterthought we squeeze in before launch; craft is the product. When building financial platforms where people put real money and reputations on the line, every millisecond and every animation curve communicates trustworthiness.",
        citation: "Nimisha Pathar, Staff Product Designer",
      },
    ],
  },
  {
    slug: "the-cost-of-jitter",
    title: "The Cost of Jitter: Building Sub-50ms Reactive Interfaces for Real-Time Cap Tables",
    subtitle: "Behind the frontend engineering decisions powering UnBound X's interactive ledgers.",
    summary:
      "When users drag allocation sliders or model dilution scenarios, any UI lag erodes confidence in the underlying arithmetic. Here is how we engineered frictionless 60fps reactivity in Next.js and React 19.",
    category: "Craft & Culture",
    tag: "Systems & Performance",
    date: "Jun 2026",
    readTime: "6 min read",
    coverImage: "/images/hero-laptop.jpg",
    author: authors.dinesh,
    featured: false,
    trending: false,
    editorialPick: false,
    body: [
      {
        type: "p",
        text: "Financial software often feels sluggish because developers treat calculation engines and DOM rendering as decoupled steps. When modeling complex cap tables with fifteen SAFE note tranches, recalculating ownership percentages during drag interactions can trigger costly layout thrashing.",
      },
      {
        type: "p",
        text: "We leveraged optimized memoization matrices, hardware-accelerated transforms, and React 19 concurrent transitions to guarantee that user interactions never drop below 60 frames per second on both desktop workstations and mobile devices.",
      },
    ],
  },
];

export const curatedTracks: CuratedTrack[] = [
  {
    id: "cap-table",
    title: "Cap Table Mastery",
    description: "Understand employee stock pools, SAFE conversions, and how to avoid surprise dilution before signing.",
    slug: "post-round-ownership-dilution",
    iconName: "PieChart",
    badge: "Essential",
    ctaText: "Explore guide",
  },
  {
    id: "thesis-record",
    title: "Thesis Verification",
    description: "Build a verified public record for your market forecasts with locked target prices and fixed dates.",
    slug: "architecture-of-a-verified-thesis",
    iconName: "TrendingUp",
    badge: "Reputation",
    ctaText: "Read thesis blueprint",
  },
  {
    id: "pitch-playbook",
    title: "The Pitch Playbook",
    description: "Master the 5 core numbers every startup founder should be able to answer from memory in seconds.",
    slug: "five-critical-numbers",
    iconName: "FileCheck",
    badge: "Fundraising",
    ctaText: "Master the five",
  },
  {
    id: "spaces-syndicate",
    title: "Co-Diligence Spaces",
    description: "How accredited investor rooms collaborate on deal memos, question founders, and coordinate allocations.",
    slug: "collaborative-due-diligence-in-spaces",
    iconName: "Users",
    badge: "Community",
    ctaText: "Discover Spaces",
  },
];

export const blogCategories: BlogCategory[] = [
  "All",
  "Thesis",
  "Investing",
  "Ventures",
  "UBverse",
  "Founders",
  "Craft & Culture",
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getRelatedPosts(currentSlug: string, count = 3): BlogPost[] {
  const current = getBlogPost(currentSlug);
  if (!current) return blogPosts.slice(0, count);

  // prioritize same category, then other posts
  const sameCategory = blogPosts.filter(
    (p) => p.slug !== currentSlug && p.category === current.category
  );
  const others = blogPosts.filter(
    (p) => p.slug !== currentSlug && p.category !== current.category
  );

  return [...sameCategory, ...others].slice(0, count);
}

export function getPostsByCategory(category: BlogCategory): BlogPost[] {
  if (category === "All") return blogPosts;
  return blogPosts.filter((p) => p.category === category);
}

export function getFeaturedPost(): BlogPost {
  return blogPosts.find((p) => p.featured) || blogPosts[0];
}

export function getTrendingPosts(): BlogPost[] {
  return blogPosts.filter((p) => p.trending);
}

export function getRecentPosts(excludeSlug?: string, limit = 3): BlogPost[] {
  return blogPosts
    .filter((p) => p.slug !== excludeSlug)
    .slice(0, limit);
}
