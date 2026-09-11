import type { CareerRole, HiringStep } from "@/types/careers";

export const roles: CareerRole[] = [
  {
    slug: "frontend-engineer",
    title: "Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    experience: "Mid / Senior",
    description:
      "Build fast, expressive product experiences across the UnBound X ecosystem.",
    responsibilities: [
      "Build accessible React and TypeScript experiences.",
      "Shape reusable UI and motion primitives.",
      "Partner closely with product and design.",
      "Own performance budgets on the surfaces you ship.",
    ],
    requirements: [
      "Strong React and TypeScript skills.",
      "Strong product and visual judgement.",
      "Comfortable owning work end-to-end.",
    ],
    niceToHave: ["Motion and interaction craft.", "Design systems experience."],
  },
  {
    slug: "product-designer",
    title: "Product Designer",
    department: "Design",
    location: "Remote / Hybrid",
    type: "Full-time",
    experience: "Mid / Senior",
    description:
      "Turn complex investing and founder workflows into clear, premium experiences.",
    responsibilities: [
      "Own product flows from concept to launch.",
      "Create systems that scale across products.",
      "Prototype and validate with real users.",
    ],
    requirements: [
      "Strong product design portfolio.",
      "Systems thinking and interaction craft.",
      "Comfort with ambiguous problems.",
    ],
    niceToHave: ["Prototyping in code.", "Brand and editorial sensibility."],
  },
  {
    slug: "growth-operator",
    title: "Growth Operator",
    department: "Growth",
    location: "Remote",
    type: "Full-time",
    experience: "3+ years",
    description:
      "Build experiments that help more founders and investors discover UnBound X.",
    responsibilities: [
      "Own growth experiments and measurement.",
      "Develop high-signal acquisition loops.",
      "Collaborate across product, content and community.",
    ],
    requirements: [
      "Analytical and creative mindset.",
      "Strong written communication.",
      "Bias toward experimentation and learning.",
    ],
    niceToHave: ["Lifecycle and CRM experience.", "Community building."],
  },
  {
    slug: "investment-analyst",
    title: "Investment Analyst",
    department: "Investment",
    location: "India / Remote",
    type: "Full-time",
    experience: "1–3 years",
    description: "Help surface the companies and ideas shaping what comes next.",
    responsibilities: [
      "Research markets, founders and companies.",
      "Build investment perspectives and memos.",
      "Work with the broader investing ecosystem.",
    ],
    requirements: [
      "Strong research and analytical skills.",
      "Curiosity about technology and startups.",
      "Clear, structured communication.",
    ],
    niceToHave: ["Financial modelling.", "Published writing or research."],
  },
];

export const getRole = (slug: string) => roles.find((r) => r.slug === slug);

export const departments = [...new Set(roles.map((r) => r.department))];
export const locations = [...new Set(roles.map((r) => r.location))];

export const hiringSteps: HiringStep[] = [
  {
    step: "01",
    title: "Intro conversation",
    body: "A 30 minute call about your work, your motivation and what you want next.",
  },
  {
    step: "02",
    title: "Craft deep dive",
    body: "We go through real work you have shipped and how you made your decisions.",
  },
  {
    step: "03",
    title: "Working session",
    body: "A paid, time-boxed problem drawn from the actual roadmap. No trick puzzles.",
  },
  {
    step: "04",
    title: "Team and offer",
    body: "Meet the people you would build with, then a clear offer within 48 hours.",
  },
];
