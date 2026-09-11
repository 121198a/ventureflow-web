export type Offering = {
  slug: string;
  name: string;
  round: string;
  goal: string;
  min: string;
  filing: string;
  art: string;
  initials: string;
  status: string;
  /** Long-form intro paragraph on the deal page. Truncated with a "View
      More" toggle when longer than ~220 chars, matching the reference. */
  description: string;
  legalOfferor: string;
  lawFirm: string;
  aboutBody: string;
  categories: string[];
  stats: {
    interestIndicated: string | null;
    committed: string | null;
    funded: string | null;
  };
};

// NOTE ON FIDELITY: the live reference (seen in both the general walkthrough
// and the dedicated Home.mp4 recording) renders photographic/illustrated
// artwork for these cards (e.g. a heart-in-hand icon for "Virani Chem", a
// puzzle-piece illustration for "Infopulse"), and its own deal-detail pages
// are populated with placeholder/test copy ("qwer", "zsdsfdsafd", "just
// testing", legal offeror "test"/"xyz", law firm "yew"/"test") rather than
// real company content — this is evidently seed/demo data on their dev
// environment, not finished copy. Per "do not invent business data," this
// keeps that same placeholder-data honesty rather than writing polished
// fictional company descriptions: the structure and interactions are real,
// the filler copy is carried over as seen.
export const offerings: Offering[] = [
  {
    slug: "virani-chem-pvt-limited",
    name: "Virani Chem. Pvt. Limited.",
    round: "Friends & Family",
    goal: "$5K",
    min: "$5",
    filing: "Reg D, 506b",
    art: "linear-gradient(135deg, oklch(0.96 0.02 20), oklch(0.9 0.06 25))",
    initials: "VC",
    status: "Open Now",
    description: "qwer",
    legalOfferor: "test",
    lawFirm: "yew",
    aboutBody: "qwer",
    categories: ["3D Printing", "AgTech", "Agribusiness"],
    stats: { interestIndicated: "$5", committed: "$2", funded: "$65" },
  },
  {
    slug: "infopulse-technology",
    name: "Infopulse Technology",
    round: "Friends & Family",
    goal: "$2M",
    min: "$10K",
    filing: "Regulation CF",
    art: "linear-gradient(135deg, oklch(0.55 0.22 262), oklch(0.45 0.2 268))",
    initials: "IP",
    status: "Open Now",
    description: "zsdsfdsafd",
    legalOfferor: "test",
    lawFirm: "test",
    aboutBody: "zsdsfdsafd",
    categories: ["AdTech"],
    stats: { interestIndicated: "$120K", committed: "$30K", funded: "$20K" },
  },
  {
    slug: "unbound-x",
    name: "Unbound X",
    round: "Not sure · need guidance",
    goal: "$20.2K",
    min: "$100K",
    filing: "Reg D Rule 506(b)",
    art: "conic-gradient(from 200deg, oklch(0.78 0.17 75), oklch(0.55 0.24 300), oklch(0.6 0.2 250), oklch(0.78 0.17 75))",
    initials: "UX",
    status: "Open Now",
    description:
      "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.",
    legalOfferor: "xyz",
    lawFirm: "test",
    aboutBody: "just testing",
    categories: [],
    stats: { interestIndicated: null, committed: null, funded: null },
  },
  {
    slug: "hopiyant-tech",
    name: "Hopiyant Tech",
    round: "Friends & Family",
    goal: "$5K",
    min: "$5",
    filing: "Reg D, 506b",
    art: "linear-gradient(115deg, oklch(0.28 0.07 262), oklch(0.5 0.19 250))",
    initials: "HT",
    status: "Open Now",
    description: "test",
    legalOfferor: "test",
    lawFirm: "test",
    aboutBody: "test",
    categories: [],
    stats: { interestIndicated: null, committed: null, funded: null },
  },
];

export function getOffering(slug: string) {
  return offerings.find((o) => o.slug === slug);
}
