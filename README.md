# TOML Collective website

Groundwork for the TOML Collective website, generated from [astro-sanity-cloudflare-starter](https://github.com/M3G4W4TT5/astro-sanity-cloudflare-starter). Static Astro, optional React, Sanity content at build time, and Cloudflare Workers Static Assets.

The template demonstration is temporary. Design and final editorial content are a separate phase.

## Environments

| Environment | URL | Git branch | Deploy command |
| --- | --- | --- | --- |
| Primary | https://toml-collective-website.toml-collective.workers.dev | `main` | `npx wrangler deploy` |
| Preview | https://toml-collective-website-preview.toml-collective.workers.dev | `main` | `npx wrangler deploy --env review` |

Both are in the TOML Collective Cloudflare account, public without a password, and initially use `PUBLIC_SITE_MODE=review` (`noindex`). Builds on other branches are disabled. Each Worker has its own build variables and runtime configuration. Contact sending remains disabled.

Sanity project: `tt800xj0`; public dataset: `production`. The [code-managed Studio](https://toml-collective.sanity.studio/) is in `studio/`. Publishing its Home page triggers a rebuild of both Workers. Read [PROJECT.md](PROJECT.md) for verified setup state, evidence and outstanding work.

## Local development

Use Node 24 and npm 11:

```bash
npm ci
cp .env.example .env
npm run dev
```

The environment example points at the TOML preview configuration and published CMS content. Without `.env`, the account-free demonstration still runs. Start the Studio with `npm run studio:dev`. For the full local site and simulated contact API, copy `.dev.vars.example` to `.dev.vars` and run `npm run dev:worker`.

Validate infrastructure changes with:

```bash
npm run check
npm test
npm run build
npm run studio:build
npm run worker:check
npx wrangler deploy --env review --dry-run
```

Cloudflare Workers Builds runs `npm run build` before each deployment. Published Sanity content is fetched afresh during the build; it does not update already deployed static HTML until a rebuild succeeds.

## Next steps

Use [the design brief](docs/design-brief.md) for the website design and editorial model. Configuration details are in [the quickstart](docs/quickstart.md). Complete [the launch checklist](docs/new-site-checklist.md) and [operations handoff](docs/operations-handoff.md) before the final domain and indexing launch. Analytics remains undecided.
