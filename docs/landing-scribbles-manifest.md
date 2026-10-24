# Landing-page scribble placement manifest

## Reference and measurement

- Reference: the supplied `landing-background-skribbles.psd`, a 3840 × 22354 px full-page capture of `/landing-page-draft/` at a 1920 px desktop viewport and 2× device scale. Its corresponding CSS reference canvas is **1920 × 11177 px**. Coordinates below are CSS pixels from the top-left of that full page.
- `Center (x, y)` is the center of the Photoshop smart-object transform rectangle. `Size (w × h)` is the SVG display box **before** rotation, in CSS pixels; it specifies both horizontal and vertical scale. For absolute positioning, use `left: x; top: y; width: w; height: h; transform-origin: center; transform: translate(-50%, -50%) rotate(a) scaleX(-1)` (omit `scaleX(-1)` where no flip is listed). Positive angles rotate clockwise. The visible ink can have a smaller bounding box than the display box.
- `Stack` is explicit: **Between** means the mark sits between the background and captured page-content layers; **On top** means it sits above the page-content layer. `Layer` is the Photoshop order from bottom to top. The page-content layer is 40, and `25.1`–`25.8` are inside the Marker group at layer 25. Keep this order where marks overlap.
- All source paths are relative to the `TOML-Scribbles/` directory inside the supplied `TOML-Scribbles.rar`. The 42 used files are also saved under `public/scribbles/` with the same relative paths and full filenames. The SVG paths use black fills; recolour each to the exact listed PSD colour. Opacity is 255/255 unless shown otherwise. The Marker group has **207/255** opacity, applied to the group as a whole; the brain icon has **224/255** opacity.
- The nearby-content descriptions are placement anchors for adapting the composition. These measured coordinates describe the supplied desktop capture; no mobile or other responsive positions are implied.
- The `/landing-page-draft-scribbled/` implementation uses a 16 px root and the full 1920 px viewport width for its desktop reference, including when browser font settings or a classic scrollbar would otherwise change line wrapping. Scribbles are hidden below 1024 px. Placement at other desktop widths remains to be designed after the 1920 px review.

## Used marks

### Circles

| Layer | Stack   | SVG file in archive                               | Near                                         |  Center (x, y) |  Size (w × h) | Rotate / flip | Colour    | Opacity |
| ----- | ------- | ------------------------------------------------- | -------------------------------------------- | -------------: | ------------: | ------------- | --------- | ------- |
| 9     | Between | `circles/svg/toml-circle-c06-heavy-wide.svg`      | Contact call to action, oval around you      | 1380.4, 7942.4 | 159.3 × 102.0 | 0.46°         | `#FF532F` | 255/255 |
| 15    | Between | `circles/svg/toml-circle-c11-airy-three-pass.svg` | Services, oval around OUR SERVICES           |  148.0, 6832.0 | 306.0 × 107.0 | 0°            | `#FF532F` | 255/255 |
| 24    | Between | `circles/svg/toml-circle-c15-open-sided.svg`      | Selected Work, oval around the section label |  158.5, 3014.0 |  317.0 × 81.0 | 0°            | `#FF532F` | 255/255 |

### Icons

| Layer | Stack   | SVG file in archive                        | Near                                                          |   Center (x, y) |  Size (w × h) | Rotate / flip | Colour    | Opacity |
| ----- | ------- | ------------------------------------------ | ------------------------------------------------------------- | --------------: | ------------: | ------------- | --------- | ------- |
| 2     | Between | `icons/svg/toml-icon-i15-wild-flower.svg`  | Footer, small flower below the final TELL YOUR STORY heading  | 1197.7, 11115.3 | 100.5 × 130.4 | -0.32°        | `#FAFAFA` | 255/255 |
| 4     | Between | `icons/svg/toml-icon-i06-sparkle-trio.svg` | Right of the Journal/House cards, just above Instagram        |  1824.5, 9349.1 | 107.8 × 125.9 | 9.00°         | `#0D2481` | 255/255 |
| 7     | Between | `icons/svg/toml-icon-i29-rocket.svg`       | Services, rocket above CGI & VFX                              |  1523.2, 6740.5 |  92.3 × 132.1 | 0°            | `#FF532F` | 255/255 |
| 16    | Between | `icons/svg/toml-icon-i02-exclamation.svg`  | Testimonial, first of three exclamation marks below the quote |   293.7, 7693.4 |   23.8 × 83.8 | 11.95°        | `#0D2481` | 255/255 |
| 17    | Between | `icons/svg/toml-icon-i02-exclamation.svg`  | Testimonial, middle exclamation mark below the quote          |   317.8, 7697.1 |   19.3 × 84.7 | 6.72°         | `#0D2481` | 255/255 |
| 18    | Between | `icons/svg/toml-icon-i02-exclamation.svg`  | Testimonial, right exclamation mark below the quote           |   340.1, 7694.5 |   21.3 × 79.2 | 4.33°; flip X | `#0D2481` | 255/255 |
| 27    | Between | `icons/svg/toml-icon-i16-smile.svg`        | Testimonial, smile at right of the quote                      |  1439.6, 7644.7 |   97.7 × 98.5 | 11.70°        | `#0D2481` | 255/255 |
| 29    | Between | `icons/svg/toml-icon-i22-globe.svg`        | Story intro, globe below the paragraph                        |  1157.4, 2900.6 | 145.7 × 138.3 | 0°            | `#FF532F` | 255/255 |
| 30    | Between | `icons/svg/toml-icon-i17-brain.svg`        | Story intro, brain above the paragraph                        |  1447.7, 2504.8 |  99.3 × 112.9 | -5.65°        | `#FF532F` | 224/255 |
| 33    | Between | `icons/svg/toml-icon-i10-sun.svg`          | Story headline, sun around the O in STORY                     |   487.5, 2309.6 | 471.0 × 545.2 | 0°            | `#FF532F` | 255/255 |
| 34    | Between | `icons/svg/toml-icon-i21-envelope.svg`     | Contact call to action, envelope at the arrow tip             |  1795.1, 8263.1 |  120.8 × 91.1 | -12.19°       | `#FF532F` | 255/255 |
| 42    | On top  | `icons/svg/toml-icon-i03-question.svg`     | Contact heading, question mark near the text                  |  1214.8, 8007.7 |   40.5 × 60.5 | -1.25°        | `#FF532F` | 255/255 |
| 43    | On top  | `icons/svg/toml-icon-i19-newspaper.svg`    | Left edge of the TOML Journal card, newspaper icon            |    90.5, 9097.9 | 118.5 × 116.6 | 5.85°         | `#FF532F` | 255/255 |

### Marker

| Layer | Stack   | SVG file in archive  | Near                                                 |  Center (x, y) |  Size (w × h) | Rotate / flip | Colour    | Opacity       |
| ----- | ------- | -------------------- | ---------------------------------------------------- | -------------: | ------------: | ------------- | --------- | ------------- |
| 25.1  | Between | `marker/svg/m14.svg` | Story intro paragraph, first line, left highlight    |  951.4, 2658.4 |  294.8 × 66.8 | 0°            | `#FF532F` | 207/255 group |
| 25.2  | Between | `marker/svg/m09.svg` | Story intro paragraph, second line, middle highlight | 1077.2, 2757.4 |  286.5 × 42.7 | 0°            | `#FF532F` | 207/255 group |
| 25.3  | Between | `marker/svg/m24.svg` | Story intro paragraph, second line, right highlight  | 1466.0, 2754.0 |  434.0 × 60.0 | 0°            | `#FF532F` | 207/255 group |
| 25.4  | Between | `marker/svg/m11.svg` | Story intro paragraph, third line, left highlight    |  969.2, 2804.2 |  252.3 × 45.5 | 0°            | `#FF532F` | 207/255 group |
| 25.5  | Between | `marker/svg/m10.svg` | Story intro paragraph, first line, right highlight   | 1528.2, 2609.0 |  458.5 × 60.0 | 0°            | `#FF532F` | 207/255 group |
| 25.6  | Between | `marker/svg/m29.svg` | Services, Creative Strategy highlight                |  887.8, 6909.5 | 487.5 × 176.0 | 0°            | `#FF532F` | 207/255 group |
| 25.7  | Between | `marker/svg/m09.svg` | Services, Brand & Design highlight                   | 1407.0, 7021.8 |  328.0 × 75.5 | 0°            | `#FF532F` | 207/255 group |
| 25.8  | Between | `marker/svg/m03.svg` | Services, Social Media Strategy highlight            | 1472.5, 7103.0 |  438.0 × 75.0 | 0°            | `#FF532F` | 207/255 group |
| 26    | Between | `marker/svg/m03.svg` | Testimonial quote, blue left highlight               |  342.5, 7566.9 |  685.0 × 84.8 | 0°            | `#0D2481` | 255/255       |
| 28    | Between | `marker/svg/m02.svg` | Testimonial quote, blue central highlight            | 1019.0, 7512.5 |  430.0 × 93.0 | 0°            | `#0D2481` | 255/255       |

### Pointers

| Layer | Stack   | SVG file in archive                                | Near                                                |  Center (x, y) |  Size (w × h) | Rotate / flip | Colour    | Opacity |
| ----- | ------- | -------------------------------------------------- | --------------------------------------------------- | -------------: | ------------: | ------------- | --------- | ------- |
| 10    | Between | `pointers/svg/toml-arrow-a16-five-rays.svg`        | Services, rays below the left side of the list      |  348.0, 7278.5 | 382.0 × 189.0 | 0°            | `#FF532F` | 255/255 |
| 14    | Between | `pointers/svg/toml-arrow-a10-hooked-pointer-e.svg` | Services, hooked pointer at the right column        | 1416.2, 6772.9 | 104.5 × 130.6 | 8.45°         | `#FF532F` | 255/255 |
| 20    | Between | `pointers/svg/toml-arrow-a13-fine-elbow-e.svg`     | Contact call to action, arrow toward the envelope   | 1501.0, 8248.2 | 406.0 × 123.5 | 0°            | `#FF532F` | 255/255 |
| 23    | Between | `pointers/svg/toml-arrow-a03-long-ink-e.svg`       | Selected Work, pointer beside View all work         | 1821.2, 3025.4 |  166.5 × 61.7 | 0°            | `#FF532F` | 255/255 |
| 31    | Between | `pointers/svg/toml-arrow-a04-airy-arc-n.svg`       | Story intro, curved arrow pointing toward the brain | 1343.7, 2632.9 | 101.3 × 232.3 | 37.55°        | `#FF532F` | 255/255 |
| 32    | Between | `pointers/svg/toml-arrow-a13-fine-elbow-e.svg`     | Story intro, elbow arrow leading toward the globe   |  987.0, 2869.7 | 188.0 × 123.5 | 0°            | `#FF532F` | 255/255 |

### Scribbles

| Layer | Stack   | SVG file in archive                                    | Near                                                             |  Center (x, y) |    Size (w × h) | Rotate / flip | Colour    | Opacity |
| ----- | ------- | ------------------------------------------------------ | ---------------------------------------------------------------- | -------------: | --------------: | ------------- | --------- | ------- |
| 3     | Between | `scribbles/svg/toml-scribble-s13-pen-burst.svg`        | Footer, large burst behind the left of the final heading         | 272.1, 10869.2 |   472.0 × 485.3 | 2.93°         | `#FAFAFA` | 255/255 |
| 21    | Between | `scribbles/svg/toml-scribble-s14-four-point-spark.svg` | Contact call to action, large four-point spark at left           |  267.0, 7984.0 |   211.0 × 265.0 | 0°            | `#FF532F` | 255/255 |
| 35    | Between | `scribbles/svg/toml-scribble-s07-double-cross.svg`     | Behind the Journal and House of TOML cards, large diagonal cross |  623.7, 8899.0 | 1312.2 × 1307.1 | 0°            | `#FF532F` | 255/255 |
| 36    | Between | `scribbles/svg/toml-scribble-s02-loop-chain.svg`       | Right edge of the House of TOML card, hanging loops              | 1793.8, 8901.6 |   529.1 × 149.4 | 100.04°       | `#FF532F` | 255/255 |
| 37    | Between | `scribbles/svg/toml-scribble-s11-linked-loops.svg`     | Selected Work, loops between the first and second projects       |  350.4, 3902.0 |   387.2 × 637.5 | 102.13°       | `#FF532F` | 255/255 |

### Text-backings

| Layer | Stack   | SVG file in archive                                          | Near                                                            |   Center (x, y) |  Size (w × h) | Rotate / flip | Colour    | Opacity |
| ----- | ------- | ------------------------------------------------------------ | --------------------------------------------------------------- | --------------: | ------------: | ------------- | --------- | ------- |
| 1     | Between | `text-backings/svg/toml-backing-z05-medium-uneven-teeth.svg` | Footer, white zigzag beside the city clocks                     | 1609.9, 10192.3 | 343.0 × 102.3 | 121.71°       | `#FAFAFA` | 255/255 |
| 5     | Between | `text-backings/svg/toml-backing-r03-dry-textured-zigzag.svg` | Blue texture inside the large spark left of the contact heading |   258.8, 7983.5 |   69.5 × 82.0 | 0°            | `#0D2481` | 255/255 |
| 6     | Between | `text-backings/svg/toml-backing-z09-long-fine-zigzag.svg`    | Selected Work, gap between the ETH Zürich and UBS projects      |  1470.3, 4742.2 |  810.5 × 74.4 | 0°            | `#FF532F` | 255/255 |
| 41    | On top  | `text-backings/svg/toml-backing-z02-short-pen-passes.svg`    | House of TOML card caption, short backing stroke                |  1096.5, 9153.8 |  123.0 × 23.5 | 0°            | `#FF532F` | 255/255 |

### Underlines

| Layer | Stack   | SVG file in archive                                      | Near                                                                          |  Center (x, y) |  Size (w × h) | Rotate / flip | Colour    | Opacity |
| ----- | ------- | -------------------------------------------------------- | ----------------------------------------------------------------------------- | -------------: | ------------: | ------------- | --------- | ------- |
| 8     | Between | `underlines/svg/toml-underline-u25-connected-double.svg` | Contact call to action, short underline beneath Start                         | 1045.5, 8115.0 |  177.0 × 18.0 | 0°            | `#FF532F` | 255/255 |
| 11    | Between | `underlines/svg/toml-underline-u04-pen-retrace.svg`      | Testimonial, short blue underline at the lower left of the quote              |  148.0, 7699.0 |  224.0 × 18.0 | 0°            | `#0D2481` | 255/255 |
| 12    | Between | `underlines/svg/toml-underline-u28-triple-ink.svg`       | Services, underline beneath Brand & Design                                    | 1374.5, 6828.9 |  199.0 × 15.2 | 1.60°         | `#FF532F` | 255/255 |
| 19    | Between | `underlines/svg/toml-underline-u14-long-and-short.svg`   | Contact call to action, long underline beneath conversation                   | 1163.2, 8199.2 |  440.5 × 47.5 | 0°            | `#FF532F` | 255/255 |
| 22    | Between | `underlines/svg/toml-underline-u25-connected-double.svg` | Story headline, double underline beneath YOUR                                 | 1526.8, 2154.0 |  784.5 × 83.0 | -0.98°        | `#FF532F` | 255/255 |
| 38    | Between | `underlines/svg/toml-underline-u32-triple-marker.svg`    | Selected Work, diagonal marker stroke between the UBS and VVITAVERSE projects |  584.8, 5577.5 | 1099.5 × 82.0 | 10.14°        | `#FF532F` | 255/255 |
| 39    | Between | `underlines/svg/toml-underline-u17-fine-level.svg`       | Testimonial quote, long fine blue underline                                   |  777.0, 7640.8 |  782.0 × 31.5 | 0°            | `#0D2481` | 255/255 |

## Hidden in the PSD

The following smart object is present but its Photoshop visibility flag is off. It is excluded from the used-mark count and should not be placed in the visible composition.

| Layer | Stack           | SVG file in archive                            | Near                                                   |  Center (x, y) |  Size (w × h) | Rotate / flip | Colour    |
| ----- | --------------- | ---------------------------------------------- | ------------------------------------------------------ | -------------: | ------------: | ------------- | --------- |
| 13    | Between; hidden | `pointers/svg/toml-arrow-a13-fine-elbow-s.svg` | Services, hidden alternate arrow near the right column | 1121.5, 7074.0 | 203.0 × 286.0 | 0°; flip X    | `#FF532F` |

## Inventory check

- **48 visible placements**, using 42 distinct SVG files; one additional smart object is hidden.
- Visible placements by type: 3 circles, 13 icons, 10 marker strokes, 6 pointers, 5 scribbles, 4 text-backings, and 7 underlines.
- Colour values present: orange `#FF532F`, blue `#0D2481`, and off-white `#FAFAFA`.
