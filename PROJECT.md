# TOML Collective website

## Journal and House cards — 22 October 2026

- The user authorized adding TOML Journal and House of TOML between the contact invitation and Instagram on `/landing-page-draft/`, followed by a GitHub push and deployment to the existing Worker site.
- Two prominent cards sit side by side from 768px and stack below that width. The draft's white inset captions, black typography and 700ms media zoom are retained; the new zoom is 1.05 versus Selected Work's 1.1.
- Descriptions use the supplied second screenshot verbatim. Journal links to the existing external Journal destination; House links to the existing House page. The screenshots supply copy only.
- The supplied Journal video and all eight House photographs are local assets. The separate `hot_logo.svg` is excluded. Media pauses offscreen/when the tab is hidden, has no visible playback controls, and defaults to stills with reduced motion. Sources and verification are in `docs/landing-page-draft.md`.

## Current local increment — landing page draft, 21 October 2026

- **Publication authorized:** the latest request lifts the previous hold and explicitly authorizes committing/pushing the accumulated landing draft, then deploying it to the existing TOML Collective Workers site. This release includes the requested testimonial, footer/header scrolling and logo-control corrections; the original homepage remains in place.
- Implemented `/landing-page-draft` through Selected Work and the subsequently requested full-screen footer from the user's Wonder Vision homepage reference. The original homepage remains in place. See `docs/landing-page-draft.md` for the code review, asset inventory and implementation map, and `design-qa.md` for local verification.
- Later instructions shorten the wordmark to `TOML.` and the hero to “A creative agency powered by a global collective of storytellers”, with at most three lines at every tested viewport.
- Final refinements use `TELL / YOUR / STORY`, orange squares for the slogan and Selected Work, revised intro prose, and the exact source mobile menu icon. The source story sequence runs once per load; content fades from white on entry and on reload at a restored scroll position. The dedicated browser checks verify these behaviors.
- Header refinement copies the reference's responsive navigation type, gaps, padding, baseline and 768px breakpoint within its measured 82px height. The logo swaps only after the header is fully hidden, including a rapid scroll reversal; the milk carton is now a transparent black SVG with its TJ lettering removed.
- Mobile Menu now opens the reference's full-screen black panel, sliding in from the right and closing back right over 700ms. It retains TOML's four links and adds a bottom Latest case carousel using published CMS articles, with existing seeded cases as fallback.
- The final arrow correction scrolls immediately past the showreel at every screen size. The user subsequently authorized pushing this draft increment to GitHub and deploying through the existing Workers pipelines; see the authorization below.
- The footer stays pinned beneath the scrolling page and fills the viewport. It includes supplied London, Prishtina and Calgary contact blocks, desktop live clocks, a white milk mark, original TOML social destinations, an orange-square `TELL YOUR STORY` marquee and the reference's legal layout. The latest mobile instruction retains every address/phone/email and removes only the clocks. Short layouts adapt columns and use native page scrolling; the footer pins beneath the content without creating its own scroll area. The header stays hidden and inert wherever it would overlap the footer.
- Added the subsequent newsletter component above the footer socials: supplied animated TOML Journal image, `SUBSCRIBE TO OUR NEWSLETTER` caption and direct `/subscribe` destination on tomljournal.com. Desktop follows the annotated right-hand placement; phone/short-landscape layouts retain all content in flow. Reduced motion uses a still frame of the supplied GIF.
- Added the reference Instagram section as the final scrolling section before the footer. It uses a verified 21 October snapshot of the latest 11 dated public posts (excluding the older pinned post), with 11 desktop / 5 phone tiles and the reference's intermediate tablet counts. Popup includes full captions, all 50 images/posters and 16 videos, original author attribution, per-post and per-carousel navigation, touch gestures, sharing, keyboard handling and reduced motion. No Instagram connection, token or runtime feed request is needed; this snapshot does not update automatically.
- Added the reference's contact invitation immediately above Instagram, with “What have you got in mind?” and the gray “Start a conversation.” link to the existing `/contact/` page. Desktop uses the right half of the container; phone uses the full column. Source typography, bottom spacing and scroll fade are retained.
- Added the reference's Our Services layout between Selected Work and the contact invitation: Content Production / CGI & VFX, Creative Strategy / Animation & Motion, Post-production / Brand & Design, Live-action Production / Social Media Strategy, in two columns and four rows on every screen size (updated and confirmed on 22 October 2026). “How we work” sits below the rows, aligned right, and opens the existing `/work/` page. Source responsive type, black square/dividers, third/two-thirds desktop layout, mobile label placement and scroll fade are retained.
- The latest marker correction makes the Services, Instagram and menu Project squares orange, matching Selected Work, the story heading and footer; general section markers now consistently use `--accent`.
- Added all 15 supplied client/partner logos between Selected Work and Services, in dark gray on white. The duplicated 150-second linear strip moves left gently, pauses only offscreen or while the document is hidden; there are no Pause/Resume controls or hover/focus stops. Reduced motion and no-JavaScript expose a static complete list.
- Added six supplied client testimonials between Services and the contact invitation, without portraits. White FK Grotesk text sits on solid TOML orange with one quote line of vertical padding above/below. The name is separate from the role/company; desktop uses the supplied quote/attribution split. The panel and quote/name/title/indicator positions reserve the longest responsive content. Swipe and keyboard navigation wrap through all six, with no arrow buttons; automatic rotation provides 12–17 seconds per quote and resets after manual navigation.

| Field | Current value |
| --- | --- |
| Project kind | client |
| Phase | design-implementation |
| Purpose | Homepage draft at `/landing-page-draft`, alongside the existing V4 homepage |
| Repository | https://github.com/M3G4W4TT5/toml-collective-website (public), branch `main` |
| Template | https://github.com/M3G4W4TT5/astro-sanity-cloudflare-starter |
| Client brief | `docs/design-brief.md` — supplied deck, comments, attachments and conversation decisions |
| Runtime | Node 24, npm 11; static Astro and contact Worker |
| Sanity | TOML Collective, project `tt800xj0`, public dataset `production` |
| Cloudflare | TOML Collective account `119f3a7e5a0a92df0015f928b7e75d87` |
| Primary Worker / origin | `toml-collective-website` / https://toml-collective-website.toml-collective.workers.dev |
| Preview Worker / origin | `toml-collective-website-preview` / https://toml-collective-website-preview.toml-collective.workers.dev |
| Studio | https://toml-collective.sanity.studio/ — code-managed in `studio/`, application `rzo9a7bbq0hcxbuxuzz4xc93` |
| Build mode | Both sites use `review`; public without a password, with `noindex` |
| Git deployment | Both Workers track `main`; preview deploys with `--env review`; other branch builds disabled |
| Mail | Public form and runtime sending disabled in both environments |
| Analytics | Undecided; no tracking installed |

## Completed setup / evidence

- 2026-10-19: created the independent public GitHub repository from the selected template.
- Verified the named Sanity project/dataset and Cloudflare account; reserved the `toml-collective.workers.dev` namespace.
- GitHub authorization connected by the owner through the Cloudflare dashboard.

- Clean `npm ci`, Astro/TypeScript checks, all 11 tests, CMS-backed site build, Studio build, generated Worker types and primary/review dry runs passed. GitHub CI passed for code commit `6400734`.
- Deployed the repository-managed Studio and schema under the verified TOML identity. Existing unrelated demo documents and the older demo Studio were preserved. Use the new linked Studio for this repository.
- Both Workers successfully deployed the CMS-backed demonstration from `main`. Each has its own build variables and canonical origin; contact sending is disabled in both environments.
- Separate Sanity webhooks trigger the primary and preview Workers when published `homePage` / `home` changes. Drafts and versions are excluded. Secret hook URLs exist only in provider configuration.
- Published a draft edit through the TOML Sanity connector. Both webhook attempts returned HTTP 200 and both resulting Cloudflare builds succeeded: primary `ec246b4e-9c24-408c-be99-a9b1b650fa68`, preview `82946621-f6d0-44e1-b8ab-182cb203e24e`.
- Verified the changed text over HTTPS on both public pages: “CMS publishing verified on 19 October 2026.” Both returned HTTP 200, the correct title/canonical and `noindex`. API method rejection returned 405, disabled contact submission returned 503, and unknown page/API paths returned 404. No mail was sent.
- Hosted page verification used HTTP response content. A browser/editor UI session was not available for visual or Studio login acceptance.

## Page structure increment — 2026-10-19

- Added the requested fixed routes, about subpages, case/member indexes and Sanity-driven case/member templates. See `docs/site-structure.md` for the route map and CMS fields.
- Replaced the styled starter demonstration with a shared plain semantic layout. Policy pages contain placeholders only; no examples, legal copy or contact details were invented.
- Local checks, all 14 tests, CMS-backed build, Studio build, fixed-page link checks and isolated dynamic-route fixture builds passed.
- Publication approved. The updated Studio/schema are deployed and both existing publishing hooks now cover Home, cases and members, with drafts/versions excluded. Website changes publish through the existing `main` pipelines for both Workers.

## Next task / blockers

- The approved styling/component cleanup and responsive foundation are implemented and locally verified against the V4 design baseline. See `docs/styling.md` and `docs/refactor-qa.md`. Publication through the existing `main` pipelines was approved on 21 October; CMS migration remains separate.
- Both Workers currently track `main`. Choose a separate trusted design branch later if primary and preview need independent releases.
- Open the new Studio to confirm the owner's editing workflow. Do not repeat completed provisioning.
- Final domain, mail delivery, policy wording, indexing, analytics and failure-notification ownership remain launch/handoff decisions. No failure notifier has been configured.

## V4 full-site implementation — 19 October 2026

- The user expanded scope to the entire site, then confirmed legacy-site content reuse, external Journal navigation, Nertil Muhaxhiri’s name and Members placement, the provisional House page, and supplied showreel. Spotify URLs remain pending.
- Implemented the shared V4 design, source-backed case and member pages, About subpages, contact flow, playlist states, showreel playback, responsive navigation, functional filters and accessible profile drawers.
- Added local CMS schema extensions and build-time overrides for Home, cases and members. No CMS data/Studio publication, Git push or website deployment was performed. Seed content remains code-backed pending visual acceptance and reviewed migration.
- Reused original slide artwork, legacy galleries and supplied campaign exports; optimized consumed images and the showreel locally. Source references and outstanding content inputs are recorded in `docs/design-brief.md`.
- Local validation and visual evidence are recorded in `design-qa.md`; current hosted Workers still represent the previously published revision until a separately authorized release.

## Main-branch publication authorization — 19 October 2026

- After the local implementation handoff, the user explicitly requested “push to main!”. This authorizes committing this V4 implementation and pushing to the verified repository’s `main`, which starts the existing website pipelines.
- Local source checks, 16 tests, site/Studio builds, Worker dry run and browser QA passed before this push. Local browser evidence remains ignored by Git; the QA report and source inventory are included.
- This code push does not migrate the Sanity dataset, deploy Studio separately, enable contact sending, change indexing mode or switch DNS. Hosted build status must be verified separately from Git acceptance.

## Local frontend refactor — 21 October 2026

- Implemented the approved theme controls, CSS/component organization, responsive ranges and image sources. Preserved the current desktop and phone baseline; tablet compositions use the new responsive foundation.
- Formatting/type checks, 18 tests, site/Studio builds, Worker dry run, 140 browser viewport checks and 8 interaction checks passed. Evidence and limitations are in `docs/refactor-qa.md`.
- This increment was initially held locally. The subsequent publication authorization below supersedes that hold; CMS migration remains separate.

## Frontend publication authorization — 21 October 2026

- After the local verification handoff, the user requested “Please push and deploy.” This authorizes committing the approved refactor and pushing to the verified repository's `main`, triggering the existing primary and preview website pipelines.
- The release retains review indexing protection and disabled enquiry delivery. It does not migrate CMS content, deploy Studio/schema changes, change DNS or enable analytics.
- GitHub's Cloudflare Workers Builds checks expose the build and version IDs for each exact source commit. Verify those checks and the hosted output separately from Git push acceptance; retain release evidence under ignored `artifacts/refactor-qa/` and in the task handoff.

## Landing draft publication authorization — 21 October 2026

- After the final responsive scroll-arrow correction, the user explicitly authorized pushing these changes to GitHub and deploying to the Cloudflare Workers site.
- This release includes the reference-based `/landing-page-draft`, all subsequent copy/header/menu/reel refinements, source assets and validation. The existing homepage remains at `/`. The subsequent footer request extends this draft using the same publishing workflow; it does not replace the original homepage.
- Push the verified repository's `main` to use the existing primary and preview Workers Builds pipelines. Confirm the build/version IDs for that exact commit and verify the published draft and responsive arrow behavior separately. Retain release evidence under ignored `artifacts/landing-page-release/`.
- CMS migration, Studio publication, contact delivery, indexing mode and DNS are outside this release.
