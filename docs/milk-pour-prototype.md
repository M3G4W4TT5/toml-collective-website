# Milk-pour prototype

Prototype route: `/milk-pour-prototype/`, plus the subsequently authorized animation-only entrance on `/landing-page-draft/`. After approving the local integration, the user authorized pushing and deploying both routes to the existing primary and preview Worker sites. The original homepage, CMS and release configuration are unchanged.

## Landing integration — 22 October 2026

The approved splash and artwork are reused by `LandingMilkPour.tsx`, mounted outside the landing page's stacking context. Only `MilkPourOverlay` ships in that island: no harness controls, sample content or artificial underlay. Playback is 1.5×, so the original 2.5-second scene takes about 1.67 seconds. The existing page stays visible through the transparent mask, interactive and scrollable. Shared component CSS fixes the non-intercepting overlay to the viewport without locking scroll or moving it with document content.

The route's early inline script records `toml:landing-milk:seen` in session storage. Only an unseen direct/external navigation may start the entrance; a same-origin referrer, reload, history traversal or reduced-motion preference skips it. The landing visit consumes the session flag even when skipped. Storage failure skips the effect. The short pre-hydration black cover is conditional on the same eligibility check and fails open after six seconds in both script and CSS. The island also checks the pending flag, so hydration arriving after that timeout cannot start a late cover. A `pagehide` handler finishes playback before a cached document is restored. This is a tab-session entrance, not a persistent tracking flag.

`MilkPourOverlay` defaults to its existing automatic playback for the standalone prototype. The landing wrapper disables that default and starts only when eligible, setting 1.5× before replay. The prototype's controls and storage-free behavior are preserved.

Run `npm run test:browser:landing-milk-pour` against the foreground local preview. Its real browser checks cover speed, native desktop/phone frames, visible active content, wheel scrolling during playback, fixed overlay bounds, absent controls, internal first entry, reload, interrupted navigation/history, reduced motion, unavailable storage, no JavaScript and blocked hydration. Evidence is under ignored `artifacts/landing-milk-pour/`.

## Source and composition

Implemented from the supplied `milk-pour-prototype-handoff.zip`, after extracting and reading `PROMPT.md`, `IMPLEMENTATION-SPEC.md` and `ASSETS.md`, inspecting all five PNG references and the approved vector, and verifying all 25 manifest entries with the supplied verifier.

The two SVGs in `src/assets/milk-pour/` are byte-exact originals. Their SHA-256 hashes are enforced by `tests/milk-pour.test.mjs`. The mask keeps every supplied path, clip, panel, circle, matrix and stroke. Only parent translation, screen rotation and uniform scale change. Per-instance SVG IDs are prefixed at render time.

The effect paints a black rectangle with an explicit SVG luminance mask. The accumulated liquid, stream, evolving crests, droplets and approved carton panel geometry remove the cover, revealing the real underlay. There is no painted white liquid layer. Completion hides the decorative, non-intercepting SVG entirely.

`MilkPourOverlay.tsx` exposes replay/play/pause/seek/speed without harness controls. `animation.ts` evaluates a deterministic 2.5-second scene; `geometry.ts` owns transforms, bounds and smooth interpolation. Frame geometry updates SVG refs directly. React state is limited to lifecycle and controls, notified at most every 50ms during playback. The stream uses the transformed `(34.389, 34.198)` opening. Conservative rotated bounds and a smooth clearance limit keep the carton above the surface as it exits upward.

The first impact has the largest envelope and droplet launches. The user's later splash and solid-stream references supersede the original instruction to retain lively splashes throughout. The initial splash spreads from a low base, with short rounded outward curls and deep curved gaps, following the user's final tight crop. Spatially varying growth and folding change the silhouette before it collapses smoothly by 49% progress. Twelve seeded droplet events are limited to the initial impact and brief settling phase; the rising pool catches them. From mid-pour onward only the solid stream remains, with a broad rounded foot following the local surface tangent. The existing rolling waterline stays animated. Splash contours follow the local waterline and liquid closing edges remain submerged to avoid exposed ledges.

Visual refinement used the subsequently supplied JPG references, milk-splash collection and final tight screenshot crop. The pouring-jug image defines the rounded stream-to-wave junction; the cropped banner splash defines the initial low base and curled splays. These references were viewed inline in the conversation. The earlier online flat-fill Lottie example was rejected by the user as a poor comparison and does not define the waterline. No reference artwork was incorporated into runtime assets.

The harness has white/checkerboard/cobalt underlays and an option to expose sample content during playback. Controls sit above the effect and collapse to a keyboard-accessible bar on phone widths. Hidden sample content is inert. Reduced motion skips automatic playback, with explicit manual replay available. Visibility changes suspend the clock; completion and unmount stop RAF. A route-local boot cover avoids the initial content flash and fails open after six seconds if hydration fails. No visit flag or storage is used.

## Local review

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4322 --ignore-lock
```

`--ignore-lock` uses Astro 7's supported foreground preview, avoiding its agent-detected background process lifecycle. Open `http://localhost:4322/milk-pour-prototype/` and press Replay. On phones expand Controls to scrub or change backgrounds.

```sh
npm run check
npm test
npm run format:check
TOML_QA_BASE_URL=http://127.0.0.1:4322 npm run test:browser:milk-pour
TOML_QA_BASE_URL=http://127.0.0.1:4322 npm run test:browser
```

Browser suites use the existing Playwright dependency. Supply `TOML_BROWSER_PATH` for an existing Chromium executable or `PLAYWRIGHT_BROWSERS_PATH` for a separately installed browser. The existing site suite excludes this standalone, navigation-free harness; its dedicated suite covers the route.

Evidence lives in ignored `artifacts/milk-pour-prototype/`: browser results, native viewport captures, source comparisons, before/after splash joins, and a contact sheet of real RAF playback. Tested Chromium 156 at 1920×1080, 1366×768, 390×844, 360×800 and 844×390. This is desktop browser emulation, not physical iOS/Safari or measured device performance.
