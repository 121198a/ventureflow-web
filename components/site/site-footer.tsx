import Link from "next/link";
import { BrandLogo } from "./brand-logo";

export function SiteFooter() {
  return (
    <footer className="ftr-scn">
      <div className="ftr-container">
        <div className="ftr-item brand">
          <BrandLogo />
          <div className="shaping-tagline text-sm">
            A private markets technology and administrative services platform operated by UnBound X Inc.
          </div>
          <div className="copyright desktop-view">
            Securities offered through MARV Capital, Inc. SEC-registered broker-dealer · Member FINRA/SIPC <br />
            CRD #104390
          </div>
        </div>

        <div className="ftr-item links">
          <h3 className="ftr-heading">Platform</h3>
          <ul className="useful-links">
            <li>
              <Link className="ftr-link" href="/investor/login">
                For Investors
              </Link>
            </li>
            <li>
              <Link className="ftr-link" href="/issuer/login">
                For Companies
              </Link>
            </li>
            <li>
              <Link className="ftr-link" href="/services">
                Service Tiers
              </Link>
            </li>
          </ul>
        </div>

        <div className="ftr-item links">
          <h3 className="ftr-heading">Legal &amp; Compliance</h3>
          <ul className="useful-links">
            <li>
              <Link className="ftr-link" href="/legal/ubverse-disclaimer-for-unboundx">
                Platform Disclaimer
              </Link>
            </li>
            <li>
              <Link className="ftr-link" href="/legal/terms-condition">
                Terms of Use
              </Link>
            </li>
            <li>
              <Link className="ftr-link" href="/legal/privacy-policy">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link className="ftr-link" href="/legal/crs">
                Form CRS
              </Link>
            </li>
            <li>
              <Link className="ftr-link" href="/legal/reg-bi-disclosure">
                Reg. BI Disclosure
              </Link>
            </li>
          </ul>
        </div>

        <div className="ftr-item links">
          <h3 className="ftr-heading">Contact</h3>
          <ul className="useful-links">
            <li>
              <a
                href="https://www.unboundxinc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ftr-link"
              >
                www.unboundxinc.com
              </a>
            </li>
            <li>
              <a
                href="mailto:info@unboundxinc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="ftr-link"
              >
                info@unboundxinc.com
              </a>
            </li>
            <li className="finra">FINRA BrokerCheck:</li>
            <li>
              <a
                href="https://brokercheck.finra.org/individual/summary/104390"
                target="_blank"
                rel="noopener noreferrer"
                className="ftr-link"
              >
                www.finra.org/brokercheck
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="disclaimer-section">
        <div className="inside-disclaimer-section">
          <div className="disclaimer-divider">
            <div className="divider" />
          </div>

          <h3>Important Investment Information</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Platform Overview:</strong> UBverse is a technology and administrative platform run by UnBound X Inc. for private markets. UBverse is not a registered broker-dealer, investment advisor, or funding portal. We do not provide investment advice, endorsements, or recommendations for any company on the platform.
            </p>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Broker-Dealer:</strong> Securities are offered through MARV Capital, Inc., an SEC-registered broker-dealer and member of FINRA/SIPC (CRD #104390). All securities activity runs through MARV Capital, Inc. unless otherwise stated. If another broker-dealer is used for an offering, that partner will be clearly identified in the deal documents. You can review MARV Capital and its team on FINRA&apos;s{" "}
              <a
                href="https://www.finra.org/brokercheck"
                target="_blank"
                rel="noopener noreferrer"
                className="disclaimer-link"
              >
                BrokerCheck
              </a>
              .
            </p>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Offering Type:</strong> Offerings on UBverse may use Regulation D (including Rule 506(c)), Regulation A, Regulation Crowdfunding, or other legal exemptions under the Securities Act of 1933. Investor requirements—such as accredited investor verification—depend on the chosen rule and must be completed before any investment is accepted.
            </p>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>No Investment Advice:</strong> Neither UBverse nor MARV Capital, Inc. gives investment advice or endorses any offering. UBverse acts only as a technology platform connecting companies and accredited investors. Showing a company on the site is not a recommendation. All investment decisions are your own responsibility. Please do your own research and speak with financial, legal, and tax advisors before investing.
            </p>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Issuer-Provided Information:</strong> All company information on the platform—including profiles, numbers, projections, and founder statements—comes directly from the company. It has not been independently verified by UBverse or MARV Capital, Inc. Companies have a financial interest in their offerings and may present favorable views. UBverse does not guarantee the accuracy or completeness of company materials.
            </p>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Testimonials &amp; Endorsements:</strong> The platform may show testimonials from founders, investors, or third parties. These represent personal views and may not reflect everyone&apos;s experience. Testimonials do not guarantee future performance. Reviewers may have financial conflicts of interest, which will be disclosed if compensation was given. UBverse does not verify testimonials and may hold equity in listed companies.
            </p>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Investment Risks:</strong> Private market investments are speculative, illiquid, and carry substantial risk. You should only invest money you can afford to lose completely. These investments are suited only for investors who understand these risks and can bear a total loss.
            </p>

            <div className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Key Risks to Consider:</strong>
              <ul style={{ marginTop: "8px", marginBottom: "0px", paddingLeft: "18px" }}>
                <li>
                  <strong>Illiquidity:</strong> There is no public market for these shares. You may not be able to sell when you want, and transfers are restricted.
                </li>
                <li>
                  <strong>Total Loss:</strong> Early-stage companies carry high risk. You may lose your entire investment.
                </li>
                <li>
                  <strong>Dilution:</strong> Future funding rounds may reduce your ownership percentage.
                </li>
                <li>
                  <strong>Limited Information:</strong> Private companies share less financial data than public companies.
                </li>
                <li>
                  <strong>Valuation:</strong> Private valuations are subjective and may not reflect real market value.
                </li>
              </ul>
            </div>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>No Regulatory Approval:</strong> This material is for informational purposes only. It is not an offer to sell or an invitation to buy any securities. No government or regulatory authority has reviewed or approved any offering on this platform.
            </p>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>For Issuers:</strong> Companies using UBverse are solely responsible for following all federal and state securities laws. UBverse does not review or guarantee the legality or accuracy of offering documents. Using the platform does not guarantee successful fundraising.
            </p>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Terms:</strong> By using UBverse, you agree to our{" "}
              <Link href="/legal/terms-condition" className="disclaimer-link">
                Terms of Use
              </Link>
              <span> and </span>
              <Link href="/legal/privacy-policy" className="disclaimer-link">
                Privacy Policy
              </Link>
              <span>.</span>
            </p>

            <div className="disclaimer-footer">
              © 2026 UnBound X Inc. All rights reserved. UBverse is operated by UnBound X Inc. Securities are offered through broker-dealers that are members of FINRA and SIPC, as disclosed in the applicable offering materials.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
