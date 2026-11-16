# my-portfolio

Anwurii's portfolio homepage — Next.js (App Router) + TypeScript.

## Requirements

Node 18.18 or newer (built on Node 24).

## Commands

```bash
npm install      # install dependencies
npm run dev      # dev server on http://localhost:3000
npm run build    # production build
npm start        # serve the production build
npm run lint     # eslint
npm run typecheck
```

## Before you publish: set your domain

Canonical URLs, the sitemap, robots.txt, the social card and the structured
data all derive from one value:

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

Set it in `.env.local` and in Vercel's project settings. **Until it is set the
site serves `noindex` and robots.txt disallows everything** — that is
deliberate, so preview deployments cannot be indexed in place of the real
site. See `.env.example`.

## Project layout

```
design-reference/        the visual source of truth (do not edit)
public/
  favicon.svg
  llms.txt               plain-text summary for AI crawlers
  images/
    portrait.jpg
    work/
src/
  app/
    layout.tsx           metadata, theme script, JSON-LD
    page.tsx             the homepage
    globals.css          reset, base type, shared utilities
    tokens.css           design tokens measured from the reference
    robots.ts            robots.txt
    sitemap.ts           sitemap.xml
    manifest.ts          web app manifest
    opengraph-image.tsx  1200×630 social card, generated at build
  components/            one folder per section
  data/site.ts           all editable copy and destinations
  hooks/                 useTheme, useInView
  lib/seo.ts             site URL + schema.org graph
```

## Editing content

Everything the page says lives in [`src/data/site.ts`](src/data/site.ts).
Values that have not been confirmed are `null`, and the components render
those as non-interactive rather than inventing a link. The structured data in
`src/lib/seo.ts` reads from the same file, so copy and schema cannot drift.

## Typeface

Helvetica Neue via the local system stack — no web font files are bundled, so
it renders in the real face on macOS and iOS and falls back to Arial
elsewhere. See ASSET-CHECKLIST.md.

## Scope

Homepage (`/`) only. About and case-study pages are not built yet.
