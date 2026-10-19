# Astro + Sanity + Cloudflare Workers starter

A design-neutral template for small client websites: static Astro, React when needed, Sanity content fetched at build time, and Cloudflare Workers Static Assets with a protected contact endpoint.

The demonstration page is disposable. Each generated repository gets its own design, content model, accounts and launch decisions.

## Try it locally

Use Node 24 and npm 11. No accounts are needed for the demo.

```bash
npm ci
npm run dev
```

Open [localhost:4321](http://localhost:4321). Check the complete starter with:

```bash
npm run check
npm test
npm run build
npm run studio:build
npm run worker:check
```

For the full static site and local API, copy `.dev.vars.example` to `.dev.vars` and run `npm run dev:worker` on port 8787. Local mail is always simulated. Astro dev and preview serve the frontend only.

## Start a client site

1. Generate an independent repository using this template. Set the project kind and phase in [PROJECT.md](PROJECT.md).
2. Follow the [quickstart](docs/quickstart.md) to connect client-owned Sanity and Workers review services.
3. Record the successful CMS-to-review deployment and move to `design-implementation`. Fill [the design brief](docs/design-brief.md) and replace the demonstration page and styling.
4. Complete the [launch checklist](docs/new-site-checklist.md), including real inbox delivery, policy review and the domain switch.
5. Complete the [operations handoff](docs/operations-handoff.md).

`AGENTS.md` uses the recorded project phase so later coding sessions continue design work without repeating account setup. Missing mail, legal or domain decisions do not block independent design implementation.

## Reusable pieces

- `src/layouts/BaseLayout.astro`: language, canonical URL, description, Open Graph and indexing.
- `src/components/ContactForm.astro`: form markup and submission behavior, independent of the demonstration page.
- `worker/`: bounded validation, Turnstile verification and replaceable Resend/Cloudflare mail adapters.
- `wrangler.jsonc`: static assets, API routing, generated binding types and an isolated review environment.
- GitHub Actions and grouped Dependabot updates: maintain the template before reusing it.

`PUBLIC_SITE_MODE=demo|review|live` controls validated configuration and indexing. Only live mode permits indexing; branch previews stay unindexed. Analytics is undecided and no tracking provider is installed.

See [configuration](docs/quickstart.md), [starter decisions](docs/decisions.md), [maintenance](docs/maintenance.md) and the working [policy templates](docs/templates/README.md). Existing Pages users should read the [migration notes](docs/migrate-from-pages.md).
