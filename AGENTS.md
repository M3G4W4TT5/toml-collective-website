# Working on this starter and generated client sites

Read `PROJECT.md` at the start of a session, then the relevant brief and existing code. This is an infrastructure starter, not a visual template. Each client gets an independent repository, its own design and content model, and client-owned services.

## Current phase

- In this template repository, keep `PROJECT.md` at `template-maintenance`. Improve reusable infrastructure without inventing a client or imposing a design system.
- When generating a client repository, change the project kind to `client` and phase to `setup`. Follow `docs/quickstart.md` and record completed setup, public identifiers/URLs, owners and blockers in `PROJECT.md`. Never record secret values or private account/recovery details there.
- Setup is complete when local checks/builds pass and a published CMS edit reaches the review Worker. Update `PROJECT.md` to `design-implementation` and replace its template facts with the actual client setup. Do not repeat completed provisioning on later sessions. If external access is pending, record the blocker and continue independent design work in demo mode.
- During `design-implementation`, prioritize `docs/design-brief.md` and the user's supplied designs, references and decisions. Replace the demonstration page and styling; reuse the configured services, layout metadata and contact behavior. Adapt Sanity schemas to actual editorial needs. Do not treat the demo layout or four-field schema as requirements.
- Mail delivery, legal review, final DNS, indexing and handoff are launch milestones. They must not hold up independent design work. Follow `docs/new-site-checklist.md` and `docs/operations-handoff.md` at the appropriate phase.

## Implementation conventions

- Use static Astro and TypeScript by default. React is available for components; add client hydration only when an interaction needs it. Do not introduce SSR, a page builder, or another framework without a concrete project requirement.
- `src/layouts/BaseLayout.astro` owns shared metadata. `src/components/ContactForm.astro` owns the reusable form. `worker/` handles API requests; ordinary pages are Cloudflare Static Assets. Preserve bounded validation, Turnstile hostname checks, fixed mail sender and local simulation when changing the form.
- `PUBLIC_SITE_MODE=demo|review|live` controls configuration and indexing. Demo and review stay `noindex`; only the approved live deployment uses `live`. Never remove indexing protection as part of replacing a design. Non-production Workers Builds branches are automatically treated as review.
- Public Sanity datasets and uploaded assets are for publishable content. Keep private evidence, uncleared assets and contact messages outside public Git/Sanity. Keep all credentials and deploy-hook URLs in secret stores. Respect the existing mail provider and MX records.
- Analytics is undecided. Do not install a provider, SDK or tracking script unless the user selects one.
- Honor decisions and approvals already supplied in the session. Continue reversible implementation without repeatedly requesting confirmation. Obtain missing authorization for actual client publication, a live domain/DNS switch or other launch-sensitive action.

## Commands and verification

Node 24 and npm 11 are required. Use `npm ci`, `npm run dev`, `npm run studio:dev` and `npm run dev:worker` as documented. Astro dev does not run the API; Worker dev builds static assets first and simulates local mail only.

For infrastructure changes run `npm run check`, `npm test`, `npm run build`, `npm run studio:build` and `npm run worker:check`. Also dry-run the review environment when changing Wrangler config. Run `npm run worker:types` after changing bindings or example variable names; generated types are committed. Use targeted checks for ordinary design edits. Hosted CMS publishing, Turnstile and real inbox delivery still need client-environment acceptance checks.

Keep docs and environment examples aligned with code. Review tracked files before a public push, commit narrowly and preserve unrelated work. Dependency upgrades belong in the template; generated client repositories do not receive them automatically.
