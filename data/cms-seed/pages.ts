/**
 * SEED SOURCE ONLY. This file is read by `npm run cms:seed` to populate the database.
 * The website never imports it: the database is the single source of truth.
 *
 * Content describes what VentureFlow actually is: a startup-investor workspace for profiles,
 * introductions, messages, notes and documents. It makes no claims about licences, registrations,
 * custody, brokerage or investment services. Company/address/phone details are intentionally
 * absent until the owner supplies verified values. Have qualified counsel review before launch.
 */
import type { PageInput } from "../../lib/cms/types.ts";

const h2 = (text: string) => ({ type: "heading", level: 2, text }) as const;
const p = (text: string) => ({ type: "paragraph", text }) as const;
const ul = (...items: string[]) => ({ type: "list", items }) as const;
const ol = (...items: string[]) => ({ type: "list", ordered: true, items }) as const;
const contact = { type: "link", label: "Contact us at hello@ventureflow.example", href: "mailto:hello@ventureflow.example" } as const;

export const seedPages: PageInput[] = [
  {
    slug: "terms-condition",
    title: "Terms of Use",
    description: "The terms that apply when you use the VentureFlow workspace.",
    category: "legal",
    seo: { title: "Terms of Use — VentureFlow", description: "The terms that apply when you use the VentureFlow workspace." },
    content: [
      h2("About these terms"),
      p("VentureFlow by Veyron X provides a workspace where founders, startups and investors can publish profiles, request introductions, exchange messages and keep notes and documents. By creating an account or using the workspace you agree to these terms."),
      h2("Your account"),
      ul("Provide accurate information and keep it up to date.", "Keep your sign-in details secure. You are responsible for activity under your account.", "Tell us promptly if you believe your account has been accessed without permission."),
      h2("What you can do"),
      p("You may use the workspace to present your company or investment interests, discover other members, and collaborate with people you choose to connect with. You decide which profile sections and documents are visible to others."),
      h2("What VentureFlow is not"),
      p("VentureFlow is a collaboration tool. It does not give investment, legal, tax or accounting advice, and it does not arrange, broker or execute financial transactions between members. Any agreement between members is made directly between them."),
      h2("Your content"),
      p("You keep ownership of the profiles, messages, notes and documents you add. You give VentureFlow permission to store, display and deliver that content as needed to run the workspace and only to the people you choose."),
      h2("Acceptable use"),
      p("You must follow our Acceptable Use Policy and Community Guidelines. We may limit or remove access where these terms or those policies are broken."),
      { type: "callout", title: "Sample profiles", content: "Any company shown as a sample in the workspace, such as Northhstar Lab Pvt. Ltd., Novaforge Pvt. Ltd. or Vertex Works Pvt. Ltd., is fictional and used for demonstration only." },
      h2("Changes and questions"),
      p("We may update these terms as the workspace evolves. When changes are material we will make that clear in the workspace. Questions about these terms can be sent to us at any time."),
      contact,
    ],
  },
  {
    slug: "privacy-policy",
    title: "Privacy Policy",
    description: "What information VentureFlow handles, why, and the choices you have.",
    category: "legal",
    seo: { title: "Privacy Policy — VentureFlow", description: "What information VentureFlow handles, why, and the choices you have." },
    content: [
      h2("Overview"),
      p("This policy explains what personal information VentureFlow by Veyron X handles when you use the workspace, how it is used and the choices you have."),
      h2("Information we handle"),
      ul("Account details, such as your name, email address and role (founder or investor).", "Profile information you choose to add.", "Messages, notes, introduction requests and documents you create or upload.", "Basic technical data needed to keep the service secure and working, such as session and device information."),
      h2("How we use it"),
      ul("To provide the workspace and show your profile only to the people you choose.", "To deliver messages, notifications and introductions.", "To protect accounts, prevent abuse and fix problems.", "To improve the workspace using aggregated, non-identifying usage information."),
      h2("Sharing"),
      p("Workspace owners control which profile sections and documents other members can see. We do not sell personal information. We use service providers, for example for hosting and authentication, who process data only to help us run VentureFlow."),
      h2("Cookies"),
      p("We use cookies that are required to keep you signed in. Details are in our Cookie Policy."),
      h2("Your choices"),
      ul("You can view and update your profile at any time.", "You can control what you share with other members.", "You can ask us to delete your account. See Delete Your Account."),
      h2("Retention and security"),
      p("We keep information for as long as your account is active or as needed to run the workspace, and we apply reasonable technical and organisational measures to protect it. No online service can guarantee absolute security."),
      h2("Contact"),
      contact,
    ],
  },
  {
    slug: "cookie-policy",
    title: "Cookie Policy",
    description: "How VentureFlow uses cookies and similar technologies.",
    category: "legal",
    seo: { title: "Cookie Policy — VentureFlow", description: "How VentureFlow uses cookies and similar technologies." },
    content: [
      p("Cookies are small files stored in your browser. VentureFlow uses a limited set of them."),
      h2("Cookies we use"),
      { type: "table", columns: ["Purpose", "What it does", "Required"], rows: [["Sign-in", "Keeps you signed in and protects your session.", "Yes"], ["Preferences", "Remembers simple interface choices.", "No"]] },
      h2("Analytics"),
      p("If we enable optional analytics in future, we will describe them on this page and offer a way to opt out where the law requires it."),
      h2("Managing cookies"),
      p("You can clear or block cookies in your browser settings. Blocking required cookies will stop you from signing in."),
    ],
  },
  {
    slug: "acceptable-use",
    title: "Acceptable Use Policy",
    description: "The rules for using VentureFlow responsibly.",
    category: "legal",
    seo: { title: "Acceptable Use Policy — VentureFlow", description: "The rules for using VentureFlow responsibly." },
    content: [
      p("This policy keeps the workspace safe and useful for everyone. It applies to everything you add or do in VentureFlow."),
      h2("Do not"),
      ul("Upload unlawful content or content you do not have the right to share.", "Impersonate another person or company, or misrepresent who you are.", "Harass, threaten or spam other members.", "Try to access accounts, data or systems you are not authorised to use.", "Interfere with, overload or reverse engineer the service.", "Use the workspace to make offers or solicitations that break the law."),
      h2("Reporting a problem"),
      p("If you see content or behaviour that breaks this policy, or you believe content infringes your rights, tell us and include a link to the content and a short explanation."),
      contact,
      h2("Enforcement"),
      p("We may remove content, limit features or close accounts that break this policy. Where appropriate we will explain why."),
    ],
  },
  {
    slug: "workspace-disclaimer-for-ventureflow",
    title: "Workspace Disclaimer",
    description: "What VentureFlow does and does not do.",
    category: "legal",
    seo: { title: "Workspace Disclaimer — VentureFlow", description: "What VentureFlow does and does not do." },
    content: [
      h2("A collaboration workspace"),
      p("VentureFlow helps founders and investors share profiles, make introductions, exchange messages and keep notes and documents together."),
      h2("No financial services"),
      p("VentureFlow does not provide investment, legal, tax or accounting advice. It does not arrange or execute financial transactions, and nothing in the workspace is an offer, recommendation or solicitation."),
      h2("Member-provided information"),
      p("Profiles, updates and documents are provided by their owners. VentureFlow does not verify or endorse them. Please do your own diligence and take independent professional advice before making decisions."),
      h2("Sample data"),
      p("Sample profiles are fictional and exist to show how the workspace looks and works."),
    ],
  },
  {
    slug: "community-guidelines",
    title: "Community Guidelines",
    description: "How we expect members to treat each other.",
    category: "community",
    seo: { title: "Community Guidelines — VentureFlow", description: "How we expect members to treat each other." },
    content: [
      p("VentureFlow works best when conversations are respectful, honest and useful."),
      ol("Be accurate. Share information about yourself and your company truthfully.", "Be respectful. Disagree politely and never harass.", "Respect confidentiality. Do not share another member's documents or messages without permission.", "Be relevant. Send introduction requests and messages that have a clear purpose.", "Report problems. Help us keep the workspace safe."),
      p("Breaking these guidelines may lead to removed content or limited access under our Acceptable Use Policy."),
    ],
  },
  {
    slug: "delete-your-account",
    title: "Delete Your Account",
    description: "How to ask for your VentureFlow account and data to be deleted.",
    category: "support",
    seo: { title: "Delete Your Account — VentureFlow", description: "How to ask for your VentureFlow account and data to be deleted." },
    content: [
      p("You can ask us to delete your account and the personal information linked to it."),
      h2("How to request deletion"),
      ol("Email us from the address registered on your account.", "Tell us you would like your account deleted.", "We will confirm the request and complete it within a reasonable time."),
      { type: "callout", title: "Before you go", content: "Deleting your account removes your profile, messages, notes and documents from the workspace. Content other members have received, such as a message they hold in their own inbox, may remain with them." },
      contact,
    ],
  },
  {
    slug: "support",
    title: "Support",
    description: "Get help with VentureFlow.",
    category: "support",
    seo: { title: "Support — VentureFlow", description: "Get help with VentureFlow." },
    content: [
      p("Need help with your profile, documents, introductions or account? Get in touch and include as much detail as you can, such as what you were trying to do and what happened."),
      contact,
      p("For account deletion requests see Delete Your Account."),
      { type: "link", label: "Delete Your Account", href: "/legal/delete-your-account" },
    ],
  },
];
