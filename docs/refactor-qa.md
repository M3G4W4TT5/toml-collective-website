# Frontend foundation QA — 21 October 2026

Result: passed locally. The user approved the cleanup and responsive foundation against the current V4 design baseline, with CMS migration separate. Publication was initially held and subsequently authorized; see `PROJECT.md`.

## Change

- Central theme controls for font roles, size scales, colours, shared spacing, content width and pill radius.
- A small shared CSS entry point, explicit layer order, component styles and page-family styles; phone, tablet and desktop rules stay with their owner.
- Separate header, footer, person card, member card and profile-dialog components. Reused cards/footer have explicit variants. Menu, filters, contact behaviour and dialogs have separate TypeScript modules.
- Responsive image sources generated locally from the unchanged originals; native `img` output preserves layout and loading behaviour. Sanity CDN variants respect native image width and existing crop settings.
- One published-read Sanity client replaces duplicate construction. Existing queries, merge/fallback decisions, schemas and dataset are unchanged. Removed the unused starter content loader.
- Frontend formatting, CI formatting verification, a repeatable browser check and the development guide in `styling.md`.

## Baseline and visual verification

Captured 10 representative routes at 1440px and 390px before editing. Repeated the same captures afterward. Recorded heading/card/header/footer positions and sizes match within 1 CSS pixel across all 20 views; full-page heights also match within 1px. Responsive image resizing/recompression can change image pixels without changing the supplied artwork or crops.

Opened the desktop/phone homepage captures and tablet homepage/member-index captures for visual inspection. Tablet layouts intentionally use the new foundation: stacked heroes, two-column grids, compact navigation and stacked contact columns. A narrow playlist heading adapts to its tile width; the project-rhythm timeline becomes one column below 24rem.

Local evidence remains ignored by Git:

- `artifacts/refactor-qa/before/`, `after/`, `baseline.json`, `after.json`
- `artifacts/refactor-qa/screenshots/`
- `artifacts/refactor-qa/browser-results.json`

## Checks

| Check | Result |
| --- | --- |
| `npm run format:check` | Passed |
| `npm run check` | Zero errors, warnings or hints |
| `npm test` | 18 passed |
| `npm run build` | 34 static pages built using the existing published-content configuration |
| `npm run studio:build` | Passed; local build only |
| `npm run worker:check` | Types current; bundle dry run passed; no deployment |
| `git diff --check` | Passed |
| Browser viewport checks | 140 passed |
| Browser interaction checks | 8 passed; no JavaScript errors |

The browser run used headless Google Chrome through Playwright, DPR 1. All generated non-redirect pages were checked at 390px and 1440px. Nine representative routes were also checked at 320, 560, 767, 768, 820, 1024, 1199 and 1200px. Assertions cover overflow, image loading, page titles, review indexing protection and menu state.

Interactions cover Work/member filters, profile dialogs and focus restoration, showreel playback/pause, phone/tablet menus and desktop resize, enquiry context/validation without delivery, font/colour/size/content-width controls and reduced motion. The showreel assertion waits for the asynchronous native dialog-close event before checking paused playback.

This establishes local viewport and interaction coverage in Chrome. Physical devices and Safari/Firefox were not tested in this pass.

## Existing dependency advisories

Compared the original and final package lockfiles with `npm audit`: both report 9 moderate and 7 high advisories, with no additional affected packages. The existing high findings name Sanity CLI/codegen and their glob/watcher dependencies. These inherited tooling advisories were not remediated as part of the frontend refactor.

## Release boundary

The local verification pass did not push or deploy. The user subsequently authorized website publication through the existing Git pipelines. Studio/schema deployment, CMS mutation, domain/indexing changes and real contact submission remain outside this release. Original media, contact Worker code and deployment configuration are unchanged. Hosted release verification is recorded separately from these local checks.
