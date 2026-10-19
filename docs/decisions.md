# Starter decisions

Updated 19 October 2026. These are template defaults, not client approvals.

| Decision | Reason and boundary |
| --- | --- |
| Independent client repositories | Reuse infrastructure without coupling client histories. Later template updates do not automatically reach client sites. |
| Static Astro + TypeScript; React available | Fast static output with hydration only for interactions that need it. No mandatory SSR or visual framework. |
| Disposable demonstration page | Each client gets a separate design and content model. Shared metadata and contact behavior live in reusable components. |
| Phase-aware `AGENTS.md` and `PROJECT.md` | Setup is recorded once; later sessions prioritize the actual design brief. Launch decisions do not block independent implementation. |
| `demo`, `review`, `live` build modes | Account-free demo; configured modes require CMS and a real HTTPS origin. Review and branch previews stay unindexed. |
| Sanity build-time published content | No CMS request per visitor and no site read token for public datasets. A configured missing/invalid `home` document fails the build. Keep the pinned API date until an API change is needed. |
| Native Sanity singleton for Home | One clear editor entry, no duplicate creation, and no ordinary unpublish/delete action for the document required by the build. UI guards do not restrict direct API access. |
| Workers Static Assets + a small API Worker | Follow Cloudflare's current platform direction while keeping static pages off Worker execution. No Astro server adapter needed. |
| Separate review Worker | Stable review hostname and separate runtime secrets. Keep untrusted branches away from live mail credentials. |
| Turnstile + replaceable mail adapters | Preserve bounded validation and a fixed authenticated sender. Resend is the default; Cloudflare verified-destination sending remains optional. |
| Sending disabled until hosted inbox proof | API acceptance is not proof of delivery. Localhost always simulates. Sending providers do not provision a business inbox. |
| Working legal templates | Client facts and deployed behavior determine the final policies. No generic policies are published by default. |
| Analytics deferred | No preferred provider, SDK, script or visitor tracking is installed. Revisit when the user selects a solution. |
| Small regression suite and CI | Verify deployment-mode boundaries, API routing and mail acceptance without real accounts. Hosted acceptance remains necessary. |
