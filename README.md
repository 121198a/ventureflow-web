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
