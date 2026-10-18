# Gabriel’s portfolio

A single-page, statically generated Astro portfolio with Tailwind CSS 4, local
Markdown content, and two React islands for scroll-aware navigation and the
rotating major label. Layout, social links, and content sections use Astro HTML.

The visual style pairs bold typography with deep navy, soft white, and
cool silver. UofT-inspired blue (`#002A5C`) anchors the accents, following the
[university's dark-blue colour reference](https://www.cpd.utoronto.ca/reports/CPD-CondensedStyleGuide.pdf).
A diffuse diagonal light with a blue hue frames the
full-screen introduction, without a grid or background image.
Sparse, softly drifting particles frame the hero and the lower page, leaving the
main text clear. The lower page uses a responsive editorial grid: biography beside
personal details, experience beside projects, then full-width skills and contact
sections. Rounded, softly lit panels, timeline details, and skill tiles add depth.
Profile information comes from `src/data/profile.ts`.

The full-width hero fills at least one small viewport height (`100svh`), with
room to grow on short screens and at large text sizes. It includes the exact
major/minor programs and accessible GitHub/LinkedIn icon links. Hero effects,
scroll-linked panel reveals where supported, and hover transitions use Tailwind
utilities and theme keyframes. Every animation is gated by `motion-safe`;
unsupported browsers display static panels. Experience entries use native
keyboard-accessible `details` disclosures. Work roles and project cards start
closed and expand only on click or keyboard activation. Skill categories use
small monochrome ASCII symbols and emoticons instead of numbered or emoji badges.

`ScrollNavigation.tsx`, hydrated with `client:load`, hides on downward scrolling
and reveals after an upward movement of at least eight pixels. It starts hidden
at the top of the homepage, has no name or wordmark, and always reveals for
keyboard focus. Its scroll listener is passive, updates are scheduled with
`requestAnimationFrame`, and the listener/frame are cleaned up when unmounted.
No animation library is installed. The particles use static Astro markup and CSS,
with fewer on mobile and no extra client JavaScript. Their slow transform
and opacity animation stops when reduced motion is requested.

The single “Show me around” hero link scrolls to the biography. A rotating conic
gradient creates its moving silver outline without an animation library.

`RotatingMajor.tsx` crossfades through Computer Science Major, Neuroscience Major,
and Mathematics Minor every two seconds next to a stationary
`@ UofT`. Hidden sizing labels reserve the widest title, so the suffix stays in
place. Hovering or focusing the label pauses it without adding a control button;
screen readers receive one complete, static description. Reduced-motion users
see all three titles without animation. The timer stops when the label leaves
the viewport and is cleaned up on unmount.

## Development

Requires Node.js 22.22 or newer. Install with `npm ci`.

| Command | Purpose |
| --- | --- |
| `npm run dev -- --background` | Start the Astro development server in the background |
| `npm run astro -- dev status` | Check the background server |
| `npm run astro -- dev logs` | Read its logs |
| `npm run astro -- dev stop` | Stop it |
| `npm run check` | Check Astro components and TypeScript |
| `npm run build` | Generate the static site in `dist/` |
| `npm run preview` | Serve the production build locally |

On Windows PowerShell, use `npm.cmd` if the local execution policy blocks `npm.ps1`.

## Edit your content

- **Biography, introduction, hobbies, skills, and contact links:** `src/data/profile.ts`.
  The sidebar renders `profile.funFacts` as short paragraphs without category
  headings. Academic focus and community involvement live in the bio.
  Set `contact.email`, `contact.github`, and `contact.linkedin` to your real details.
  Empty or invalid contact links are omitted, without fake or broken links.
- **Page title and search description:** `src/consts.ts`.
- **Work experience:** add Markdown or MDX in `src/content/experience/` with
  `category: Work` and `draft: false`. The two published roles, dates, and bullet
  points come from the supplied résumé: Factors Education and American Income
  Life. Earlier education and community notes remain drafts; studies and CSSU
  involvement are described in the biography and sidebar.
- **Projects:** duplicate `src/content/projects/template.md`, rename the copy, and
  replace its contents. Set `draft: false` when it is ready. The template is hidden.
  The published Online Footwear Marketplace uses the MERN stack and details from
  the supplied résumé. Add its exact repository URL to `github` when available.
- **Design tokens:** `src/styles/global.css` contains only Tailwind’s import and
theme tokens and animation keyframes. All layout and presentation utilities live
  in Astro components. `Panel.astro` centralizes shared panel motion and borders.
- **Layout and sections:** `src/layouts/Portfolio.astro` and `src/components/`.
- **Collection validation:** `src/content.config.ts`.

### Experience frontmatter

```yaml
role: Your actual role
organization: Organization
period: Actual dates
category: Work # Required for the Work Experience section.
order: 1
draft: false
```

The Markdown body appears below the entry. Lists can describe real contributions.
Both collections are sorted by `order`, ascending. Entries default to drafts when
the `draft` field is omitted.

### Project frontmatter

```yaml
title: Your actual project
category: Full-Stack Web Application # Optional.
description: What it does and why you built it.
technologies: [Python, TypeScript]
# github: Add the real HTTPS repository URL, or omit this field.
# demo: Add the real HTTPS demo URL, or omit this field.
order: 1
draft: false
```

Project cards show the description, technologies, Markdown body, and available
links. This single-page design does not publish a
separate project-detail route. No invented sample projects are displayed.

## Vercel deployment

Import this repository into Vercel and select the **Astro** framework preset.
`vercel.json` sets the build command to `npm run build` and the output to `dist`.
This is static hosting; no adapter, server functions, or database is required.

For a custom domain, add `SITE_URL=https://your-real-domain.com` to Vercel’s build
environment. For local production builds, copy `.env.example` to `.env` and set the
same value. Otherwise, Vercel’s `VERCEL_PROJECT_PRODUCTION_URL` supplies the origin.
Canonical URLs and a sitemap are emitted only when an origin is available, so
local builds never advertise a fabricated domain. Preview deployments should have
Vercel’s search-engine indexing protection enabled.

Check with `npm run check` and `npm run build` before deployment. Lighthouse scores
depend on the deployed environment and must be measured there; no score is assumed.

## Accessibility and performance

Semantic sections, a skip link, visible keyboard focus, readable contrast, and
reduced-motion variants are included. All five navigation links fit on mobile
without a menu widget. The navigation hides and reveals with scroll direction,
and keyboard focus reveals it regardless of scroll position. Local Atkinson
typography is paired with monospace labels. There
are no external font requests or background images.
The starter blog routes, feed, sample posts, and placeholder artwork were removed.

Astro references: [components](https://docs.astro.build/en/basics/astro-components/),
[styling](https://docs.astro.build/en/guides/styling/),
[content collections](https://docs.astro.build/en/guides/content-collections/),
and [static deployment to Vercel](https://docs.astro.build/en/guides/deploy/vercel/).
