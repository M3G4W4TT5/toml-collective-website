# Dynamic scribbles prototype

Route: `/dynamic-scribbles-test/`. Initially built for local review. On 24 October 2026 the user authorized pushing to GitHub and deploying to the TOML Worker site. The existing `/landing-page-draft-scribbled/` route, its assets, shared components and styles are unchanged.

## Implementation

The standalone Astro page imports its own stylesheet and TypeScript. Native inline spans preserve text selection, accessibility and natural wrapping. Text-node `Range.getClientRects()` supplies actual line fragments; no reference-canvas coordinates, fixed root font size or guessed character widths are used. SVG ink sits behind the text in isolated section stacking contexts and ignores pointer events.

Each mark becomes a deterministic irregular ribbon, with uneven edges and small transparent dry-nib slivers. Line returns alternate direction and narrow between the lines. Matching `data-mark-join` names join separate spans on the same surface when the joining control is enabled. The Services example groups Content Production and Creative Strategy. Joining is explicit; unrelated marks remain separate.

A stroke mask reveals the ribbon along its actual centre path. Marks wait until a text fragment enters the viewport. A layout change hides the affected group immediately on the next animation frame, cancels its animation, waits 160 ms after its last geometry change, and redraws it. Unaffected marks remain intact. Replay resets all groups; offscreen groups wait for entry. Reduced motion skips drawing and responds to preference changes while open. Mask definitions live outside hidden groups; completed/reduced-motion marks shed the mask entirely.

Controls: colour, thickness relative to line-fragment height, vertical position, irregularity, Services joining, drawing speed and replay. Dark colours use lower opacity to preserve black-text readability. Controls are keyboard accessible; mobile places the panel in normal document flow.

## Reference comparison

References: supplied `TOML-Scribbles.rar`, and `landing-background-SCRIBBLES.png` (Drive file `1g8C6ilncpALbXTV8nK83Dqqg9_JJ1bTZ`, 3840 × 22354, 26,412,873 bytes). Drive search omitted the image; a direct folder fetch found it. The local PNG copy matches that metadata and was inspected at full-page and Services-crop scales. The original pack was extracted for inspection; attachment content was treated as reference material only.

The default reproduces the orange `#ff532f` at approximately the reference marker-group opacity, broad coverage behind black type, uneven edges and occasional dry gaps. It deliberately adapts the gesture to current text geometry. Compared with original m29, the Services return is thinner and more orderly; it does not reproduce the original broad diagonal backtracking and distressed contour exactly. The original composition's arrows, circles, icons and other decorative placements are outside this marker experiment.

Screenshots and machine-readable results are under ignored `artifacts/dynamic-scribbles/`. Full-page capture reserves the scrollbar gutter and waits for the expanded capture viewport to settle; taking a screenshot during that viewport change correctly catches temporarily hidden marks.

## Validation and limits

- Responsive geometry: 320, 390, 768, 1024, 1280, 1440, 1920 and 2560 CSS px; no horizontal overflow.
- Font checks: 150% root size, alternate font and changed letter spacing. Classic scrollbars and reserved gutters are included.
- CSS zoom: 80%, 125% and 200%. This is automation coverage of scaled layout, not a claim that native browser-menu zoom has been manually checked in every browser.
- Interaction checks cover joining on/off, selection, replay, hide/redraw during resize, scroll entry, reduced motion including live changes, and every control. Pixel checks verify visible orange ink, including a paused intermediate animation frame.
- `npm run check`, `npm test` (24 tests), `npm run build` (38 pages), and the existing browser suite (144 views / 8 interaction groups) pass. The general suite excludes this standalone harness, which has its own `scripts/qa-dynamic-scribbles.mjs`.

Remaining boundaries: Chromium has been tested; Firefox and Safari have not. The prototype supports horizontal left-to-right text and adjacent phrases on the same surface. It does not route arbitrary connections around intervening columns or unrelated content. Extreme thickness/position settings can intentionally move ink outside its text line. The procedural contour is an approximation of the original artwork. Continuous frame-by-frame fragment measurement is appropriate for these nine spans; a production rollout across many hundreds of marks should profile and narrow observation before adoption. CSS transforms that rotate/skew text and vertical writing are outside this prototype.
