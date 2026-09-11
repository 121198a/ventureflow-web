import React, { type ReactNode } from "react";

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
    title: "Platform",
    links: [
      { label: "For Investors", href: "/investor/login" },
      { label: "For Companies", href: "/issuer/login" },
      { label: "Service Tiers", href: "#" },
    ],
  },
  {
    title: "Legal & Compliance",
    links: [
      { label: "Platform Disclaimer", href: "/legal/ubverse-disclaimer-for-unboundx" },
      { label: "Terms of Use", href: "/legal/terms-condition" },
      { label: "Privacy Policy", href: "/legal/privacy-policy" },
      { label: "Form CRS", href: "/legal/crs" },
      { label: "Reg. BI Disclosure", href: "/legal/reg-bi-disclosure" },
    ],
  },
];

export const legalDisclosures: { label: string; body: ReactNode }[] = [
  {
    label: "Platform Overview:",
    body: (
      <span>
        {" "}UBverse is a private markets technology and administrative services platform operated by UnBound X Inc. UBverse is not a registered broker-dealer, investment advisor, or funding portal, and does not provide investment advice, recommendations, or endorsements regarding any investment opportunities available on the platform.
      </span>
    ),
  },
  {
    label: "Broker-Dealer:",
    body: (
      <span>
        {" "}Securities are offered through MARV Capital, Inc., an SEC-registered broker-dealer and member of FINRA/SIPC (CRD #104390). All securities-related activity is conducted through MARV Capital, Inc., unless otherwise specified. In the event that a different broker-dealer is engaged for a particular offering, such broker-dealer will be identified on the applicable offering materials, and all securities-related activities for that offering will be conducted through that broker-dealer. You can review the background of MARV Capital and its investment professionals on FINRA&apos;s{" "}
        <a
          href="https://brokercheck.finra.org/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline hover:opacity-85"
        >
          BrokerCheck
        </a>
        .
      </span>
    ),
  },
  {
    label: "Offering Type:",
    body: (
      <span>
        {" "}Offerings on UBverse may be conducted pursuant to Regulation D (including Rule 506(c)), Regulation A (commonly referred to as &ldquo;Regulation A+&rdquo;), Regulation Crowdfunding, or other applicable exemptions from registration under the Securities Act of 1933, as disclosed in the applicable offering materials. Eligibility requirements, including accredited investor status where applicable, and any required investor verification or qualification procedures, will be determined based on the specific exemption relied upon and must be satisfied prior to the acceptance of any investment.
      </span>
    ),
  },
  {
    label: "No Investment Advice:",
    body: (
      <span>
        {" "}Neither UBverse nor MARV Capital, Inc. provide investment advice, recommendations, or endorsements regarding any specific investment opportunity. UBverse serves solely as a technology intermediary, facilitating connections between issuers and accredited investors. The appearance of any company on the platform does not constitute an endorsement or solicitation. All investment decisions are the sole responsibility of the investor. You should conduct your own due diligence and consult with qualified financial, legal, and tax advisors before making any investment decision.
      </span>
    ),
  },
  {
    label: "Issuer-Provided Information:",
    body: (
      <span>
        {" "}All information on the platform — including company profiles, financial data, projections, and founder statements — is provided by the applicable issuer and has not been independently verified by UBverse or MARV Capital, Inc. Issuers have a direct financial interest in the success of their offerings and may present information in a manner that is incomplete, inaccurate, or inherently favorable. UBverse makes no representation regarding the accuracy, completeness, or reliability of any issuer-provided information. UBverse does not endorse or recommend any issuer, investment, or investor, and display on the platform should not be construed as such.
      </span>
    ),
  },
  {
    label: "Testimonials & Endorsements:",
    body: (
      <span>
        {" "}The platform may display testimonials, endorsements, or statements from founders, existing investors (including accredited investors, angel investors, venture capital firms, and other institutional or retail investors), or other third parties. These statements reflect the personal opinions of the individuals providing them and may not be representative of the experience of all users or investors. Testimonials are not a guarantee of future performance or success. Persons providing testimonials may have material conflicts of interest, including financial incentives to promote an offering. Where compensation has been provided, it will be disclosed. UBverse does not independently verify testimonials. UBverse, an affiliate of UnBound X Inc., may hold equity or warrants in companies listed on the platform, which may create additional conflicts of interest.
      </span>
    ),
  },
  {
    label: "Investment Risks:",
    body: (
      <span>
        {" "}Investments in private securities are speculative, illiquid, and involve substantial risk. You should not invest any funds unless you can afford to lose your entire investment. These investments are suitable only for investors who can bear the economic risk of a total loss and who have sufficient knowledge and experience to evaluate the merits and risks of prospective investments.
      </span>
    ),
  },
];

export const legalRisks: [string, string][] = [
  [
    "Illiquidity:",
    "There is no established trading market for these securities. You may not be able to sell your investment when desired, and shares are subject to significant restrictions on transfer and resale.",
  ],
  ["Total Loss:", "Many startups and early-stage companies fail. You may lose your entire investment."],
  ["Dilution:", "Your ownership percentage may be reduced through future fundraising rounds."],
  [
    "Limited Information:",
    "Private companies provide limited financial information compared to public companies.",
  ],
  [
    "Valuation:",
    "Valuations of private companies are highly subjective and may not reflect actual market value.",
  ],
];
