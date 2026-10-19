# Migrating a site made from the Pages starter

This revision uses Workers Static Assets. Existing generated client repositories remain independent; updating the template does not move their hosting or DNS.

1. Create a client branch and preserve its design, schemas, content queries and service decisions. Adopt the dependency/runtime updates and the phase-aware project record selectively.
2. Replace Pages `functions/api/contact.ts` and its mail helper with `worker/`, `wrangler.jsonc`, `tsconfig.worker.json` and generated binding declarations. Carry over any client-specific form behavior. Remove the old Functions deployment path after the new route is verified.
3. Use distinct client Worker names. Build static Astro into `dist` and route `/api/*` through the Worker. Reuse/adapt the shared layout/contact components without replacing the client's visual design. Review/live now require explicit mode, CMS IDs and HTTPS origin.
4. Deploy the review Worker on its generated hostname with sending disabled. Configure its build variables and secrets separately from Pages; existing Pages settings do not transfer automatically.
5. Create a Workers Builds deploy hook and point a review Sanity webhook at it. Verify a published edit reaches the review page. Keep the existing live site publishing path until the cutover is ready.
6. Verify hosted Turnstile, inbox delivery and Reply-To with final settings. Configure/test a Workers build-failure notification path; Pages alerts do not cover Workers.
7. At the authorized cutover, configure the live Worker, live mode, canonical origin and production CMS hook, then switch the custom domain. Inspect current DNS/MX first and verify HTTPS, content, indexing and contact delivery afterward. Keep a documented rollback path during the transition.
8. Disable obsolete Pages deploy hooks, webhook targets and mail credentials after acceptance. Record the new operations details and mark completed setup so coding sessions resume client design/maintenance rather than provisioning again.

Follow [quickstart](quickstart.md) for Workers build commands, secret boundaries and webhook details. Analytics selection remains separate and is deferred.
