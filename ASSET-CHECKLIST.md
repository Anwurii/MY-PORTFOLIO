# Asset and content checklist

Status after the navigation + hero correction pass.

## Resolved since the first pass

| | |
|---|---|
| **Portrait** | Supplied (1024 × 1536) and in use at `public/images/portrait.jpg`. The placeholder is gone. |
| **Email** | Confirmed: `alabiamazingrace3@gmail.com`. Defined once, in `src/data/site.ts`, and used by both contact controls. |
| **Nav icons** | Confirmed: left opens a new mail message, right toggles light/dark. Both built. |
| **Design frame** | Established as **1512px** — see below. |

## Still missing

| # | What | Needed for | Current state |
|---|------|-----------|---------------|
| 1 | **Resume PDF** | Nav → Resume | No file. The Resume item renders dimmed and non-interactive, with "(file not supplied yet)" for screen readers. Drop a PDF in `public/resume/` and set `resumeUrl` in `src/data/site.ts`. |
| 2 | **Helvetica Neue web fonts** | Everything | None supplied — see "Typeface" below. |
| 3 | **Icon exports** | The two nav icons | None supplied. Both are hand-drawn SVG traced from the reference (`src/components/Nav/NavIcons.tsx`). Close, but not your originals. |
| 4 | **Kariya project cover** | Selected Work, bottom-right tile | `kariya-placeholder.svg` at 1400 × 1105, labelled in the artwork and marked with a dashed outline |
| 5 | **Project destinations** | Selected Work | None. All four tiles render as non-interactive `<figure>`s rather than links that go nowhere. The hover and focus styles are already written against `a.work__link`, so they start working the moment `href` values land in `src/data/site.ts`. |
| 6 | **Social destinations** | Footer | None. LinkedIn, Twitter, GitHub and Behance render as dimmed, non-interactive marks, each with a screen-reader note that the link is not supplied. |

## Typeface — please read

**Helvetica Neue is a system font, not a web font.** No font files were
supplied, so the stack is:

```css
"Helvetica Neue", Helvetica, Arial, sans-serif
```

This renders in real Helvetica Neue on **macOS and iOS only**. On Windows,
Android and most Linux it falls back to Arial or Helvetica — metrically close
but not identical, so the pixel measurements below will drift a few percent
for those visitors. It has been verified in the browser that Helvetica Neue
*is* resolving on this machine.

If you have a licensed web-font kit (`.woff2`), put it in `public/fonts/`,
add the `@font-face` rules, and change `--font-sans` in `tokens.css`. That is
the only change needed.

## The design frame

`design-reference/hero-reference.png` is **2000 × 1250**, which is *not* the
frame size. Working back from your stated 130px headings:

- measured headline ink: 172px per em in the image
- 172 / 130 = **1.3228** → frame width = 2000 / 1.3228 = **1512px**

1512 is a standard Figma frame, and every other measurement is consistent with
it, so the hero is built on a 1512 × 960 canvas. The scale is expressed as a
single custom property:

```css
--u: min(1px, 0.0661376vw);   /* 1px at 1512, proportional below */
```

Every measured number in the CSS is written `calc(<number> * var(--u))`, so
the composition is pixel-exact at 1512 and scales cleanly below it. Above
1512 it stays at 1512, centred — the hairlines still run the full width.

## Where the specified type matches the reference, and where it doesn't

| Element | You specified | The reference measures | Built as |
|---|---|---|---|
| Headings | 130px, −4px | **130px, −4px** — all six words within 1px | as specified ✅ |
| Supporting text | 28px, −2px | 28px, **−1.4px** | 28px, −1.4px ⚠️ |
| PUT ME TO WORK | 16px, −2px | 16px, **+0.35px** | 16px, +0.35px ⚠️ |

The heading spec is exactly right — at 130px/−4px Helvetica Neue, every one of
the six words reproduces the reference's ink width to within 1px. That also
confirms the reference really is set in Helvetica Neue.

The other two are the reason for the ⚠️. At −2px the body copy comes out
**23px narrower per line**, which changes where the lines break and no longer
matches your reference; −1.4px reproduces all four measured paragraph line
widths to within 1px. At −2px the button text would be 111px wide against a
measured 141.5px.

A plausible reading is that "−2" meant −2% (−0.02em), which is much closer to
what the reference actually shows. **I used the reference-accurate values and
left your sizes untouched.** To switch to a literal −2px, change two lines in
`src/styles/tokens.css`:

```css
--ls-support: -1.4;   /* → -2 */
--ls-btn:      0.35;  /* → -2 */
```

Tell me which you want and I'll set it.

## Other measurements taken from the reference

Nav — 683.4 × 76.4 at 31 from the top, 3px border, 20px radius, 45px monogram
tile, 80.1 × 39.3 icon group, both inset 15.9 from the pill's outer edge,
18px links. It keeps these pixel sizes above 1512 instead of growing, and has
its own scale floor (`--nu`) so the links never shrink below ~15.5px.

Hairlines — 1px at `rgba(255,255,255,0.55)`, full viewport width, behind the
portrait. They sit on the **x-height and the baseline** of each headline line:
y = 167.1 / 230.6, 374.2 / 438.5, 579.1 / 647.1. Baseline pitch 208px.

Portrait — frame 546 × 713 at (471, 224.5), 18px radius. The reference does
**not** use a plain `cover` crop: the photo is drawn at 597.6 × 896.5 (about
9% past cover) and pulled 24.7px left, anchored at the frame top. That was
fitted by correlating your photo against the reference across scale and
offset, so the face lands where yours does.

Button — 194.3 × 52.9 at (1049.3, 845.2), 16px radius.

## Blocked: case study content

Behance **is** reachable and all four homepage projects were matched to real,
published projects:

| Homepage artwork | Behance project |
|---|---|
| Senta web design | SENTA: FINTECH WEBSITE |
| Senta app | SENTA: FINTECH BANK MOBILE APP & BRANDING |
| Eventro | EVENTRO: EVENT MOBILE APP DESIGN |
| Kariya → **Kariiya** | KARIIYA: AI SAAS WEBSITE DESIGN |

**But those projects contain no written case-study content.** Every one of
them is an image gallery with tags and the line "No use is allowed without
explicit permission from owner" — there is no problem statement, process,
research or outcome text anywhere to draw on.

So `/work/<slug>` exists for all four and contains only what could be
verified: the published title, the project's own tags, the cover artwork you
already supplied, and a link to the full project on Behance. There is
deliberately no narrative — writing one would mean inventing it.

To fill them in, send me either of:

- the written content per project (problem, role, process, outcome), or
- permission to pull the images down from your Behance galleries, which I
  did not do on my own since they carry your all-rights-reserved notice.

## ~~The email address~~ — resolved

`alabiamazingrace3@gmail.com` (**one** g) is confirmed by the owner, and
matches both the Behance profile and the design reference footer. The
double-g spelling in an earlier request was a typo and is not used anywhere.

It is defined once, in `src/data/site.ts`, and everything else reads from
there: the nav compose icon, the hero and FAQ "PUT ME TO WORK" buttons,
"Write me here", the footer chip and its copy button, `public/llms.txt`, and
the `email` field in the schema.org Person.

## The footer image

**No image was attached to that request.** The only images in this
conversation are the portrait and the hero reference from earlier. The footer
work was therefore matched against `design-reference/homepage-reference.png`,
which contains the footer at 727px wide. If you have a higher-resolution
footer export, send it and I will tighten the match.

## Before launch — required for SEO

| | What | Why it matters |
|---|------|----------------|
| **A** | **A production domain** | Set `NEXT_PUBLIC_SITE_URL` in `.env.local` and in Vercel. Until then the site serves `noindex` and robots.txt disallows everything, so it will not be indexed at all. That is deliberate — it stops a preview URL being indexed instead of your real one — but it does mean **nothing is discoverable until you set it**. |
| **B** | **Verified profile URLs** | `sameAs` in the schema.org graph is empty. It is the strongest signal tying this page to your LinkedIn, Behance and GitHub identities, and search engines and AI assistants use it to connect them. Give me the URLs and they go in `src/data/site.ts`, which feeds both the footer links and the structured data. |
| **C** | **Project destinations** | Each project currently serializes as a `CreativeWork` with no `url`. Real links make them separately discoverable. |
| **D** | **Resume PDF** | A linked, crawlable resume adds another indexable surface. |

## Honest limits on "best SEO"

What has been built is the technical foundation, and it is thorough: static
prerendering, canonical URLs, a full schema.org graph, sitemap, robots with
AI crawlers named explicitly, a generated social card, and `llms.txt`.

What that does **not** do is make you rank or get cited. Ranking and AI
citation depend mostly on things outside the code: a real domain with some
history, other sites linking to yours, your name appearing in places that are
already crawled, and the work itself being referenced. The code removes every
technical reason a crawler would skip or misunderstand the page. It cannot
manufacture the external signals.

One concrete thing worth knowing: `llms.txt` is an emerging convention, not a
standard. Some tools read it, many ignore it. It costs nothing to serve, but
do not count on it.

## Open design question

**The light theme has no reference.** The toggle works, persists, and defaults
to dark. But the reference only shows the dark design, so the light palette
(`:root[data-theme='light']` in `tokens.css`) is my derivation. Two things to
look at: the tool cards keep a white border, which reads as a gap rather than
a card edge on a white page; and the hairlines invert to 50% black.

## Verified behaviour in the new sections

- **Ticker** — the moving strip is `aria-hidden`; the four skills are exposed
  once as a plain list, so a screen reader hears them a single time rather
  than once per repeat. Pauses on hover, on focus, and via a toggle that
  appears on hover/focus; under reduced motion it never starts and the toggle
  is not rendered.
- **Copy email** — the failure path is verified: the clipboard write is
  rejected, the address is selected instead, and a polite live region says so.
  **The success path could not be exercised** — this browser reports
  `clipboard-write` permission as *denied*, so I have not seen the "Copied"
  state in a real browser. Worth a click on your machine.
- **Scroll reveals** — an observer only reports threshold crossings, so a page
  that jumps (an anchor link, back-to-top) could carry a section from below
  the viewport to above it with no callback, leaving it invisible for the rest
  of the visit. Reproduced, then fixed with a scroll backstop; re-tested by
  jumping straight to the bottom, and all 13 reveals fire.

## Fixed: hydration mismatch

Reported as two stray `webcrx` attributes from a browser extension. The
extension part was real and is handled with `suppressHydrationWarning` on
`<html>`, but it was masking three bugs of mine:

1. **The theme script was reading the wrong storage key.** `THEME_KEY` was
   exported from a `'use client'` module and imported into the server layout,
   so it serialised into the inline script as a stub function that throws —
   `localStorage.getItem('function(){throw Error("Attempted to call
   THEME_KEY() from the server…')`. Anyone who had chosen light mode got dark
   anyway. Now in `src/lib/theme.ts`, which has no `'use client'`.
2. **The theme was read during render**, so a light-mode visitor's first
   client render disagreed with the server's HTML on four things: the
   `data-theme` attribute, `aria-pressed`, `aria-label` and the whole icon
   subtree. React discarded the server HTML and re-rendered the entire tree.
   Now `useSyncExternalStore` with a server snapshot.
3. **The icon was chosen by React state.** Both marks are now rendered and
   CSS picks one off `<html data-theme>`, so the correct icon paints
   immediately and no icon state can disagree with the server.

Verified in a clean browser profile: both themes load with an empty console,
and the toggle still persists.

## Flagged for your review

- **The four tool cards** in "I currently work more with" — Figma and Claude
  are identifiable in the reference; the middle two are not. Currently Figma,
  ChatGPT, GitHub, Claude.
- **The five footer stickers** — same question. Currently Figma, GitHub, your
  portrait, ChatGPT, Claude.
- **The footer credit line** reads "Built with brain 🧠, heart 🫀 and claude 🤖".
  The second and third emoji are not resolvable at the reference's resolution,
  so please confirm the exact characters.
- **Colour below the hero** is less certain than the hero's. The full-page
  export is 727px wide, so thin text samples darker than it really is. Section
  headings sample a confident `#999999`; the FAQ red samples `#97181f`, which
  is desaturated by the export — `--c-accent` is set to `#e6221f`.
- `MY PORTFOLIO` — a stray empty 0-byte file at the project root. Left alone,
  almost certainly safe to delete.
