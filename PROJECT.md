# TOML Collective website

| Field | Current value |
| --- | --- |
| Project kind | client |
| Phase | design-implementation |
| Purpose | Full-site V4 visual implementation for local review |
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
