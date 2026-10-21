# Landing footer QA — 21 October 2026

final result: passed

Scope: the newly requested footer on `/landing-page-draft`, including the final mobile instruction to retain every address, phone number and email while omitting the clocks. The original homepage is unchanged.

## Source and visual comparison

- Revisited only the reference homepage, its public footer HTML/CSS and `footer.js`. Captured source and draft at 1440 × 900, 390 × 844, 820 × 1180 and 2460 × 1522, DPR 1. Evidence is under ignored `artifacts/landing-footer/`.
- Opened equal-size side-by-side desktop and phone comparisons: `comparison-2460-footer.png` (4940 × 1522, including a 20px separator) and `comparison-390-footer.png` (800 × 844). Also inspected the 320px phone and the half-revealed desktop footer.
- Retained the source's FK Grotesk type, 20/30/40px gutters, black/white/gray palette, 54px upper-right mark, responsive marquee scale, three-rem gaps and 20-second linear two-track movement. TOML copy, three time zones, four social destinations, transparent white carton and orange squares are intentional requested differences. The source's descriptive claim is removed.
- Mobile uses the requested full-viewport reveal, rather than the source's normal-flow footer. It shows every supplied contact block without the clock row. Desktop retains stacked offices; short wide viewports use three columns so postal details remain readable. Exceptionally short narrow windows allow internal footer scrolling rather than dropping content.

## Findings and resolution

1. Initial result: blocked. [P2] At 320 × 568 and 1200 × 800, the full-contact composition exceeded the frame by a few pixels. Reduced the forced group gap and extended the compact three-column layout through 832px viewport height. All 15 final viewport checks fit without vertical/footer or horizontal/page overflow; the deliberate 320 × 320 internal-scroll fallback also reaches the legal links.
2. Final result: passed. The footer remains fixed at viewport coordinates while the white foreground moves upward. Fully revealed content clears the foreground by less than 2px. The fixed hero is hidden while covered and returns after Back to top. Final captures wait for the existing header fade to settle.
3. The existing showreel test asserted media pause before the native dialog close event ran. Added a condition-based wait for closed-and-paused; no dialog application behavior was changed. The complete focused draft runner then passed.

## Validation

| Check | Result |
| --- | --- |
| Formatting and Astro/TypeScript | Passed; 51 Astro files, zero diagnostics |
| Site build / existing unit tests | 35 pages built; 18 tests passed |
| Full-site browser regression | 142 viewport checks and 8 interactions passed |
| Existing focused landing checks | 12 layouts and 14 interaction groups passed |
| Footer browser checks | 15 portrait/landscape layouts and 6 interaction groups passed |
| Fixed reveal and full-height layout | Top, half reveal and full reveal checked from 320 × 568 to 2560 × 1440 |
| Clock behavior | Fixed-time checks verify London, Kosovo and Calgary offsets; second updates verified |
| Links and interactions | Four current TOML socials, orange marquee, Back to top and keyboard focus reveal passed |
| Progressive behavior | Reduced motion stops marquee; no-JS retains normal-flow addresses; 320 × 320 internal scrolling reaches legal row |

Evidence: `artifacts/landing-footer/browser-results.json`, `artifacts/landing-page-draft/browser-results.json` and `artifacts/refactor-qa/browser-results.json`. Browser testing used the previously authorized Playwright/Google Chrome fallback. Safari, Firefox and physical-device testing were not part of this pass. Publication is verified separately from these local checks.

Implementation checklist: reference/code review complete; supplied mobile correction implemented; desktop/phone comparisons opened; blocking findings fixed; current source and interaction checks passed.

---

# Earlier landing page draft QA — 21 October 2026

final result: passed

Scope: `/landing-page-draft`, through Selected Work, against the Wonder Vision homepage and the user's subsequent copy, wordmark, orange-square, mobile-menu and animation instructions. Source/code review and asset provenance are in `docs/landing-page-draft.md`. This is local review evidence.

## Comparison evidence

- Source visual truth: only `https://www.wonder-vision.com/`; complete desktop and phone captures under `artifacts/landing-page-draft/reference-*`. Measured computed styles are retained in `reference-styles.json`.
- Implementation: `artifacts/landing-page-draft/draft-{1440,390}-{top,stories,intro,work,down,up}.png`, plus `draft-mobile-menu.png`, `draft-showreel-open.png` and bottom-of-page captures.
- Desktop viewport and each source/implementation image: **1440 × 900 CSS/pixel dimensions**, DPR **1**. Phone: **390 × 844 CSS/pixel dimensions**, DPR **1**. No device/browser chrome or density resampling. Combined comparison images place equal-size source and draft views side by side, resulting in 2880 × 900 and 780 × 844 images.
- Full-view comparisons opened together: `comparison-{1440,390}-{top,stories,intro,work}.png`. Section starts are aligned at 100px. Intentional changes in copy/wordmark/media and the phone hero's shorter three-line composition are evaluated against the user's requirements rather than treated as source drift.
- Focused comparisons: `comparison-{1440,390}-header.png` and `comparison-{1440,390}-{stories,work}-focused.png`. Section crops remove the top 90px to exclude the reference capture's independently controlled Lenis header state. Scroll-direction/header behavior is verified separately in the up/down captures and browser assertions.
- States include top, scrolling down/up, story reveal completed, work reveal completed, mobile navigation, modal playback and page bottom. Timing tests inspect the actual computed styles and transition events, including a reload with restored scroll position.

## Fidelity review and revision history

No actionable P0/P1/P2 finding remains after the final comparison.

The later screenshot refinement removes the visible Play Showreel and background pause controls. The reel itself is now a transparent full-area button, with the down arrow above it as a separate action. Desktop and phone captures (`draft-1440-top.png`, `draft-390-top.png`) confirm the controls are absent. Browser checks cover direct pointer click, phone touch, keyboard Enter, full-player playback, close/Escape, focus return and preview resumption.

The subsequent header comparison identified a fixed 26px navigation size, 36px gaps and centered block links that differed from the reference's responsive type and inline-link alignment. The header now copies the source's navigation wrapper/list structure, type steps, gaps, padding, top offsets and 768px desktop-navigation breakpoint. Fresh source/draft measurements at nine widths are in `artifacts/landing-header-refinement/before.json` and `after.json`; `comparison-{390,1440,1634,2452}-header-only.png` pairs the actual 82px header regions at DPR 1. Both live header boxes measure 82px; the corrected text metrics and vertical placement now match. Different labels and the intentionally different brand mark remain expected.

The carton SVG was traced from the supplied raster's connected outline after removing the two isolated TJ components. It contains black vector paths with transparent background/interior. It is displayed 44px tall, without the old raster's padded white square. A rapid reverse scroll keeps the wordmark during the fade, swaps only at zero computed opacity, then reveals the carton. Returning to the top restores the wordmark and cancels any pending swap. Browser and alpha-channel checks passed for these states.

The final mobile-menu revision replaces the white navigation view with the reference's static black full-screen panel. Fresh 390 × 844, DPR 1 source and draft captures are paired in `artifacts/landing-menu-refinement/comparison-390-menu.png`; the opened comparison confirms matching link type, top/side spacing, Close placement, Latest baseline and 448 × 128px case-card geometry. TOML retains its own four links and case content. Both directions use the source's 700ms easing, with a fading backdrop. The panel has no independent content reveal or automatic carousel motion. Touch swiping, previous/next end states, native modality, explicit keyboard wrapping, Escape, closing focus return and desktop resize reset passed. Additional checks at 320 × 568, 390 × 844, 560 × 740 and 767 × 390 confirm no overlap or page overflow; the short landscape panel can scroll internally. Evidence is in `menu-results.json` and the matching screenshots in that directory.

The final scroll-arrow correction removes the 24px anchor offset that left the bottom of the video visible. The native anchor now clears the reel by 1px, accounting for fractional responsive heights while retaining the story section's original padding. Real clicks passed at 12 portrait/landscape sizes from 320 × 568 through 2560 × 1440, plus keyboard activation with reduced motion. Measurements and 390/820/1440 screenshots are in `artifacts/landing-arrow-refinement/`. All 142 site-wide viewport and eight interaction checks passed again after this correction; the build, type checks, 18 tests and Worker dry run also passed.

- **Fonts and typography:** local FK Grotesk regular/light/bold match the reference's families and weights. Hero sizes, section labels, caption type and 1.5 prose leading follow the source scale. The supplied Microgramma Bold deliberately replaces the reference logo. The later three-line maximum is verified at 12 widths; smaller phone hero text is an explicit adaptation to that requirement.
- **Spacing and layout:** fixed 82px header, matching 20/30/40px gutters, fixed heading with a natural-height spacer, source reel ratios and constrained sticky controls. Prose uses the reference's 58% column on larger screens. Work panels retain the 1440:607 / 335:418 crops, caption offsets, square corners and image-hover scale. A contained white scrolling surface prevents the fixed heading from appearing through bottom spacing in this footerless draft.
- **Colors and tokens:** white canvas and header, black typography, existing `--accent: #ff532f` for the wordmark dot and both section squares. Earlier `comparison-*-work-initial.png` captures show the original black work marker; it was changed after the user's orange-marker instruction and recaptured in the final comparisons. Both squares' computed color matches at all 12 widths.
- **Image quality and asset fidelity:** supplied milk-carton mark and Microgramma file; actual reference SVG menu/close/play/arrows/square; existing TOML showreel and project images. The poster is a real frame of the supplied film. No generated media, invented projects, approximate logo drawing or source hotlinks. Portrait previews crop the supplied landscape film; full playback preserves the complete frame.
- **Copy:** final wordmark `TOML.`; hero “A creative agency powered by a global collective of storytellers”; large heading `TELL / YOUR / STORY`; supplied two-paragraph introduction with the later “we tell stories that inspire people and moves brands” replacement verbatim. Work selection uses existing TOML content. All final revisions were recaptured.
- **Animation:** the final story sequence directly adapts `pushBeyondReality.js` with the source's 300ms trigger delay, 200ms word staggering, 30px blur, left/right/left travel and one-second ease-out. A start guard and removed listeners prevent a replay in the same document. Hero, reel, prose, heading/link group and work entries fade from white over 1500ms at the reference's 120px AOS offset. A head-applied initial state prevents a visible-content flash before the animation script. Reloading with restored scroll position restarts the visible-content fades. Reduced motion and no-JavaScript reading remain supported.

## Validation

| Check | Result |
| --- | --- |
| Formatting and Astro/TypeScript checks | Passed; zero diagnostics |
| Existing unit tests | 18 passed |
| Static site build | Passed; 35 routes |
| Existing site-wide browser regression | 142 viewport checks and 8 interaction checks passed |
| Draft layouts and scrolling | 12 widths, 320–2560px; no overflow or broken images; hero at most 3 lines |
| Draft interactions | 14 groups passed, including animation direction/timing/once behavior, header metrics, delayed logo swap/rapid reversal, transparent text-free SVG, restored-scroll reload, sliding menu, keyboard handling, case-carousel end states and touch swipe, full-reel pointer/touch/keyboard activation and reduced motion |
| Mobile menu refinement | Four additional portrait/landscape viewport checks passed; source/draft comparison opened at equal size |
| JavaScript page errors | None in completed browser runs |

Browser evidence: `artifacts/landing-page-draft/browser-results.json`, `final-content-results.json` and `artifacts/refactor-qa/browser-results.json`. The full-site regression was followed by the targeted final animation/menu/copy checks after the later user revisions. Meaningful UI changes were checked again; small copy/color revisions were also read back from the rendered page.

The browser is headless Google Chrome through the explicitly authorized Playwright fallback. Physical-device and Safari/Firefox checks remain outside this pass. Dedicated portrait film/work exports could improve future mobile art direction; current crops use the supplied assets and are not a blocking fidelity issue.

Implementation checklist: source/asset inspection complete; latest requested content and behavior implemented; desktop/phone comparisons opened together; blocking findings resolved; local draft remains explicitly unindexed.

---

# V4 design QA — 19 October 2026

final result: passed

This result covers the local full-site design draft and its implemented interactions. It does not approve publication, final content, the provisional House treatment, or production mail delivery. Those inputs remain in `docs/design-brief.md`.

## Comparison evidence

- Source visual truth: TOML’s shared V4 Slides deck, all 15 pages reviewed. Original homepage thumbnail: `/tmp/toml-home-reference.png`; other source thumbnails: `/tmp/toml-ref-p2.png`, `p3`, `p7`, `p8`, `p10`, `p11`, `p12`, `p15`, `p16`. Extracted source objects and copy were reviewed for the remaining case layouts.
- Retained normalized homepage reference: `artifacts/design-qa/home-reference.png`.
- Browser-rendered implementation: `artifacts/design-qa/home-desktop.png`, `home-mobile.png`, and route-named desktop/mobile PNGs in the same directory.
- Desktop viewport: **1440 × 900 CSS px**, device scale factor **1**. Source thumbnail pixels **1600 × 4444**, normalized to the deck’s **1440 × 4000** reference canvas. Browser screenshots are **1440 × document height**; mobile screenshots are **390 × document height**. No device chrome is included.
- Full source and implementation images were combined into the same comparison input: `home-comparison-initial.png`, `home-comparison-final.png`, `about-comparison-final.png`, `about-approach-comparison-final.png`, `people-comparison-final.png`, `people-members-comparison-final.png`, `work-siebert-comparison-final.png`, `contact-comparison-final.png`.
- Focused comparisons: `hero-comparison-initial.png`, `hero-comparison-final.png`, and each route’s `*-focused-final.png`. The source occupies the left 1440px; the implementation occupies the right 1440px. Focused regions retain the same natural CSS scale rather than scaling text to fit a full-page preview.
- State: normal desktop page, no open menu/dialog/filter; additional screenshots cover the core-team drawer. Source drafts contain no open-drawer or mobile visual, so those states were checked against supplied behavior and responsive requirements.
- Content-length differences are explicit: the Work index has supplied additional projects, Siebert includes its campaigns, and member pages contain galleries recovered from the legacy site. Those pages are not expected to have the source slide’s fixed height.

## Comparison history and fixes

1. **Initial result: blocked.** [P2] Homepage hero used the full original still with a different crop; homepage footer signature was too large; excess work-card/section spacing accumulated down the page. Evidence: `home-comparison-initial.png` and `hero-comparison-initial.png`. Corrected the crop from the supplied original pixels, reduced the homepage wordmark to the deck’s smaller treatment, and adjusted card gaps and section rhythm. Restored the supplied working showreel after the user identified the source.
2. **Intermediate result: blocked.** [P2] Inner-page heading/lead proportions were too small on case pages, Contact was centered inside an unnecessarily narrow container, and About’s content began too low after its secondary navigation. Corrected the case title/lead scale, inline client metadata, contact alignment and intro spacing, and About’s heading/secondary-navigation rhythm. Post-fix evidence: `work-siebert-focused-final.png`, `contact-focused-final.png`, `about-focused-final.png`.
3. **Intermediate result: blocked.** [P2] Core Team’s desktop hero wrapped onto three lines instead of two, an extra secondary-nav row displaced the grid, and Approach benefits had oversized row spacing while project-step headings were too large. Corrected the intro’s grid tracks, removed the extra Core Team row, adjusted the benefits typography/spacing and project rhythm, and recaptured the affected pages. Post-fix evidence: `people-focused-final.png` and `about-approach-comparison-final.png`. The affected routes then passed 18 fresh layout checks at 1440, 900 and 390px.
4. **Final comparison:** no actionable P0/P1/P2 mismatch remains for this draft. Remaining differences below are content decisions, source limitations or P3 polish.

## Required fidelity surfaces

- **Fonts and typography:** Arial main copy; self-hosted Questrial/Archivo Black testimonial and Anton member display name. Compared heading size, weight, wrapping, body leading and metadata at source scale. Nertil’s corrected full name intentionally differs from the mockup’s inconsistent display name. Browser/platform antialiasing differs slightly from the slide raster.
- **Spacing and layout:** source grid, generous gutters, column hierarchy, rectangular project crops, CTA bands and footer signature are retained. Hero/inner-page wraps, Contact alignment and the visible spacing regressions above were fixed. Real browser reflow and additional supplied content produce different document heights from the fixed slides.
- **Colors and tokens:** source canvas, ink, muted text, rules, orange-red bands, blue testimonial and peach attribution label are mapped explicitly. Primary buttons retain the black pill shape; focus, active filters and validation are visible. Underlined links use ink consistently instead of copying Office hyperlink blue as an additional brand color.
- **Image quality and asset fidelity:** source artwork, portraits, badges and original legacy portfolio images are reused; consumed images are local WebP files. No generated logos, substitute stock imagery or CSS illustrations were introduced. The connected-team diagram is extracted from the source slide. Playlist tiles and initial portraits reproduce source-native text/color treatments. House imagery remains an expressly approved provisional source photograph.
- **Copy and content:** checked against extracted deck copy, comments and legacy content. Vvitaverse replaces Elja in Selected Work, UNIT9 is retained, and Fast Company is attributed to Virtyt’s membership. Journal goes to its existing domain. No case outcomes or bios were invented to fill missing material. Source initial portraits, unavailable Spotify links, the pending cookie information and preview contact restriction are explicit.

## Browser and functional verification

Evidence: `artifacts/design-qa/browser-results.json`, `targeted-layout-results.json` and screenshots. The temporary runner is `/tmp/toml-qa.mjs`; the final affected-layout runner is `/tmp/toml-targeted-layout.mjs`.

- **66 route/viewport checks:** all 33 content routes at 1440 and 390px; one H1, expected noindex, no broken images and no horizontal overflow.
- **18 additional post-fix layout checks:** People, Work, About, Approach, Story and Nertil at 1440, 900 and 390px. Also checked Home, Members and Contact at 768 and 900px in the main interaction run.
- Work and Members filters update visibility, selected state and count. Reset returns all nine cases / twelve members.
- Core-team drawer opens, Escape closes it, and focus returns to the invoking button. Native modal behavior provides background inertness and focus containment.
- Contact query parameters select the member-enquiry type and safely prefill Nertil’s name. Required-field errors match the handoff. Valid preview submission makes no API call, retains the message and states that nothing was sent.
- Showreel opens, plays the actual supplied 1280 × 720 optimized video (duration 120.853 seconds), and pauses after the dialog closes.
- Mobile Menu contains the five intended destinations and closes with Escape. Links and filters are usable without hover.
- Console/page errors: **0** in the completed browser runs.
- Keyboard focus, input labels, artist attribution, native media controls and reduced-motion behavior were inspected. This is a focused implementation check, not a formal accessibility certification.
- Build-output internal link/media check found no missing local targets. The static Journal redirect is packaged separately from content pages.

## Other checks

- `npm run check`: passed with zero errors, warnings or hints.
- `npm test`: **16 passed**, including preservation/bounds tests for enquiry metadata and existing sending protections.
- `npm run build`: passed; 34 content/error pages plus a Journal redirect artifact.
- `npm run studio:build`: passed.
- `npm run worker:check`: passed, including current generated types and deployment dry run. No deployment was performed. Initial sandbox log-directory errors were resolved by rerunning the authorized check with the required filesystem access.
- All served media files fit within the checked per-file packaging threshold; showreel is approximately 18 MB. Unused downloaded working copies were removed from the served directory.

## Follow-up polish and publication inputs

- [P3] Refine exact optical spacing, font rendering and secondary image crops during TOML’s visual review; the browser’s dynamic layout does not reproduce every PowerPoint text-box boundary.
- Replace the three source initial portraits and provisional House photograph when approved originals arrive.
- Finalize taxonomy, counts, project selection, recognition and testimonial approval. Preserve Nertil in Members as the user instructed.
- Supply five Spotify links. Complete CMS migration/Studio publication and production form acceptance separately. Corporate Bonds retains supplied artwork and its source link; Don’t be that guy currently opens the supplied Behance case.

Implementation checklist: visual fixes applied; post-fix comparisons opened; desktop/mobile/tablet checks passed; primary interactions passed; source and release limitations recorded; local preview retained for review.
