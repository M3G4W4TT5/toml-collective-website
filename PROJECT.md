# TOML Collective website

| Field | Current value |
| --- | --- |
| Project kind | client |
| Phase | setup |
| Purpose | Groundwork for the TOML Collective website; template demonstration until design implementation |
| Repository | https://github.com/M3G4W4TT5/toml-collective-website (public), branch `main` |
| Template | https://github.com/M3G4W4TT5/astro-sanity-cloudflare-starter |
| Client brief | `docs/design-brief.md` — awaiting the website brief |
| Runtime | Node 24, npm 11; static Astro and contact Worker |
| Sanity | TOML Collective, project `tt800xj0`, public dataset `production` |
| Cloudflare | TOML Collective account `119f3a7e5a0a92df0015f928b7e75d87` |
| Primary Worker / origin | `toml-collective-website` / https://toml-collective-website.toml-collective.workers.dev |
| Preview Worker / origin | `toml-collective-website-preview` / https://toml-collective-website-preview.toml-collective.workers.dev |
| Studio | Template code in `studio/`; deployment pending |
| Build mode | Both initial sites use `review` once CMS is connected; public without a password, with `noindex` |
| Git deployment | Both Workers track `main`; preview deploys with `--env review`; other branch builds disabled |
| Mail | Public form and runtime sending disabled in both environments |
| Analytics | Undecided; no tracking installed |

## Completed setup / evidence

- 2026-10-19: created the independent public GitHub repository from the selected template.
- Verified the named Sanity project/dataset and Cloudflare account; reserved the `toml-collective.workers.dev` namespace.
- GitHub authorization connected by the owner through the Cloudflare dashboard.

## Next task / blockers

- Validate local checks and both hosted deployments; verify a published CMS edit reaches preview before moving to `design-implementation`.
- Deploy the code-managed Studio under the TOML Sanity identity. Existing demo documents need not be deleted for this setup.
- Design, final domain, mail, policy wording, indexing and analytics remain later decisions.
