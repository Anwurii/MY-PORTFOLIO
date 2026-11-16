# CLAUDE.md

## Scope

**Homepage only.** The single route is `/`. Do not add About, case-study or
other pages until the homepage is complete and approved.

## Design reference

Two files, both authoritative:

- `design-reference/hero-reference.png` (2000 × 1250) — the nav and hero.
  This is the detailed one; use it for anything above the ticker.
- `design-reference/homepage-reference.png` (727 × 2000) — the full page.
  Use it for section order and for everything below the hero.

**The design frame is 1512px CSS.** The hero export is 2000px wide, so the
image scale is 2000/1512 = 1.3228 — divide any pixel measured in that image by
1.3228 to get CSS px. Layout is written against that frame with

```css
--u: min(1px, 0.0661376vw);   /* 1px at 1512, proportional below */
```

so a measured value V becomes `calc(V * var(--u))`. The nav has its own unit
`--nu` with a floor, so it neither grows past its measured size nor squeezes.
See ASSET-CHECKLIST.md for the full measurement table.

This is an implementation task, not a redesign. Do not add cards, gradients,
shadows, sections or effects that are not in the reference.

## Stack

- **Next.js 16 (App Router) + React 19 + TypeScript**
- Plain CSS, one stylesheet per component, tokens in `src/app/tokens.css`
- No animation library. The hero entrance is pure CSS; the scroll reveals use
  `src/hooks/useInView.ts` (IntersectionObserver + a scroll backstop) with the
  transition in `src/components/Reveal/Reveal.css`
- `next/image` for every bitmap. The hero portrait carries `priority`.
- `lucide-react` for UI icons; brand marks are inline SVG
- Helvetica Neue via the local system stack — **no web font files**, so it is
  the real face on macOS/iOS only and falls back to Arial elsewhere

No backend, database, auth, CMS or paid service.

## Commands

```bash
npm run dev        # dev server, http://localhost:3000
npm run build      # production build (runs TypeScript)
npm start          # serve the production build
npm run lint
npm run typecheck
```

`npm run build` runs TypeScript, so it is the check to run before committing.

## Server and client components

The page is **statically prerendered** — the whole homepage is real HTML in
the response, which is the point of the Next.js move: most AI crawlers and
several search crawlers do not execute JavaScript.

Keep it that way. Only these are `'use client'`, and only because they hold
state or touch browser APIs: `Nav`, `Ticker`, `Reveal`, `CopyEmail`,
`BackToTop`. Everything else is a server component. Before adding
`'use client'` to a section, check whether the interactive part can be split
into a small leaf component instead.

To verify after any change:

```bash
npm run build && npm start
curl -s http://localhost:3000/ | sed 's/<script[^>]*>.*<\/script>//g; s/<[^>]*>/ /g' | tr -s '[:space:]' ' '
```

The section copy must all be there.

## Hydration rules (learned the hard way)

The page is prerendered, so **the server cannot know anything browser-specific**
— stored theme, window size, locale, time. Anything read during render that
the server could not produce causes a hydration mismatch, and React responds
by throwing away the server HTML and re-rendering the whole tree on the
client. That costs the SSR benefit the Next.js move was for.

Three rules that keep it clean:

1. **Never read `localStorage` (or any browser state) during render.** Use
   `useSyncExternalStore` with a server snapshot that matches what the server
   rendered — see `src/hooks/useTheme.ts`.
2. **Never branch rendered output on that state.** The theme control renders
   *both* the sun and the moon and lets CSS pick one off
   `<html data-theme>`; the attribute is set before first paint, so the right
   mark is painted immediately without React being involved. Same for labels:
   keep them static and let `aria-pressed` carry the state.
3. **Constants shared between an inline script and a client hook must live in
   a module with no `'use client'`** — `src/lib/theme.ts`. Importing a value
   from a `'use client'` module into a server component gives you a client
   reference stub, not the value, and it serialises into the script as a
   function that throws. That bug is silent: the build passes and the script
   runs, it just reads the wrong key.

`<html>` carries `suppressHydrationWarning`. It covers that element's own
attributes only, and it is there for two reasons: the theme script rewrites
`data-theme` before hydration, and browser extensions inject attributes there
(`webcrx`, `cz-shortcut-listen`, `data-lt-installed`). It does **not** excuse
a mismatch anywhere else — fix those properly.

Inline scripts go through `src/components/InlineScript.tsx`, which renders
`type="text/javascript"` on the server and `text/plain` on the client so
React does not warn. `next/script` with `beforeInteractive` is **not** an
alternative for inline code: it is for fetching external files by `src`, it
emits nothing for inline content, and it does not block hydration.

## SEO

- One value drives everything: `NEXT_PUBLIC_SITE_URL`. Unset ⇒ `noindex` plus
  a blanket robots.txt disallow, so previews cannot be indexed.
- `src/lib/seo.ts` builds the schema.org graph (Person, WebSite, ProfilePage,
  FAQPage, ItemList) from `src/data/site.ts`. Add copy there, not in the graph.
- `sameAs` is deliberately empty until verified profile URLs exist.
- Route handlers: `robots.ts`, `sitemap.ts`, `manifest.ts`,
  `opengraph-image.tsx`. `public/llms.txt` is a plain-text summary for AI
  crawlers (a convention, not a standard).

## Conventions

- All copy and destinations live in `src/data/site.ts`. Never hard-code copy in
  a component, and never invent an email address, URL, resume link or personal
  claim — leave it `null` and render the control non-interactive.
- Every section is its own component under `src/components/<Name>/`.
- Support `prefers-reduced-motion` in anything that moves. The hero's entrance
  lives entirely inside `@media (prefers-reduced-motion: no-preference)` in
  Hero.css, including the `clip-path` the word reveal depends on, so reduced
  motion renders the final state with nothing clipped.
- The six words sit in `.hero__word` (clip box) > `.hero__ink` (the thing that
  moves). The clip is cut ~4px below the baseline so the words rise out from
  behind the baseline hairline; the hairlines never move.
- Below 760px the hero drops its absolute canvas for a stacked flow layout;
  keep the six words interleaved there so the sentence still reads.
- Never fix overflow with a global `overflow: hidden`.
- The site is dark-first with a working light theme (`data-theme` on `<html>`,
  see `src/hooks/useTheme.ts`). Every new section must use the colour tokens,
  never a hard-coded `#000` or `#fff`, so both themes keep working.
- Sections in reference order: Nav · Hero · Ticker · Selected Work · Quote ·
  Before You Ask · Closing · Footer.

## Milestones

1. ✅ Setup, navigation, hero — measured against the 1512px frame, real
   portrait in place, mail + theme controls working
2. ✅ Skills ticker, Selected Work
3. ✅ Quote, FAQ, closing section, footer
4. ✅ Refinement pass: endless ticker, project links + case studies, FAQ
   hover, custom cursor, footer headline reveal, footer cards, real social
   links, perspective grid
5. ⬜ Remaining: case study narrative content (blocked — see
   ASSET-CHECKLIST.md), deeper a11y audit

Migrated from Vite to Next.js after milestone 3; rendering verified unchanged
(all six hero words still land within 0.0px of the reference).

## Measuring against the full-page reference

`homepage-reference.png` is 727px wide for the same 1512px frame, so
**CSS = image px × 2.0798**. Beware: at that resolution antialiasing inflates
measured ink heights by 20–30%, which makes cap-height a bad way to derive
font sizes. Derive sizes from measured *widths* instead — render the string in
the browser and solve for the size that reproduces the reference width. Doing
that gave a consistent 30.6px across all five FAQ questions, where cap height
had suggested 35px.

Body copy across the site is tracked at **-0.05em** (the hero's -1.4px at 28px
is the same thing).
