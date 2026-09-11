# GrowthBridge — Extracted Subset (Home, UBverse, About, Login)

This is an isolated subset of the original GrowthBridge_Final project,
containing only the routes, components, hooks, and assets required for:

- **Home** — `/` (`app/(marketing)/page.tsx`)
- **UBverse** — `/ubverse` (`app/(marketing)/ubverse/page.tsx`)
- **About** — `/about` (`app/(marketing)/about/page.tsx`)
- **Login** — `/login` (`app/(marketing)/login/page.tsx`)

No code was rewritten, redesigned, or recreated — every file here is copied
verbatim from the original project. Only files with no import path from
these four routes were excluded (e.g. `app/platform/**`, `app/legal/**`,
`app/(marketing)/blog|careers|press|get-started`, `app/ubverse/companies`,
and their exclusive dependencies).

## Setup
```
npm install
npm run dev
```

## Verified
`npm run build` completes successfully and statically generates exactly
these routes: `/`, `/about`, `/ubverse`, `/login` (plus `/robots.txt`,
`/icon.svg`, `/apple-icon.png`). No missing-module or broken-asset errors.

## Notes
- `NEXT_PUBLIC_LOGIN_URL` (see `.env.example`) controls where auth CTAs
  point; it defaults to the included `/login` route.
- Footer/legal links (Terms, Privacy) point to `/legal/*`, which is outside
  this subset by design (per the extraction scope) and will 404 unless you
  also copy those routes back in.
