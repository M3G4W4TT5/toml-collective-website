# Client logos, testimonials and orange markers — 21 October 2026

final result: passed

Scope: the latest supplied logo-strip and testimonial references, plus the general orange-square instruction, on `/landing-page-draft`. The latest user request lifts the earlier hold and authorizes publishing the accumulated Instagram, services, contact invitation and current additions. The original homepage remains in place.

## Visual evidence and fidelity

- Inspected all 15 supplied logos in a native source contact sheet before implementation. The exact original PNGs are retained; SVG derivatives preserve path geometry and transparent/white cutouts, with dark-gray foregrounds. No generated or substitute logos, portraits or client names were introduced. Opened `artifacts/landing-trust/comparison-clients.png`: the supplied 2434 × 292px strip above the draft's 2434 × 253px native capture, with white padding to equal frame height and a 20px separator. There is no density resampling. Different logos and the requested darker gray are intentional.
- The six black-background attachments supply quote content only. The final supplied 1597 × 460px image supplies the quote/attribution composition; the requested TOML orange/white colors and narrow frame supersede its background and padding. Inspected native draft captures at 1597px and 1440px, plus 390px and 320px phones: `final-{1597,1440,390}-testimonial-{1,5}.png` and `draft-320-testimonials-region.png`. The first and fifth slides include the longest quote and company attribution. All six were also measured at every viewport. Desktop preserves the quote/attribution split and vertical rule; mobile stacks the attribution without portraits. No exact pixel-clone claim is made for this intentionally adapted style reference.
- Fonts/content: retained local FK Grotesk to match the rest of the draft. Names and roles occupy separate blocks. All six supplied quotes were transcribed; the blurred ending of Stefano's shortened excerpt was checked against TOML's current public testimonial. Natural text wrapping is preserved, without truncation or fixed-height clipping.
- Layout/rhythm: the logo strip uses balanced, unwarped native proportions in evenly spaced slots. Two equal groups form a 150-second loop, approximately 19–24px/s. The logo strip occupies the preceding work gap. Testimonial top/bottom padding equals exactly one quote line height; its height adapts to the active quote. The third-party reference's large empty vertical padding is intentionally reduced following the user's direction.
- Colors/assets: all heading markers, including Services, Instagram and the menu's Project label, resolve to `rgb(255, 83, 47)`. Logo foregrounds are dark gray on white. Testimonials use solid `#ff532f` and white text with existing source arrow SVGs. Square corners, thin rules and the shared gutters match the established page; no portrait artwork or alternate branding is shipped.

## Functional and responsive checks

- `scripts/qa-landing-trust.mjs`: 14 sizes, 320–2560px, and five interaction groups passed. All six slides were checked at every size for exact author order, one active slide, no portraits/overflow/clipping, orange/white colors and one-line vertical padding. The right section order is Work → clients/partners → Services → testimonials → conversation → Instagram → footer.
- Verified real leftward logo movement, equal loop-group widths, Pause/Resume, logo-window keyboard pause and offscreen gating. A focused Pause button no longer suppresses Resume after leaving the strip. Reduced motion/no JavaScript expose all 15 logos without duplicates. No-JavaScript exposes all six complete testimonials.
- Testimonial previous/next buttons wrap; Left/Right keys, Enter, white focus outline and an actual CDP mobile touch gesture passed. Quotes never auto-advance. No JavaScript page errors occurred.
- Full-site browser regression: 142 views and eight interactions passed. Instagram: 14 layouts and eight groups passed with no Instagram/Meta runtime requests. Footer/newsletter: 19 layouts and eight groups passed. Formatting, Astro/TypeScript checks (61 files, zero diagnostics), 18 unit tests and the 35-page build passed.

No actionable P0/P1/P2 finding remains. Previously authorized Chrome/Playwright verification was reused. Evidence is in `artifacts/landing-trust/browser-results.json`, the native captures/comparison above and the existing Instagram/footer/refactor result files. Publication proof is recorded separately in the release commit's GitHub/Workers checks and ignored `artifacts/landing-page-release/` after deployment; this report establishes the completed local design gate.

---

# Services section — 21 October 2026

final result: passed

Scope: the reference homepage's Our Services section, added immediately above the contact invitation on `/landing-page-draft`. The six supplied services appear in two columns and three rows, in row order: Strategy / Film & content; Brand identity / Motion; Campaigns / Digital experiences. The right-aligned “How we work” link below the rows opens the existing `/work/` page. Publication remains on hold.

- Captured live source desktop/mobile views and computed layout/type at ten widths from 320 through 2560px before implementation. Opened equal-size `artifacts/landing-services/comparison-{1440,390}.png` pairs at 1440 × 900 and 390 × 844, DPR 1, with 20px separators. Also opened `comparison-1440-rows.png`, a 1940 × 330px pair of unscaled 960px-wide row crops, to inspect type, rule weight and spacing. The following source Vimeo frame is outside the services target and not part of the fidelity assessment.
- Fonts and typography: retained FK Grotesk, source bold uppercase label size/tracking, 18/25/28/32/36/38/40px service type and 1.5 leading. Layout: source third/two-thirds desktop split with 64px grid gaps, stacked phone label, two list columns, 24px label/link spacing, 8/12px cell padding, negative 8px desktop list offset and 60/110/145/180px section margins. Labels wrap within their cells on the narrowest phone size.
- Colors and assets: black text, black 1px continuous row rules, white surface and the reference's black square with its 2px upward offset. Reused the actual local source square/arrow SVGs; no images or asset substitutions. Copy: every supplied service and link label matches the request. The additional third row and work link are intentional requested additions. Link typography matches the draft's existing View all work component.
- Ten source-matched responsive checks passed: exact copy/order, two columns / three rows, source typography/geometry/rules, right-edge link alignment, immediate contact-section placement, scroll fade and no horizontal overflow. Desktop/mobile keyboard activation reached `/work/`; focus styling, reduced motion and no-JavaScript reading/navigation passed. No JavaScript page errors occurred.
- Formatting, Astro/TypeScript checks (56 files, zero diagnostics), the 35-page build and required site-wide browser regression (142 views and eight interaction checks) passed. Evidence: `artifacts/landing-services/reference-metrics.json`, `browser-results.json`, comparison images and `artifacts/refactor-qa/browser-results.json`.

The first visual comparison passed with no actionable P0/P1/P2 findings. Existing authorized Chrome/Playwright verification was reused. No new script, route, dependency, CMS content, homepage change, commit or deployment was required.

---

# Contact invitation — 21 October 2026

final result: passed

Scope: the reference homepage's `.heading-right` section, inserted immediately above Instagram on `/landing-page-draft`. Requested text is exactly “What have you got in mind?” followed by the gray “Start a conversation.” link. The existing `/contact/` route is reused. Changes remain local and uncommitted under the publication hold.

- Captured the live reference on desktop and mobile before implementation, including hover. Measured nine widths from 320 to 2560px. Opened equal-size source/draft comparisons at 1440 × 900 and 390 × 844, DPR 1: `artifacts/landing-contact/comparison-{1440,390}.png`. Each pair uses a 20px separator. The longer requested link naturally occupies two lines on phones; different copy and Instagram media are intentional.
- Reused the source FK Grotesk font, 40/45/50/56/62/68/80px size steps, 1.1 leading, 624px text limit, 20/30/40px gutters, right-half desktop column, 2px downward column offset and 70/110/140px bottom padding. Link weight is 500 and color is `#737677`, including hover; text remains black. No image, icon, radius or additional visual treatment is introduced.
- Reused the draft's source-based 1500ms once-per-load scroll fade. Reduced motion and no-JavaScript render readable content immediately. The normal anchor retains the existing orange keyboard focus outline and opens the current origin's contact page.
- Nine source-matched layout checks passed, including exact copy, computed typography/spacing/color, immediate Instagram placement and no horizontal overflow. Real desktop and phone keyboard activation reached the existing contact route; hover, fade, reduced-motion and no-JavaScript navigation checks passed. The deployed Workers contact URL separately returned HTTP 200; no form was submitted.
- Formatting, Astro/TypeScript checks (55 files, zero diagnostics), the 35-page build and required site-wide browser regression (142 views and eight interaction checks) passed. No JavaScript page errors occurred. Evidence is in `artifacts/landing-contact/reference-metrics.json`, `browser-results.json`, source/draft screenshots and `artifacts/refactor-qa/browser-results.json`.

No actionable P0/P1/P2 finding remains. Existing authorized Chrome/Playwright verification was reused. No route, dependency, CMS, contact form, homepage or deployment change was required.

---

# Instagram section and viewer — 21 October 2026

final result: passed

Scope: the last scrolling section of `/landing-page-draft`, immediately before the fixed footer. The original homepage is unchanged. This increment remains local and uncommitted under the user's latest publication hold; no push or deployment was made.

## Source and comparison evidence

- Inspected only the supplied Wonder Vision homepage, its `instagramFeed.js`, and the loaded Smash Balloon Instagram Feed Pro 6.13.0 JavaScript/CSS. Retained public DOM, computed styles, source icons and navigation sprite under ignored `artifacts/landing-instagram/`.
- Captured reference and draft at 1440 × 900 and 390 × 844, DPR 1. Grid-only images are 1440 × 480 and 390 × 585; popup captures retain the entire viewport. Opened final equal-size source/draft pairs: `comparison-{1440,390}-grid-region.png` and `comparison-{1440,390}-popup.png`. Each pair has a 20px separator. Source and draft use different media and captions intentionally.
- Fonts and typography: source FK Grotesk, 11px bold label, 24/28/36.8px responsive title and 24px profile icon. The popup retains the source's Open Sans/Helvetica/Arial/sans-serif stack, 13px type and 1.3 leading. The requested title is exactly `Posts from the collective`.
- Layout and spacing: square edge-to-edge tiles, 20px intro padding, source responsive 2/4/5/6-column layout and 6/8/10/12 total visible tiles. This produces 5 phone and 11 full-desktop posts plus the introduction, with the source's intermediate tablet counts. The 300px desktop caption column stacks below media at 640px and narrower. Media preserves its aspect ratio with a viewport-height-minus-150px limit, 50px top position and source rounded corners.
- Colors and controls: black/white grid, 90% black modal backdrop, actual source stack/play/profile/close/share icons, circular inner carousel arrows, source dot sizing and outer post-navigation sprite. The black Instagram section square follows the reference; the previously requested orange markers elsewhere remain unchanged.
- Assets and copy: verified the 11 latest dated public TOML posts individually, excluding the older pinned post. Captions and collaborative author attribution are preserved. All 50 images/posters, 16 playable videos and three author avatars are local assets; thumbnails use the existing responsive image pipeline. No generated images, invented captions, expiring CDN links, feed tokens or Instagram runtime dependency are shipped.

## Findings and resolution

1. [P2, resolved] The draft's shared square-button reset overrode the inner carousel arrows' round shape. Scoped the component rule and opened fresh phone/desktop popup comparisons to confirm the source's circular controls. Also corrected the popup stack marker to the measured 16px size.
2. [P2, resolved] A real Tab traversal could leave the dialog for browser chrome at the last control. Added explicit first/last focus wrapping and repeated keyboard opening, traversal, Escape and focus-return checks.
3. [P2, resolved] The site-wide broken-image check caught the closed popup's initially empty author image. Initialized it with the first post's real avatar, preserving lazy loading; all 142 site-wide views then passed.

No actionable P0/P1/P2 finding remains. Intentional differences are the requested heading and TOML content, the 11-post snapshot counter, native HTML modality in place of WordPress, and space reserved for outer arrows in narrow desktop windows. Reduced motion avoids autoplay and animation; plain links remain available without JavaScript.

## Validation

- Formatting, Astro/TypeScript checks (54 files, zero diagnostics) and the 35-page production build passed.
- Dedicated Instagram runner: 14 responsive layouts from 320 × 568 through 2560 × 1440, plus eight interaction groups. Checks include exact visible post counts, square tiles, no horizontal overflow, flush grid/footer boundary, actual video playback and pause, all 11 posts, carousel arrows/dots/wrap, keyboard focus, closing, sharing, real mobile touch gestures, vertical popup scrolling, reduced motion and no-JavaScript links.
- Existing site-wide browser regression: 142 views and eight interaction checks passed. Existing footer regression: 19 layouts and eight interaction groups passed, including the centered newsletter caption and fixed reveal.
- No JavaScript page errors or Instagram/Meta runtime requests occurred in the dedicated runner. External profile/post/mention/hashtag links remain explicit user navigations.

Evidence: `artifacts/landing-instagram/browser-results.json`, `artifacts/refactor-qa/browser-results.json`, `artifacts/landing-footer/browser-results.json`, the source/draft comparisons above and `docs/landing-page-draft.md`. Browser checks use the previously authorized headless Chrome/Playwright fallback. Physical-device Safari/Firefox checks are outside this pass. The dated snapshot does not update automatically; a live feed connection is separate future work.

---

# Footer newsletter addition — 21 October 2026

final result: passed

Scope: the supplied newsletter image link above the landing draft's footer socials. The annotated rectangle determines the desktop frame's right alignment, approximately 22% viewport width and 3.5:1 ratio. The caption uses the existing white footer typography; annotation red is a positioning guide.

- Retrieved `tomljournal-logo-animation.gif` from the supplied Drive folder through Google Drive. The original 800 × 450px, 176-frame, 210,407-byte image is preserved. CSS frames excess canvas padding; a pixel-bound inspection of all frames and a maximum-travel frame capture confirmed the moving artwork remains inside the image area. Reduced motion selects a still from frame 90.
- Opened final 1440 × 900 and 390 × 844 captures and inspected the newsletter at 2460 × 1522 against the user's annotated position. Desktop retains the prior socials, marquee and legal row positions. Mobile places the link above socials in normal flow; every address, phone and email remains available. Short landscape switches to flow to prevent the newsletter covering Calgary's details. Small windows use the established internal-footer scrolling fallback.
- The caption stays on one line. The entire image/caption link is keyboard accessible and points directly to `https://www.tomljournal.com/subscribe`; a real browser click verified the navigation URL with the external response intercepted, without submitting a signup.
- The final user correction centers the caption over the media and sizes its lettering to the media frame width. Real text-range measurements check both width and horizontal center within 1px at all 19 viewports. The final footer checks were repeated after this scoped CSS correction.
- Formatting, Astro/TypeScript checks (zero diagnostics), and the 35-page build passed. Full-site browser regression passed 142 views and 8 interactions. The extended footer runner passed 19 layouts and 8 interaction groups, including contact overlap, frame ratio, link navigation, clocks, reveal, reduced motion and no-JS fallback.

Evidence: `artifacts/landing-newsletter/`, including `final-{1440,390}-footer.png`, `animation-maximum-travel.png` and `browser-results.json`. Existing Playwright permission was reused. No dependency, CMS, mail or homepage change was required.

---

# Earlier landing footer QA — 21 October 2026

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
