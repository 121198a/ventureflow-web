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
          <h5 className="ftr-heading">Platform</h5>
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
          <h5 className="ftr-heading">Legal &amp; Compliance</h5>
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
          <h5 className="ftr-heading">Contact</h5>
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
              <strong>Platform Overview:</strong> UBverse is a private markets technology and administrative services platform operated by UnBound X Inc. UBverse is not a registered broker-dealer, investment advisor, or funding portal, and does not provide investment advice, recommendations, or endorsements regarding any investment opportunities available on the platform.
            </p>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Broker-Dealer:</strong> Securities are offered through MARV Capital, Inc., an SEC-registered broker-dealer and member of FINRA/SIPC (CRD #104390). All securities-related activity is conducted through MARV Capital, Inc., unless otherwise specified. In the event that a different broker-dealer is engaged for a particular offering, such broker-dealer will be identified on the applicable offering materials, and all securities-related activities for that offering will be conducted through that broker-dealer. You can review the background of MARV Capital and its investment professionals on FINRA&apos;s{" "}
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
              <strong>Offering Type:</strong> Offerings on UBverse may be conducted pursuant to Regulation D (including Rule 506(c)), Regulation A (commonly referred to as &ldquo;Regulation A+&rdquo;), Regulation Crowdfunding, or other applicable exemptions from registration under the Securities Act of 1933, as disclosed in the applicable offering materials. Eligibility requirements, including accredited investor status where applicable, and any required investor verification or qualification procedures, will be determined based on the specific exemption relied upon and must be satisfied prior to the acceptance of any investment.
            </p>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>No Investment Advice:</strong> Neither UBverse nor MARV Capital, Inc. provide investment advice, recommendations, or endorsements regarding any specific investment opportunity. UBverse serves solely as a technology intermediary, facilitating connections between issuers and accredited investors. The appearance of any company on the platform does not constitute an endorsement or solicitation. All investment decisions are the sole responsibility of the investor. You should conduct your own due diligence and consult with qualified financial, legal, and tax advisors before making any investment decision.
            </p>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Issuer-Provided Information:</strong> All information on the platform — including company profiles, financial data, projections, and founder statements — is provided by the applicable issuer and has not been independently verified by UBverse or MARV Capital, Inc. Issuers have a direct financial interest in the success of their offerings and may present information in a manner that is incomplete, inaccurate, or inherently favorable. UBverse makes no representation regarding the accuracy, completeness, or reliability of any issuer-provided information. UBverse does not endorse or recommend any issuer, investment, or investor, and display on the platform should not be construed as such.
            </p>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Testimonials &amp; Endorsements:</strong> The platform may display testimonials, endorsements, or statements from founders, existing investors (including accredited investors, angel investors, venture capital firms, and other institutional or retail investors), or other third parties. These statements reflect the personal opinions of the individuals providing them and may not be representative of the experience of all users or investors. Testimonials are not a guarantee of future performance or success. Persons providing testimonials may have material conflicts of interest, including financial incentives to promote an offering. Where compensation has been provided, it will be disclosed. UBverse does not independently verify testimonials. UBverse, an affiliate of UnBound X Inc., may hold equity or warrants in companies listed on the platform, which may create additional conflicts of interest.
            </p>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Investment Risks:</strong> Investments in private securities are speculative, illiquid, and involve substantial risk. You should not invest any funds unless you can afford to lose your entire investment. These investments are suitable only for investors who can bear the economic risk of a total loss and who have sufficient knowledge and experience to evaluate the merits and risks of prospective investments.
            </p>

            <div className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Key Risks to Consider:</strong>
              <ul style={{ marginTop: "8px", marginBottom: "0px", paddingLeft: "18px" }}>
                <li>
                  <strong>Illiquidity:</strong> There is no established trading market for these securities. You may not be able to sell your investment when desired, and shares are subject to significant restrictions on transfer and resale.
                </li>
                <li>
                  <strong>Total Loss:</strong> Many startups and early-stage companies fail. You may lose your entire investment.
                </li>
                <li>
                  <strong>Dilution:</strong> Your ownership percentage may be reduced through future fundraising rounds.
                </li>
                <li>
                  <strong>Limited Information:</strong> Private companies provide limited financial information compared to public companies.
                </li>
                <li>
                  <strong>Valuation:</strong> Valuations of private companies are highly subjective and may not reflect actual market value.
                </li>
              </ul>
            </div>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>No Regulatory Approval:</strong> This communication is provided for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any securities. No securities regulatory authority has approved or disapproved of any offering on this platform.
            </p>

            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>For Issuers:</strong> Issuers using the platform are solely responsible for compliance with all applicable federal and state securities laws. UBverse does not review, approve, or make any representation regarding the legality, accuracy, or completeness of any offering materials. Use of the platform does not guarantee capital formation, investor participation, or the success of any offering.
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
