import type { Metadata } from "next";
import { LegalShell } from "@/components/legal/LegalShell";
import { TransitionLink } from "@/components/ui/TransitionLink";

export const metadata: Metadata = {
  title: "UnBound X Legal Hub",
  description:
    "Welcome to the Legal Hub for UnBound X. This page provides direct access to all legal policies, disclaimers, and regulatory agreements governing your use of the UnBound X platform and affiliated services.",
};

const platformPolicies = [
  { label: "Terms & Condition", href: "/legal/terms-condition" },
  { label: "Privacy Policy", href: "/legal/privacy-policy" },
  { label: "End User License Agreement (EULA)", href: "/legal/eula" },
  { label: "Form CRS (Customer Relationship Summary)", href: "/legal/crs" },
  { label: "Reg BI (Regulation Best Interest Disclosure)", href: "/legal/reg-bi-disclosure" },
  { label: "Acceptable Use Policy", href: "/legal/acceptable-use" },
  { label: "Community Guidelines", href: "/legal/community-guidelines" },
  { label: "DMCA and Copyright Policy", href: "/legal/dmca-policy" },
  { label: "Rewards Program Terms and Conditions", href: "/legal/rewards-terms" },
  { label: "Sweepstakes Program Terms", href: "/legal/sweepstakes-rules" },
  { label: "UBverse Disclaimer", href: "/legal/ubverse-disclaimer-for-unboundx" },
  { label: "Post Disclaimer", href: "/legal/post-disclaimer" },
  { label: "Support", href: "/legal/support" },
  { label: "Contact Us", href: "/legal/contact-us" },
];

const brokerageDisclosures = [
  {
    label: "Brokerage Services Disclaimer",
    href: "http://marvcapital.com/disclaimers/",
    external: true,
  },
  {
    label: "MARV Capital Inc. Customer Agreement",
    href: "/legal/marv-agreement",
    external: false,
  },
  {
    label: "Alpaca Securities LLC Agreements",
    href: "https://files.alpaca.markets/disclosures/alpaca_customer_agreement.pdf",
    external: true,
  },
];

const investmentDisclaimers = [
  {
    label: "Investment & Securities Disclaimers",
    href: "/legal/investment-disclaimers",
  },
];

export default function LegalHubPage() {
  return (
    <LegalShell>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          UnBound X Legal Hub
        </h1>
        <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-600">
          Welcome to the Legal Hub for UnBound X. This page provides direct access to
          all legal policies, disclaimers, and regulatory agreements governing your use
          of the UnBound X platform and affiliated services. Please review each section
          carefully.
        </p>

        {/* Section 1: Platform Policies */}
        <section className="mt-7">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Platform Policies (UnBound X Inc.)
          </h2>
          <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-600">
            These documents govern your use of the UnBound X technology platform,
            including mobile applications, community features, and educational content.
          </p>
          <ol className="mt-4 list-decimal pl-5 space-y-2 text-sm sm:text-[15px] text-slate-700">
            {platformPolicies.map((item) => (
              <li key={item.href}>
                <TransitionLink
                  href={item.href}
                  className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                >
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ol>
        </section>

        {/* Section 2: Brokerage Disclosures */}
        <section className="mt-7">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Brokerage Disclosures (MARV Capital Inc. &amp; Alpaca Securities LLC)
          </h2>
          <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-600">
            These documents apply only to users aged 18+ who engage in
            securities-related services. UnBound X does not provide brokerage services
            or investment advice.
          </p>
          <ol className="mt-4 list-decimal pl-5 space-y-2 text-sm sm:text-[15px] text-slate-700">
            {brokerageDisclosures.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                  >
                    {item.label}
                  </a>
                ) : (
                  <TransitionLink
                    href={item.href}
                    className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                  >
                    {item.label}
                  </TransitionLink>
                )}
              </li>
            ))}
          </ol>
        </section>

        {/* Section 3: Investment & Securities Disclaimers */}
        <section className="mt-7">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Investment &amp; Securities Disclaimers
          </h2>
          <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-600">
            These documents clarify the educational-only nature of investment content
            and outline associated risks.
          </p>
          <ol className="mt-4 list-decimal pl-5 space-y-2 text-sm sm:text-[15px] text-slate-700">
            {investmentDisclaimers.map((item) => (
              <li key={item.href}>
                <TransitionLink
                  href={item.href}
                  className="text-blue-600 underline underline-offset-2 hover:text-blue-800"
                >
                  {item.label}
                </TransitionLink>
              </li>
            ))}
          </ol>
        </section>

        {/* Section 4: Entity Separation Notice */}
        <section className="mt-7">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Entity Separation Notice
          </h2>
          <p className="mt-3 text-sm sm:text-[15px] leading-relaxed text-slate-600">
            UnBound X Inc. is a technology platform. Securities-related services are
            provided exclusively by MARV Capital Inc., a FINRA-registered
            broker-dealer. Clearing and custody are handled by Alpaca Securities LLC,
            member FINRA/SIPC. All regulated customer data is encrypted and
            transmitted directly to MARV Capital Inc. UnBound X does not store or
            process brokerage data.
          </p>
        </section>

        {/* Section 5: Affiliate Disclosure */}
        <section className="mt-7">
          <h2 className="text-base sm:text-lg font-bold text-slate-900">
            Affiliate Disclosure
          </h2>
          <div className="mt-3 space-y-4 text-sm sm:text-[15px] leading-relaxed text-slate-600">
            <p>
              UnBound X, Inc. is under common ownership with MARV Capital Inc., a
              FINRA-registered broker-dealer. Maneesh Awasthi holds ownership
              interests in both companies.
            </p>
            <p>
              UnBound X is not a broker-dealer and does not provide brokerage
              services. Brokerage services are provided exclusively by MARV Capital
              Inc., with clearing and custody provided by Alpaca Securities LLC.
            </p>
          </div>
        </section>
      </div>
    </LegalShell>
  );
}
