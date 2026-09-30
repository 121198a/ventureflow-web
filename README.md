# VentureFlow — Marketing Site

Next.js 15 (App Router) + Tailwind + TypeScript + Framer Motion.

## Structure
```
app/                     Routes (pages only — no logic lives here)
  page.tsx                 Home — hero, trust comparison, thesis journey,
                            spaces, beyond-the-feed, trade/compete, CTA
  about/page.tsx            About VentureFlow
  workspace/page.tsx          VentureFlow product pillars
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
- Every other page/section was rewritten from the original VentureFlow agency
  template to match the VentureFlow product design.

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
lib/workspace-api.ts
        |
        v
NEXT_PUBLIC_WORKSPACE_API_URL
(default: https://api.ventureflow.example/api)
```

The existing integration points are intentionally preserved:

- Public company listing: `workspace-service/investor-dashboard/dashboard-without-auth`
- Company detail: `workspace-service/general/get-issuer-detail/{companyId}`
- Backend login: `user-service/user/login`
- Newsletter subscription: `workspace-service/newsletter/save-user-email` and `subscribe-news-letter`
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

## Startup profile URLs

Startup profile pages use a root slug route. The bundled demo profiles are fictional:

- `/northstar-labs`
- `/novaforge`
- `/vertexworks`

The old `/offerings/:slug` route is kept only as a compatibility redirect. `NEXT_PUBLIC_SITE_URL` controls the public canonical origin (see `.env.example`). Running `npm run dev` serves the app locally at `http://localhost:3000`.
