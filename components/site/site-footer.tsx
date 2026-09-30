import Link from "next/link";
import { BrandLogo } from "./brand-logo";

export function SiteFooter() {
  return (
    <footer className="ftr-scn">
      <div className="ftr-container">
        <div className="ftr-item brand">
          <BrandLogo />
          <div className="shaping-tagline text-sm">
            VentureFlow — Startup–Investor Workspace. A workspace for startup discovery, collaboration,
            introductions, documents and relationship management.
          </div>
        </div>

        <div className="ftr-item links">
          <h3 className="ftr-heading">Workspace</h3>
          <ul className="useful-links">
            <li>
              <Link className="ftr-link" href="/investor/login">
                Investor workspace
              </Link>
            </li>
            <li>
              <Link className="ftr-link" href="/issuer/login">
                Founder workspace
              </Link>
            </li>
            <li>
              <Link className="ftr-link" href="/services">
                Services
              </Link>
            </li>
          </ul>
        </div>

        <div className="ftr-item links">
          <h3 className="ftr-heading">Legal</h3>
          <ul className="useful-links">
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
              <Link className="ftr-link" href="/legal/workspace-disclaimer-for-ventureflow">
                Workspace Disclaimer
              </Link>
            </li>
          </ul>
        </div>

        <div className="ftr-item links">
          <h3 className="ftr-heading">Contact</h3>
          <ul className="useful-links">
            <li>
              <a href="mailto:hello@ventureflow.example" className="ftr-link">
                hello@ventureflow.example
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

          <h3>About this workspace</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Overview:</strong> VentureFlow is a collaboration workspace for founders and investors. It helps
              people share profiles, make introductions, exchange messages and keep notes and documents in one place.
            </p>
            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>No financial services:</strong> VentureFlow does not provide investment, legal or tax advice, and
              it does not arrange or execute financial transactions.
            </p>
            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>User-provided information:</strong> Profiles and documents are provided by their owners.
              VentureFlow does not verify or endorse them. Sample profiles shown on this site are fictional.
            </p>
            <p className="pricing-disclaimer-p" style={{ marginBottom: "0px" }}>
              <strong>Terms:</strong> By using VentureFlow, you agree to our{" "}
              <Link href="/legal/terms-condition" className="disclaimer-link">
                Terms of Use
              </Link>
              <span> and </span>
              <Link href="/legal/privacy-policy" className="disclaimer-link">
                Privacy Policy
              </Link>
              <span>.</span>
            </p>
            <div className="disclaimer-footer">© 2026 VentureFlow by Veyron X. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
