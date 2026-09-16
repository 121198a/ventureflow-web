# UnBound X — Marketing Site

Next.js 15 (App Router) + Tailwind + TypeScript + Framer Motion.

## Structure
```
app/                     Routes (pages only — no logic lives here)
  page.tsx                 Home — hero, trust comparison, thesis journey,
                            spaces, beyond-the-feed, trade/compete, CTA
  about/page.tsx            About UnBound X
  ubverse/page.tsx          UBverse product pillars
  get-started/page.tsx      Signup / waitlist
  layout.tsx                Root layout: fonts + wraps every page in SiteNav/SiteFooter
  globals.css                Base reset + heading font rule

components/
  layout/SiteShell.tsx      SiteNav + SiteFooter (scroll-aware nav shadow, animated
                            mobile menu, fade-in-on-scroll footer, back-to-top)
  sections/                 One file per homepage section, in the order they render
  ui/                        Small reusable primitives:
                              - Button, Container, PhoneFrame
                              - Reveal / RevealGroup: scroll-triggered fade+slide-up
                                (Framer Motion, respects prefers-reduced-motion)
                              - CountUp: animated count-up number (used by the 61% stat)

lib/
  constants.ts               Site name, nav links, copy
  utils.ts                    `cn()` classname helper
```

## Run locally
```
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
```

## Fonts
Headings use **Poppins** (500–800), body text uses **Inter** — both self-hosted via
`next/font/google` in `app/layout.tsx` (no runtime request to Google, downloaded once
at build time). The very first `npm run build` needs internet access to fetch these;
any normal host (Vercel, Netlify, your own CI) has that by default.

## Animation
Every section fades/slides into view on scroll via the `Reveal` component. The hero's
proof cards animate differently on mobile vs. desktop by design: they float around the
phone mockup on md+ screens, and stack into a 2-column grid below it on small screens —
same data, two layouts.

## Notes
- Only `/public/logo/*` are original brand assets and were left untouched.
- Every other page/section was rewritten from the original GrowthBridge agency
  template to match the UnBound X product design.

## Integration notes

This repository is a Next.js App Router application. It does **not** require a separate Express backend.

### Runtime API architecture

```text
Browser / React UI
        |
        v
Next.js App Router + /app/api/*
        |
        v
lib/ubverse-api.ts
        |
        v
NEXT_PUBLIC_UBVERSE_API_URL
(default: https://development.unboundxinc.us/api)
```

The existing integration points are intentionally preserved:

- Public company listing: `ubverse-service/investor-dashboard/dashboard-without-auth`
- Company detail: `ubverse-service/general/get-issuer-detail/{companyId}`
- Backend login: `user-service/user/login`
- Newsletter subscription: `ubverse-service/newsletter/save-user-email` and `subscribe-news-letter`
- Support session: `zenithv2/support-chat/initiate_chat`
- Supabase remains responsible for the existing auth/storage/application flows where configured.

### Newsletter

The nine existing newsletter articles remain in `lib/newsletter-data.ts`. The `/api/newsletter/articles` routes expose that existing dataset; no unverified remote article endpoint has been invented.

### Support chat

The current implementation creates a support-chat session through the verified `initiate_chat` integration. The reference materials did not establish a verified message-send endpoint, so no fabricated message endpoint was added.

### Development

```bash
npm install
npm run dev
```

For a production-style local run:

```bash
npm run build
npm run start
```

Copy `.env.example` to `.env.local` and set environment-specific values before deployment.

## Canonical UBverse company/deal URLs

Company/deal pages now use the reference-style root slug route:

- `https://development.unboundxinc.us/virani-chem-pvt-limited`
- `https://development.unboundxinc.us/infopulse-technology`
- `https://development.unboundxinc.us/unbound-x`
- `https://development.unboundxinc.us/hopiyant-tech`

The old `/offerings/:slug` route is retained only as a compatibility redirect. Both the canonical route and the legacy route resolve the same `DealDetail` component and the same `getDynamicOffering()` -> dashboard company ID -> `get-issuer-detail/{companyId}` backend flow.

`NEXT_PUBLIC_SITE_URL` controls the public/canonical origin and is set to `https://development.unboundxinc.us` in `.env.example`. Running `npm run dev` still serves the application locally at `http://localhost:3000`; a browser address bar cannot display the production hostname while the browser is actually connected to localhost unless DNS/reverse-proxy/deployment points that hostname to this application.
