# Landing page draft — 21 October 2026

Route: `/landing-page-draft`. This is a local, explicitly unindexed draft of the homepage through Selected Work. The existing `/` route remains the V4 implementation. Further sections and the footer are deferred as requested.

## Reference review

Reviewed only [Wonder Vision's homepage](https://www.wonder-vision.com/): the rendered desktop and phone page, complete homepage HTML, theme CSS and the relevant first-party modules decoded from the public Webpack bundle. The bundle exposes `header.js`, `video.js`, `pushBeyondReality.js`, `moreMenu.js`, `footer.js`, `breakpoints.js` and its initialization in `app.js`.

| Source component | Observed implementation | TOML adaptation |
| --- | --- | --- |
| `#site-header` | Fixed 82px header; white at the top; opacity transition over 500ms; Lenis scroll direction hides/reveals it and changes wordmark/mark. | Same height, white surface, fade duration and responsive navigation metrics; native scroll events; `TOML.` in the supplied Microgramma Bold. The milk mark is swapped in only after the first downward fade reaches zero opacity, then shown on upward scrolling. Returning to the top restores the wordmark and cancels a pending swap. |
| `#moreMenu` | Black full-screen phone panel; rightward translation toggled over 700ms. Upper-left uppercase navigation, upper-right Close, bottom Latest row with horizontal project cards. | Same panel motion, black surface, 36px padding, responsive 36/48px links and 448 × 128px cards. TOML's existing four navigation destinations and case pages replace the reference's entries. |
| `#main-heading` | Fixed at 82px, with a hidden, equal-sized heading in document flow reserving space. Width and type follow the source's breakpoints. | Same fixed-heading/reserved-space construction. Opaque scrolling content covers the heading. Final text is “A creative agency powered by a global collective of storytellers”. Balanced wrapping, with smaller phone type to meet the later three-line maximum. |
| `.video-teaser` | Vimeo preview/poster; an absolute overlay. Viewport ratio chooses 9:16, 4:5, 16:9 or 2:1. | Native local TOML showreel and a poster extracted from that supplied video; same aspect-ratio choices. The provided landscape film is cropped for portrait previews; full playback preserves the complete film. |
| `.sticky-button` | Stickybits positions controls at viewport height minus their height and a 20/40px lower inset. The parent constrains them to the reel. | Native CSS sticky with the same insets and 51px control height. The down arrow follows the viewport, then leaves with the reel. Its native anchor stops immediately past the reel's bottom, with a 1px clearance for fractional layout rounding. The story section retains its existing top padding. |
| `#pushBeyondReality` | Three staggered uppercase lines, left/right/left; SVG lettering; blur-to-sharp translation over one second, starting after 300ms with 200ms staggering. | Semantic `TELL / YOUR / STORY` text in the source's FK Grotesk, following the latest user revision, with the same staggered composition and reveal timing and an orange source square after STORY. |
| Intro prose | Right-aligned 58% column from 768px; 17–30px responsive type with 1.5 leading. | Supplied TOML paragraphs; the source's column, type scale, leading and section spacing. |
| Recent work | Four stacked panels; 1440:607 desktop and 335:418 phone crops; white captions; black section square; right-side work link. | Four existing selected TOML projects through `getHomepageDesign()`, retaining current CMS overrides: Siebert Financial, ETH Zürich Space, UBS / Red Thread and Vvitaverse. The square before SELECTED WORK uses TOML orange, following the later user instruction. |

The source's `absolute inset-0 z-40` element is an overlay, rather than the video player itself. The fixed hero comes from `#main-heading` and its spacer, not from that overlay.

The public bundle initializes site-wide WordPress features, jQuery plugins, Vimeo queues, AOS and Lenis, including unrelated capabilities not needed for this page. Only the relevant component structure, source assets, typography, dimensions and behavior were adapted. No new runtime dependency was added. Existing Astro metadata, responsive image handling, navigation destinations and dialog behavior are reused.

## Implementation map

- `src/pages/landing-page-draft.astro`: supplied content and composition, with permanent draft `noindex`.
- `src/components/landing/`: draft header, reel and full-width project panels.
- `src/styles/pages/landing-draft.css`: draft-only composition and the reference's responsive type scale. Shared styles retain their layer order.
- `src/styles/theme.css`: local font declarations and separate logo/reference font roles; existing font roles are unchanged.
- `src/scripts/landing-draft.ts`: scroll direction, logo state, accessible mobile menu, reveals, preview playback and reduced-motion handling.
- `scripts/qa-landing-draft.mjs`: focused layout and interaction verification, including the three-line hero requirement.

The whole reel is a transparent, keyboard-accessible play target that opens the full showreel dialog. Following the user's screenshot feedback, the visible “Play Showreel” and background pause controls are removed; the separate down arrow remains above the play target and keeps its own scroll action. Playback retains keyboard/Escape handling, focus restoration, offscreen video pausing and reduced-motion support.

The white mobile header retains the reference's exact two-line icon after “Menu”. Opening it presents a black native dialog covering the screen, with the four specified navigation entries and an upper-right Close control. The panel slides in from the right and slides back right over the source's 700ms duration/easing; its content has no independent reveal animation. Latest is anchored near the bottom, with previous/next arrows and horizontally swipeable case cards. Short viewports can scroll the panel itself while the page stays locked. Reduced motion removes the slide. Escape and Close preserve background inertness until the closing transition completes, then return focus to Menu; resizing to desktop immediately closes the panel. The same navigation element moves into the panel while it is open and returns to the header afterward. Journal retains its existing external destination.

Latest uses up to four published Sanity case articles ordered by `_createdAt` descending, with their existing image/title and generated case URL. The current seeded cases have no publication dates, so until CMS case records exist the cards retain their existing source order; no dates or recency metadata were invented. The helper performs build-time published reads only and does not migrate CMS content.

The story animation directly adapts the reference's `fadeInElement` / scroll-trigger code: start at 75% of viewport height, wait 300ms, then reveal lines at 0/200/400ms with `blur(30px)` to `blur(0)`, `translateX(20%) / translateX(-15%) / translateX(20%)` to zero, and the source's one-second ease-out. A guard is set before scheduling and the listeners are removed, so it runs once per page load. The hero, reel, intro, Selected Work heading and link as one group, and each work entry use the source's 1500ms fade-in with its AOS default 120px scroll offset, also once per page load.

A small head script enables the initial hidden state before the first paint. Content therefore fades from the white canvas on a fresh load and on reload after the browser restores a lower scroll position. Each new document resets the reveals; scrolling back within that document does not. Without JavaScript or with reduced motion, the content remains visible.

The draft header follows the reference's 768px navigation breakpoint. Navigation type is 18/20/22/24/28/32px at 768/1024/1200/1440/1920/2560px, with 1.5 leading. Link gaps are 22/30/35/50px at 768/1024/1440/2560px. Header side padding is 20/30/40px at 0/1024/1440px; navigation uses the source's 10px top offset until 1440px, then 6px. Both live headers measure 82px high. The SVG carton is 44px tall with no opaque background or TJ lettering. Fresh before/after measurements and actual-header-only comparisons are retained in `artifacts/landing-header-refinement/`.

## Asset provenance

| Local asset | Source |
| --- | --- |
| `public/fonts/microgramma-bold.otf` | Supplied [Microgramma folder](https://drive.google.com/drive/folders/1zYFD4Nmz3XO08TZP-IdKbXiA7QsFTOhR), file `fonnts.com-Microgramma_Extd_D_Bold.otf`. |
| `public/media/toml-milk.avif` | Supplied [Website Resources folder](https://drive.google.com/drive/folders/1CiRLaFajde-9XxrNMr7s7nHwrAAD5wTR), file `toml_milk.avif`. |
| `public/media/toml-milk.svg` | Vector trace of the supplied AVIF's connected carton outline. The two disconnected TJ letter components and opaque white background were removed before tracing. The header uses this transparent black-path SVG; the source AVIF is preserved. |
| `public/fonts/fk-grotesk-{regular,light,bold}.woff2` | Reference theme's own `@font-face` URLs: `dist/356f6286db0888c7ec66.woff2`, `dist/6077152c4196811d5d19.woff2`, `dist/82fb1a5b0180cfe5d360.woff2`. |
| `public/icons/{arrow-down,arrow-right,square,play,menu,close,menu-next,menu-previous}.svg` | Actual SVG paths copied from the supplied reference homepage. Fills inherit the local component color. |
| `public/media/showreel-poster.webp` | Frame at eight seconds from the existing supplied `public/media/toml-showreel.mp4`. |
| Showreel and project images | Existing TOML local assets and current homepage project selection. |

The draft does not hotlink Wonder Vision media, fonts or scripts. Reference screenshots, style measurements and browser results are retained under ignored `artifacts/landing-page-draft/`. Latest visual comparison and validation results are in the landing-page section of `design-qa.md`.

## Recheck locally

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4326 --ignore-lock
```

In another terminal, with an installed Playwright browser or the selected Chrome executable:

```bash
TOML_QA_BASE_URL=http://127.0.0.1:4326 TOML_BROWSER_PATH=/opt/google/chrome/chrome node scripts/qa-landing-draft.mjs
TOML_QA_BASE_URL=http://127.0.0.1:4326 TOML_BROWSER_PATH=/opt/google/chrome/chrome npm run test:browser
```

The `--ignore-lock` preview option avoids a stale local Astro daemon lock in the task environment; it does not change site access or indexing settings.
