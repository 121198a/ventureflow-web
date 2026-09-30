/**
 * Generic legal documents for the VentureFlow workspace.
 * These are starter texts describing the product as a collaboration workspace.
 * They make no claims about licences, registrations or certifications.
 * Have qualified counsel review and adapt them before launch.
 */
export type LegalDoc = { slug: string; title: string; html: string };

const CONTACT = "hello@ventureflow.example";

export const LEGAL_DOCS: LegalDoc[] = [
  {
    slug: "terms-condition",
    title: "Terms of Use",
    html: `<h1>Terms of Use</h1>
<p>These terms govern your use of VentureFlow, a workspace for founders, startups and investors to share profiles, make introductions, exchange messages and keep notes and documents.</p>
<h2>Using the workspace</h2>
<p>You are responsible for the accuracy of the information you add and for keeping your account credentials secure. You agree to use the workspace lawfully and respectfully.</p>
<h2>What VentureFlow is not</h2>
<p>VentureFlow is a collaboration tool. It does not provide investment, legal, tax or accounting advice, and it does not arrange, broker or execute financial transactions between users.</p>
<h2>Content</h2>
<p>Profiles, messages and documents are provided by their owners. VentureFlow does not verify or endorse them. Sample profiles shown on the site are fictional and are used for demonstration only.</p>
<h2>Changes and contact</h2>
<p>We may update these terms from time to time. Questions can be sent to ${CONTACT}.</p>`,
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    html: `<h1>Privacy Policy</h1>
<p>This policy explains what information VentureFlow handles when you use the workspace.</p>
<h2>Information you provide</h2>
<p>Account details, profile information, messages, notes and documents that you choose to add.</p>
<h2>How it is used</h2>
<p>To operate the workspace, show your profile to the people you choose, deliver messages and introductions, and keep the service secure.</p>
<h2>Sharing</h2>
<p>Workspace owners control which documents and profile sections are visible to others. We do not sell personal information.</p>
<h2>Your choices</h2>
<p>You can update or delete your information and request account deletion by contacting ${CONTACT}.</p>`,
  },
  {
    slug: "workspace-disclaimer-for-ventureflow",
    title: "Workspace Disclaimer",
    html: `<h1>Workspace Disclaimer</h1>
<p>VentureFlow is a collaboration workspace for founders and investors.</p>
<h2>No financial services</h2>
<p>VentureFlow does not provide investment advice and does not arrange or execute financial transactions. Nothing in the workspace is an offer, recommendation or solicitation.</p>
<h2>User-provided information</h2>
<p>All profiles, updates and documents come from their owners. VentureFlow does not verify them. Please do your own diligence and seek independent professional advice.</p>
<h2>Sample data</h2>
<p>Companies such as Northhstar Lab Pvt. Ltd., Novaforge Pvt. Ltd. and Vertex Works Pvt. Ltd. are fictional profiles used for demonstration.</p>`,
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    html: `<h1>Cookie Policy</h1>
<p>VentureFlow uses cookies that are needed to keep you signed in and to remember basic preferences. Optional analytics run only after you accept them in the cookie banner.</p>
<p>You can clear cookies at any time in your browser settings. Questions can be sent to ${CONTACT}.</p>`,
  },
  {
    slug: "acceptable-use",
    title: "Acceptable Use Policy",
    html: `<h1>Acceptable Use Policy</h1>
<p>Please use VentureFlow respectfully. Do not upload unlawful content, impersonate others, harass other users, attempt to access data you are not permitted to see, or interfere with the service.</p>
<p>We may limit or remove access for accounts that break these rules. Report concerns to ${CONTACT}.</p>`,
  },
];

export function getLocalLegalDoc(slug: string): LegalDoc | undefined {
  return LEGAL_DOCS.find((d) => d.slug === slug);
}
