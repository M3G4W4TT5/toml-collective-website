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
