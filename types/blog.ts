export type BlogCategory =
  | "All"
  | "Thesis"
  | "Investing"
  | "Ventures"
  | "UBverse"
  | "Founders"
  | "Craft & Culture";

export type BlogAuthor = {
  name: string;
  role: string;
  avatar: string;
  bio: string;
};

export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id?: string }
  | { type: "h3"; text: string }
  | { type: "quote"; text: string; citation?: string }
  | {
      type: "callout";
      title: string;
      text: string;
      variant?: "blue" | "dark" | "signal";
    }
  | { type: "table"; columns: [string, string]; rows: [string, string][] }
  | { type: "recap"; heading: string; items: { bold: string; rest: string }[] }
  | { type: "checklist"; heading: string; items: string[] }
  | {
      type: "metrics";
      items: { value: string; label: string; desc?: string }[];
    }
  | { type: "image"; src: string; caption?: string; alt: string };

export type BlogPost = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  category: Exclude<BlogCategory, "All">;
  tag: string;
  date: string;
  readTime: string;
  coverImage: string;
  author: BlogAuthor;
  featured?: boolean;
  trending?: boolean;
  editorialPick?: boolean;
  keyStats?: { label: string; value: string; change?: string; positive?: boolean }[];
  body: BlogBlock[];
};

export type CuratedTrack = {
  id: string;
  title: string;
  description: string;
  slug: string;
  iconName: string;
  badge: string;
  ctaText: string;
};
