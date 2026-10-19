# TOML Collective website

| Field | Current value |
| --- | --- |
| Project kind | client |
| Phase | design-implementation |
| Purpose | Groundwork for the TOML Collective website; template demonstration until design implementation |
| Repository | https://github.com/M3G4W4TT5/toml-collective-website (public), branch `main` |
| Template | https://github.com/M3G4W4TT5/astro-sanity-cloudflare-starter |
| Client brief | `docs/design-brief.md` — awaiting the website brief |
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

- Infrastructure setup is complete. The requested page structure is prepared locally. Await the design brief, approved assets and content before visual implementation; continue from `docs/design-brief.md`.
- Both Workers currently track `main`. Choose a separate trusted design branch later if primary and preview need independent releases.
- Open the new Studio to confirm the owner's editing workflow. Do not repeat completed provisioning.
- Final domain, mail delivery, policy wording, indexing, analytics and failure-notification ownership remain launch/handoff decisions. No failure notifier has been configured.
