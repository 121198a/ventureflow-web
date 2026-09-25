// Authentic assessment diagnostic questions and recommendation models
// Derived from verified UBverse readiness check engines

const NEWSLETTER_API_BASE_URL =
  process.env.NEWSLETTER_API_BASE_URL ||
  process.env.NEXT_PUBLIC_NEWSLETTER_API_BASE_URL ||
  "https://development.unboundxinc.us";

export type AssessmentQuestion = {
  cat: string;
  q: string;
  fix: string;
  why: string;
};

export type AssessmentKey =
  | "pitchCheck"
  | "closeCheck"
  | "followupCheck"
  | "updateCheck"
  | "riskCheck"
  | "ownershipCheck"
  | "valuationCheck"
  | "runwayCheck"
  | "stageCheck";

export type AssessmentMeta = {
  key: AssessmentKey;
  articleId: string;
  endpoint: string;
  title: string;
  subtitle: string;
  questions: AssessmentQuestion[];
};

export const NEWSLETTER_ASSESSMENTS: Record<AssessmentKey, AssessmentMeta> = {
  pitchCheck: {
    key: "pitchCheck",
    articleId: "1",
    endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/pitch-check`,
    title: "Pitch Numbers Readiness Assessment",
    subtitle: "8 questions · 2 minutes · confidential",
    questions: [
  {
    "cat": "Cash position",
    "q": "Can you state this month's net burn as one number, without checking?",
    "fix": "Pull the current month's figure from your accounts today and commit it to memory as one number.",
    "why": "A founder unsure of burn reads as a founder unsure of the basics beneath the story."
  },
  {
    "cat": "Cash position",
    "q": "Do you know the month and year you reach zero cash at current burn, and how the raise moves it?",
    "fix": "Divide cash on hand by net burn, name the month, and state the post-raise runway alongside it.",
    "why": "\"Plenty of runway\" is the answer investors hear most and believe least."
  },
  {
    "cat": "Revenue & growth",
    "q": "Can you state current revenue (or contracted pipeline) and the three-month growth rate in one sentence?",
    "fix": "Fix the two figures: the current number and the trailing three-month change. Rehearse them as one sentence.",
    "why": "Growth stated vaguely invites the investor to assume the least flattering number."
  },
  {
    "cat": "Revenue & growth",
    "q": "Does the revenue figure you quote reconcile with your last close of books?",
    "fix": "Check the pitch figure against your latest closed month. Diligence will do exactly this.",
    "why": "A pitch number that diligence cannot reproduce costs more trust than a smaller true number."
  },
  {
    "cat": "Unit economics",
    "q": "Can you state what you spend to acquire a customer and when it comes back?",
    "fix": "Compute acquisition cost and payback for the last quarter. One sentence: \"we spend X, it returns in Z months.\"",
    "why": "\"It depends on the channel\" is where investor attention starts to drift."
  },
  {
    "cat": "Unit economics",
    "q": "Do you know the model-specific number your sector expects: churn, take rate, or gross margin?",
    "fix": "Identify the one metric investors in your category always ask about, and prepare it to the same standard as the core five.",
    "why": "Sector investors test category fluency with one question. It is usually this one."
  },
  {
    "cat": "Deal math",
    "q": "Do you know your ownership today and after this round at the target valuation?",
    "fix": "Run the cap table at the target valuation now. Two percentages, committed to memory.",
    "why": "Unsure about your own ownership reads as a founder who has not done the math on their own deal."
  },
  {
    "cat": "Deal math",
    "q": "Have you modeled the option pool refresh and its effect on your post-round ownership?",
    "fix": "Model the pool refresh investors are likely to require and restate your post-round number with it included.",
    "why": "The pool is where post-round ownership quietly drops several points founders did not plan for."
  }
]
  },
  closeCheck: {
    key: "closeCheck",
    articleId: "2",
    endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/close-check`,
    title: "Closing Discipline Readiness Assessment",
    subtitle: "8 questions · 2 minutes · confidential",
    questions: [
  {
    "cat": "Details of record",
    "q": "Do you have the exact legal entity name and confirmed signatory for every committed investor?",
    "fix": "Ask each investor today which entity is subscribing and who signs for it. Record both.",
    "why": "Sub docs issued to the wrong entity are the single most common restart in a close."
  },
  {
    "cat": "Details of record",
    "q": "Are your subscription documents drafted with counsel and ready to send today?",
    "fix": "Have counsel finalize the sub doc package now, before the next commitment lands.",
    "why": "Every day of drafting after a yes is a day the commitment sits unconverted."
  },
  {
    "cat": "Investor conditions",
    "q": "Have you asked each investor what must be completed on their side before funds can be released?",
    "fix": "Put the one question to every committed investor: \"What needs to be completed on your side before funds can be released?\"",
    "why": "Half of every close belongs to the investor. Unasked, it surfaces one delay at a time."
  },
  {
    "cat": "Investor conditions",
    "q": "Are accreditation and KYC checks underway for every committed investor?",
    "fix": "Open accreditation and KYC verification for each investor now — these run in parallel with everything else.",
    "why": "Verification started after signatures routinely adds a week to funding."
  },
  {
    "cat": "Ownership & cadence",
    "q": "Does every open item in the close have a named owner and a date?",
    "fix": "List every open item across all investors. Assign one name and one date to each. \"Our lawyers\" is not a name.",
    "why": "Unowned items are the quiet center of closing drift — nothing blocked, nothing moving."
  },
  {
    "cat": "Ownership & cadence",
    "q": "Do you review the full close — every investor, every stage — at least weekly?",
    "fix": "Put a 20-minute weekly review on the calendar: walk the ledger, chase what aged.",
    "why": "A close that is only reviewed when something breaks will drift between the breaks."
  },
  {
    "cat": "Funding mechanics",
    "q": "Have banking and wire instructions been verified with each investor’s operations team or fund admin?",
    "fix": "Verify wire details with the operations contact — not the partner — for every committed investor.",
    "why": "A mismatched account name can recall a wire and restart bank compliance review."
  },
  {
    "cat": "Funding mechanics",
    "q": "Do you know which investor is likely to fund last, and why?",
    "fix": "Rank your committed investors by expected funding date. The last one gets your attention first.",
    "why": "The least prepared investor sets the pace of the whole round — unless you sequence the close."
  }
]
  },
  followupCheck: {
    key: "followupCheck",
    articleId: "3",
    endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/followup-check`,
    title: "Investor Follow-Up Readiness Assessment",
    subtitle: "8 questions · 2 minutes · confidential",
    questions: [
  {
    "cat": "The reason to reopen",
    "q": "Does your follow-up carry a specific, verifiable piece of progress since you last spoke?",
    "fix": "Lead with what moved: a signed customer, a metric change, or a pilot milestone.",
    "why": "\"Checking in\" gets buried; progress gets read."
  },
  {
    "cat": "The reason to reopen",
    "q": "If nothing has moved yet, are you willing to wait until it does before sending the note?",
    "fix": "Hold the email until a real change occurs. An empty note spends credit you will need later.",
    "why": "Repeated nudges without news teach the investor to ignore the sender."
  },
  {
    "cat": "Answer their concern",
    "q": "Do you know the specific concern or question this investor raised in your last meeting?",
    "fix": "Review your meeting notes and identify the single issue they pressed hardest.",
    "why": "A follow-up that ignores their specific concern reads as a broadcast, not a conversation."
  },
  {
    "cat": "Answer their concern",
    "q": "Does your follow-up directly address that concern with new evidence?",
    "fix": "Use the phrase: \"One thing you pushed on was...\" followed by the current data.",
    "why": "Showing you listened and acted on their feedback is the fastest way to reopen a thread."
  },
  {
    "cat": "The ask",
    "q": "Does the note end with a specific, low-friction next step?",
    "fix": "Offer a clear choice: \"Worth a fresh look? I can share the updated deck this week.\"",
    "why": "Open-ended questions (\"Let me know if you want to connect\") put the work on the investor."
  },
  {
    "cat": "The ask",
    "q": "Is the next step appropriate for where the conversation left off?",
    "fix": "Match the ask to the stage: an updated memo for diligence, a quick call for a quick question.",
    "why": "Asking for a full partner meeting after a cold month feels disconnected."
  },
  {
    "cat": "Timing & restraint",
    "q": "Does the note avoid any tone of pressure, guilt, or second-guessing?",
    "fix": "Cut any line that reaches for attention instead of earning it. Let the progress carry the note.",
    "why": "A founder sitting on real progress does not need to push, and pushing anyway signals the opposite."
  },
  {
    "cat": "Timing & restraint",
    "q": "Would this note make the company feel more real than it did last time?",
    "fix": "Read it back as the investor, not the author. If the company does not feel further along, rewrite it.",
    "why": "Politeness is not the bar. The only question that matters is whether they believe in the momentum."
  }
]
  },
  updateCheck: {
    key: "updateCheck",
    articleId: "4",
    endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/update-check`,
    title: "Investor Updates Readiness Assessment",
    subtitle: "8 questions · 2 minutes · confidential",
    questions: [
  {
    "cat": "Cadence & discipline",
    "q": "Do you send investor updates on a regular monthly schedule?",
    "fix": "Pick a date (e.g., first Tuesday of the month) and put a recurring 30-minute block on your calendar.",
    "why": "Consistency is what builds the track record of setting expectations and meeting them."
  },
  {
    "cat": "Cadence & discipline",
    "q": "Does your update take under two minutes to read?",
    "fix": "Stick to the four-line format. If it turns into a newsletter, cut it down.",
    "why": "Long updates get saved for later, which usually means never."
  },
  {
    "cat": "The four lines",
    "q": "Does your update include one clear line on what actually moved this month?",
    "fix": "State the single most significant development plainly: a customer signed, a hire made, a product shipped.",
    "why": "Progress is what earns the reader's attention for the rest of the note."
  },
  {
    "cat": "The four lines",
    "q": "Do you include the number behind the progress, reconciled to your metrics?",
    "fix": "Attach the metric to the progress line: ARR, active users, burn, or pipeline size.",
    "why": "Vague claims of progress without numbers read as spin."
  },
  {
    "cat": "The ask",
    "q": "Do you include one specific, answerable request for help?",
    "fix": "Ask for something concrete: a warm intro to a specific title, advice on a named vendor, a candidate profile.",
    "why": "Passive investors become useful when given a specific job. \"Let us know if you can help\" gets nothing."
  },
  {
    "cat": "The ask",
    "q": "Is the ask easy for the investor to fulfill in under five minutes?",
    "fix": "Draft the forwardable email or provide the exact link so all they have to do is hit forward.",
    "why": "The lower the friction of the ask, the higher the response rate across your list."
  },
  {
    "cat": "Honesty & alignment",
    "q": "Do you include an honest line on what is not working or where you are behind?",
    "fix": "Add one line on a current challenge: \"Hiring engineering leads is taking longer than planned.\"",
    "why": "Admitting what is hard builds credibility for the good news in the rest of the update."
  },
  {
    "cat": "Honesty & alignment",
    "q": "Does the update state the single next milestone you are aiming for?",
    "fix": "End with the target for next month: the number, the hire, or the release date.",
    "why": "Stating the next milestone creates the benchmark against which next month's update will be judged."
  }
]
  },
  riskCheck: {
    key: "riskCheck",
    articleId: "5",
    endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/risk-check`,
    title: "Existential Risk Readiness Assessment",
    subtitle: "8 questions · 2 minutes · confidential",
    questions: [
  {
    "cat": "Do you know it",
    "q": "Can you name the single biggest risk to this company in one sentence?",
    "fix": "Write it down now, plainly. If you cannot get it into one sentence, you do not yet know it well enough to defend it.",
    "why": "The founders who handle the risk question well are the ones who decided on the answer long before they were asked."
  },
  {
    "cat": "Do you know it",
    "q": "Have you tested that risk against someone outside the company?",
    "fix": "Run it past an advisor, an operator, or a banker who reads pitches. The risk you fixate on is not always the one they press.",
    "why": "Founders are often wrong about which risk matters most, and the only reliable way to find out is to ask an outsider before an investor does."
  },
  {
    "cat": "Own it in the pitch",
    "q": "Do you raise the risk yourself, before the investor gets there?",
    "fix": "Put it in the conversation on your terms. Waiting for them to find it hands them the framing.",
    "why": "Whoever names the risk first controls how it is read. Let it be you."
  },
  {
    "cat": "Own it in the pitch",
    "q": "In your deck or script, is the risk written as one plain statement, rather than buried in caveats and qualifiers?",
    "fix": "Find the line where the risk appears and cut it to a single direct sentence. If you cannot find that line, it is not really in the pitch yet.",
    "why": "A risk stated flatly reads as something you have handled. The more words spent cushioning it, the larger it looks to the investor."
  },
  {
    "cat": "Have a plan",
    "q": "Can you explain why the risk exists, not just that it does?",
    "fix": "Give the cause in a line. \"We took the big customer on purpose, to prove the product with the hardest buyer.\"",
    "why": "A risk with a reason behind it reads as a decision. A risk with no reason reads as an accident you have not noticed."
  },
  {
    "cat": "Have a plan",
    "q": "Do you have a specific plan to reduce it, with a number and a timeline?",
    "fix": "Attach both: where the risk is now, where you intend it to be, and by when. Vague reassurance is worse than none.",
    "why": "\"We are working on it\" is not a plan. A number and a date are what turn a worry into a course of action."
  },
  {
    "cat": "Show the work",
    "q": "Is there real evidence the plan is already moving, not just intended?",
    "fix": "Point to what is underway now: pilots signed, hires made, a metric that has started to shift.",
    "why": "Motion already visible is what makes the plan believable."
  },
  {
    "cat": "Show the work",
    "q": "After the risk and the plan, do you have a clear next point to move to, so the risk does not become the whole conversation?",
    "fix": "Line up the point you will pivot to once the risk is answered, whether that is the pipeline, the team, or the next milestone.",
    "why": "Knowing where you go next is what keeps it from swallowing the room."
  }
]
  },
  ownershipCheck: {
    key: "ownershipCheck",
    articleId: "6",
    endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/ownership-check`,
    title: "Post-Round Ownership Readiness Assessment",
    subtitle: "8 questions · 2 minutes · confidential",
    questions: [
  {
    "cat": "Current ownership",
    "q": "Can you state the founding team's current ownership percentage without checking the cap table?",
    "fix": "State the founding team's current ownership from memory",
    "why": "A founder unsure of current ownership reads as a founder unsure of their cap table basics."
  },
  {
    "cat": "Current ownership",
    "q": "Is that percentage calculated on a fully diluted basis?",
    "fix": "Recalculate current ownership on a fully diluted basis",
    "why": "Ignoring unissued options or convertible securities distorts the true starting position."
  },
  {
    "cat": "Converting securities",
    "q": "Have you included every outstanding SAFE and convertible note in your ownership model?",
    "fix": "Add every outstanding SAFE and convertible note to the model",
    "why": "SAFEs and notes convert into equity at close and reduce the founders' stake at that moment."
  },
  {
    "cat": "Converting securities",
    "q": "Do you know how their valuation caps, discounts, and accrued interest may affect conversion?",
    "fix": "Work out how caps, discounts, and accrued interest affect conversion",
    "why": "Different caps and discounts alter the conversion math and final share count significantly."
  },
  {
    "cat": "Option pool and commitments",
    "q": "Have you modeled the option-pool increase investors may require before closing?",
    "fix": "Model the option-pool increase, and confirm whether it sits pre-money",
    "why": "Option pools created pre-money dilute existing founders exclusively before investor funds land."
  },
  {
    "cat": "Option pool and commitments",
    "q": "Are all warrants, advisor grants, and promised equity reflected in the cap table?",
    "fix": "Record every warrant, advisor grant, and promised equity commitment",
    "why": "Unrecorded equity promises create surprise dilution late in the closing process."
  },
  {
    "cat": "Post-round ownership",
    "q": "Can you state the founding team's expected ownership immediately after the proposed round?",
    "fix": "Produce the expected post-round ownership figure",
    "why": "Investors expect founders to know their post-round equity stake without opening a spreadsheet."
  },
  {
    "cat": "Post-round ownership",
    "q": "Can you explain which assumptions create the greatest change between the current and post-round figures?",
    "fix": "Identify which assumption moves the post-round number most",
    "why": "Explaining which inputs carry the most weight shows full command of the round financing."
  }
]
  },
  valuationCheck: {
    key: "valuationCheck",
    articleId: "7",
    endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/valuation-check`,
    title: "Valuation Anchoring Readiness Assessment",
    subtitle: "8 questions · 2 minutes · confidential",
    questions: [
  {
    "cat": "I · The number itself",
    "q": "Can you state the valuation range you are seeking, rather than a single figure?",
    "fix": "Set a valuation range, with a reason for each end of it",
    "why": "A single number sets an unnecessary ceiling. A range keeps negotiations open."
  },
  {
    "cat": "I · The number itself",
    "q": "Do you know the raise amount and the ownership that range implies?",
    "fix": "Connect the raise amount to the ownership it gives away",
    "why": "Investors expect you to know what equity percentage your valuation implies."
  },
  {
    "cat": "II · Company-specific evidence",
    "q": "Can you name the three strongest company-specific facts supporting your valuation?",
    "fix": "Write down the three strongest company-specific facts behind the number",
    "why": "Valuations are defended by company-specific proof points, not general market hype."
  },
  {
    "cat": "II · Company-specific evidence",
    "q": "Does that evidence cover traction, revenue quality, and customer proof rather than projections?",
    "fix": "Replace projected outcomes with traction, revenue quality, and customer evidence",
    "why": "Traction, revenue quality, and customer proof ground your valuation in actual evidence."
  },
  {
    "cat": "III · Comparable financings",
    "q": "Do you know how recent financings for comparable companies have priced?",
    "fix": "Identify recent comparable financings and how they priced",
    "why": "Comparables ground your valuation in current market realities."
  },
  {
    "cat": "III · Comparable financings",
    "q": "Can you explain why your company differs from those comparables, in both directions?",
    "fix": "Prepare the differences between your company and its comparables",
    "why": "Understanding differences prevents investors from anchoring you to lower-tier comps."
  },
  {
    "cat": "IV · Terms beside the number",
    "q": "Have you reviewed the economic and control terms proposed alongside the valuation?",
    "fix": "Review liquidation preference, option pool placement, anti-dilution, and board terms",
    "why": "Economic and control terms often dictate the actual value far more than the headline valuation number."
  },
  {
    "cat": "IV · Terms beside the number",
    "q": "Could you say which term you would trade for a lower headline number, and why?",
    "fix": "Decide which terms matter more to you than the headline valuation",
    "why": "Knowing your trade-offs gives you leverage during term sheet negotiations."
  }
]
  },
  runwayCheck: {
    key: "runwayCheck",
    articleId: "8",
    endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/runway-check`,
    title: "Runway & Milestones Readiness Assessment",
    subtitle: "8 questions · 2 minutes · confidential",
    questions: [
  {
    "cat": "I · Current position",
    "q": "Can you state the company's current monthly gross burn and net burn?",
    "fix": "Confirm the company's current gross and net monthly burn",
    "why": "Investors expect a clear starting burn figure before they trust a runway month count."
  },
  {
    "cat": "I · Current position",
    "q": "Have you confirmed how much cash will actually be available for operations after the round closes?",
    "fix": "Establish the capital available after immediate costs and obligations",
    "why": "Headline raise amounts overstate runway when fees, payables, or reserves come out first."
  },
  {
    "cat": "II · Operating plan",
    "q": "Does your runway estimate reflect the hiring, product, marketing, and other spending the round is intended to fund?",
    "fix": "Connect the planned uses of capital to the runway estimate",
    "why": "A plan that ignores post-raise spending describes today's company, not the one investors are funding."
  },
  {
    "cat": "II · Operating plan",
    "q": "Are the timing and amount of expected cash receipts supported by current company evidence?",
    "fix": "Review the assumptions behind expected cash receipts",
    "why": "Projected revenue that has not been collected yet can inflate how long the round appears to last."
  },
  {
    "cat": "III · Milestone and timing",
    "q": "Have you identified the measurable milestone the round is intended to reach?",
    "fix": "Define the milestone the proposed capital should fund",
    "why": "Runway without a destination is just time; investors want to know what evidence the capital produces."
  },
  {
    "cat": "III · Milestone and timing",
    "q": "Does the plan leave enough time after that milestone to prepare for the company's next financing or strategic step?",
    "fix": "Review the time and cash expected to remain after the milestone",
    "why": "Reaching a milestone as cash runs out leaves little room to raise the next round."
  },
  {
    "cat": "IV · Risk and response",
    "q": "Have you tested how slower revenue, higher costs, or delayed execution could affect the runway?",
    "fix": "Test the estimate against reasonable changes in the plan",
    "why": "Investors probe which assumptions break the number first."
  },
  {
    "cat": "IV · Risk and response",
    "q": "Do you know which spending decisions could preserve runway if the company falls behind plan?",
    "fix": "Identify which expenses could be delayed or adjusted",
    "why": "A credible plan includes what the company can change if the operating plan slips."
  }
]
  },
  stageCheck: {
    key: "stageCheck",
    articleId: "9",
    endpoint: `${NEWSLETTER_API_BASE_URL}/newsletter/stage-check`,
    title: "Round Stage & Proof Readiness Assessment",
    subtitle: "8 questions · 2 minutes · confidential",
    questions: [
  {
    "cat": "I · Current stage",
    "q": "Can you explain why the round you are pursuing matches the company's current stage?",
    "fix": "Clarify why the proposed round fits the company's current position",
    "why": "A round label cannot replace evidence that the company is ready for it."
  },
  {
    "cat": "I · Current stage",
    "q": "Can you identify what the company has demonstrated since its previous financing or starting point?",
    "fix": "Identify the strongest progress made since the last financing or starting point",
    "why": "Investors will examine what has changed before deciding whether to fund what comes next."
  },
  {
    "cat": "II · Company evidence",
    "q": "Can you point to how people with the problem have engaged with the company, through pilots, trials, letters of intent, waitlists, or usage?",
    "fix": "Gather the demand evidence the company can actually show today",
    "why": "A working product does not automatically demonstrate lasting demand."
  },
  {
    "cat": "II · Company evidence",
    "q": "Can you support every figure in the deck with a source the company can produce on request?",
    "fix": "Confirm each figure in the raise materials has a documented source",
    "why": "Unsupported or conflicting information weakens both the stage claim and investor confidence."
  },
  {
    "cat": "III · Purpose of the round",
    "q": "Have you identified the specific milestone the proposed capital is intended to reach?",
    "fix": "Define the milestone the proposed round should fund",
    "why": "Capital needs a clear purpose beyond extending the company's operating time."
  },
  {
    "cat": "III · Purpose of the round",
    "q": "Does each major use of funds connect clearly to that milestone?",
    "fix": "Align the planned uses of capital with the intended result",
    "why": "Investors need to see how the spending should move the company forward."
  },
  {
    "cat": "IV · Next-stage position",
    "q": "Do you know what evidence investors at the company's next stage are likely to expect?",
    "fix": "Review the evidence likely to matter in the company's next financing",
    "why": "The current round should build toward the position required later."
  },
  {
    "cat": "IV · Next-stage position",
    "q": "Have you considered what the company will do if reaching the milestone takes longer or requires more capital than planned?",
    "fix": "Identify the company's options if progress develops more slowly",
    "why": "A plan that depends on automatic advancement leaves little room to respond."
  }
]
  }
};

export function getAssessmentForArticle(articleId: string | number): AssessmentMeta | undefined {
  const idStr = String(articleId);
  return Object.values(NEWSLETTER_ASSESSMENTS).find((a) => a.articleId === idStr);
}

export function computeReadinessBriefing(
  assessment: AssessmentMeta,
  answers: Record<number, "yes" | "mid" | "no">
) {
  let yesCount = 0;
  let midCount = 0;
  let noCount = 0;

  const categories: Record<string, { ok: number; total: number }> = {};
  const priorityItems: { q: string; fix: string; why: string; status: "mid" | "no" }[] = [];

  assessment.questions.forEach((q, idx) => {
    const ans = answers[idx] || "no";
    if (!categories[q.cat]) {
      categories[q.cat] = { ok: 0, total: 0 };
    }
    categories[q.cat].total += 1;

    if (ans === "yes") {
      yesCount += 1;
      categories[q.cat].ok += 1;
    } else if (ans === "mid") {
      midCount += 1;
      priorityItems.push({ q: q.q, fix: q.fix, why: q.why, status: "mid" });
    } else {
      noCount += 1;
      priorityItems.push({ q: q.q, fix: q.fix, why: q.why, status: "no" });
    }
  });

  const total = assessment.questions.length;
  let verdictTitle = "";
  let verdictDescription = "";
  let status: "ready" | "partial" | "not_ready" = "not_ready";

  if (yesCount >= 7) {
    status = "ready";
    verdictTitle = "Your position supports the round.";
    verdictDescription =
      "You can state and defend the key items investors test. Revisit this briefing as round terms or metrics evolve.";
  } else if (yesCount >= 4) {
    status = "partial";
    verdictTitle = "Most of the position is supported.";
    verdictDescription =
      "The highlighted items below are the ones investors examine first. Addressing them now removes friction before partner meetings.";
  } else {
    status = "not_ready";
    verdictTitle = "The round is not yet ready to pursue.";
    verdictDescription =
      "Every item below can be established with numbers the company already has. Addressing these items now avoids a costly stumble in diligence.";
  }

  return {
    score: yesCount,
    total,
    yesCount,
    midCount,
    noCount,
    status,
    verdictTitle,
    verdictDescription,
    categories,
    priorityItems
  };
}
