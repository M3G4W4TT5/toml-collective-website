# Styling and responsive development

The V4 design is the baseline. The frontend is structured for experiments with fonts, colours, spacing and layouts while keeping the existing content and CMS fallback behaviour.

## Where to make a change

| Change | Location |
| --- | --- |
| Fonts, font loading, colour palette, size scales, spacing scale, content width | `src/styles/theme.css` |
| Element defaults, heading roles, focus and reduced motion | `src/styles/base.css` |
| Containers, grids, page introductions, shared section spacing | `src/styles/layout.css` |
| Buttons, cards, header, footer, dialogs and other shared patterns | `src/styles/components/` |
| Composition unique to a route or page family | `src/styles/pages/` |
| Markup and behaviour of a reusable element | `src/components/` and `src/scripts/` |
| Shared navigation destinations | `src/data/navigation.ts` |

`site.css` imports the shared foundations. Each page imports only its page-family stylesheet. CSS layers give a fixed precedence: theme, base, layout, components, then pages. `layers.css` declares that order for every stylesheet entry point, so import traversal cannot change it. Small component-only styles in ContactForm and Showreel remain scoped inside their Astro files.

## Theme experiments

Change values in `theme.css`, then use Astro's local development preview to see the result:

```css
--font-heading: Georgia, serif;
--heading-scale: 1.05;
--body-scale: 1;
--accent: #ff532f;
--content-width: 80rem;
--grid-gap: 2.75rem;
```

`1` is the baseline for both size scales. Body and heading fonts have separate roles. Quote, label and member-display type have their own roles to preserve the original art direction. To add a font, add its local `@font-face` declaration and assign it to a role in the same file; include its licence with the asset. Keep root text sizing under the visitor's control.

Shared spacing uses `--space-*` variables. Unique composition dimensions stay near the component or page they affect. Changing a font can change wrapping: review the affected pages at all three layout ranges before keeping an experiment.

## Responsive rules

| Range | Width in CSS pixels at the default font size | Behaviour |
| --- | --- | --- |
| Phone | Below 48rem / 768px | Stacked heroes, one-column work grids, compact menu |
| Tablet and compact desktop | 48rem–below 75rem / 768–1199px | Stacked heroes, two-column work/member grids, compact menu, stacked contact columns |
| Desktop | 75rem / 1200px and above | V4 split compositions, full navigation, wider gutters, capped content width |

Two-column people cards remain on phones where the baseline uses them. Narrow corrections use bounded media queries; larger layouts extend the base with `min-width` rules. Keep a component's breakpoint rules with that component. Preserve meaningful document order when changing a grid, and avoid duplicated desktop/mobile markup. The menu script follows the toggle's actual CSS visibility, so adjusting its breakpoint requires no matching JavaScript constant.

ProjectCard uses explicit `selected`, `compact`, `related` and `default` variants. SiteFooter's `home` variant selects the smaller homepage signature. Use a named variant for a recurring composition change instead of tying a component to an ancestor or adding a late override. Container queries can be introduced when a card needs to adapt to different parent widths; the current variants already cover the baseline placements.

## Images

`ResponsiveImage.astro` renders a native `img` with `srcset` and `sizes`. Local originals stay in `public/media`. `npm run images:prepare` generates cached WebP variants and an image manifest; it runs automatically before `dev`, `check` and `build`. Generated files are ignored by Git. Add source images, then rerun that command if the dev server is already running.

Use `imageSizes.half`, `imageSizes.third` or an explicit `sizes` string when the image occupies a known slot. Otherwise the component uses the full-width container hint. CSS controls cropping and aspect ratio. Existing Sanity image URLs receive width/format variants; other remote URLs pass through. CMS image modelling and content migration remain separate.

## Development and checks

```bash
npm run dev
npm run format
npm run format:check
npm run check
npm test
npm run build
```

The first image preparation creates the cached variants; later runs reuse them. CI checks frontend formatting as well as the existing build and infrastructure checks.

For browser checks, first build the site and start `npm run preview -- --host 127.0.0.1 --port 4322` in a separate terminal. Install the test browser once with `npx playwright install chromium`, then run:

```bash
TOML_QA_BASE_URL=http://127.0.0.1:4322 npm run test:browser
```

An existing Chromium/Chrome executable can be selected with `TOML_BROWSER_PATH`. The check covers every generated page at 390px and 1440px, representative pages at eight additional widths from 320px upward, navigation, filters, dialogs, video playback, preview contact validation, theme controls and reduced motion. JSON results and screenshots are written under ignored `artifacts/refactor-qa/`. Inspect the 390px, 820px and 1440px screenshots; automated overflow checks alone do not establish visual quality.

The browser check expects the review site's `noindex` and disabled sending. It never sends an enquiry. Website publication, Studio publication and CMS migration are separate actions.
