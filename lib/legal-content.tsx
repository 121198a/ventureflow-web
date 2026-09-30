import type { ReactNode } from "react";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export const footerColumns: FooterColumn[] = [
  {
    title: "Workspace",
    links: [
      { label: "Investor workspace", href: "/investor/login" },
      { label: "Founder workspace", href: "/issuer/login" },
      { label: "Services", href: "/services" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Workspace Disclaimer", href: "/legal/workspace-disclaimer-for-ventureflow" },
      { label: "Terms of Use", href: "/legal/terms-condition" },
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
    ],
  },
];

export const legalDisclosures: { label: string; body: ReactNode }[] = [
  {
    label: "Overview:",
    body: (
      <span>
        {" "}VentureFlow is a collaboration workspace for founders and investors. It does not provide financial services or advice.
      </span>
    ),
  },
  {
    label: "User-provided information:",
    body: (
      <span>
        {" "}Profiles and documents come from their owners and are not verified or endorsed by VentureFlow.
      </span>
    ),
  },
];
