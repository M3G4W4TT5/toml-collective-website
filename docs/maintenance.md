# Maintaining the starter

Use Node 24 and npm 11. The runtime major is pinned in `.node-version` and `.mise.toml`, with matching Node 24 types and package engine constraints.

Dependabot groups compatible npm updates weekly and checks GitHub Actions monthly. Review major framework changes separately. TypeScript stays on 5.9 while the current Astro checker supports TypeScript 5/6 rather than 7; update the compiler and checker together after compatibility is verified.

Before merging infrastructure updates:

```bash
npm ci
npm run check
npm test
npm run build
npm run studio:build
npm run worker:check
npm run worker:check -- --env review
npm audit
```

`worker:check` verifies generated binding declarations and bundles the Worker in a deployment dry run; it does not publish. `worker:types` uses `.dev.vars.example` so generated declarations contain names/types from the public example, not local credential values. Keep that example aligned with runtime settings and regenerate after configuration changes.

Review audit advisories in their actual build, Studio, development-server or deployed-runtime context. Prefer upstream updates and compatible lockfile refreshes to overrides. If an override is unavoidable, document the advisory, compatible fixed version and removal condition here; do not force unrelated major versions just to lower an audit count.

## Dependency review, 19 October 2026

Direct dependencies were refreshed within their supported majors. The obsolete `adm-zip` override was removed. Two scoped overrides remain because current `@vercel/frameworks`, pulled in by Sanity's CLI, still pins older parsers:

| Scoped override | Reason | Removal condition |
| --- | --- | --- |
| `@vercel/frameworks` → `js-yaml@3.15.2` | Same-major patched release covering merge-key/prototype-pollution advisories, including [GHSA-2883-xcg3-v3hh](https://github.com/advisories/GHSA-2883-xcg3-v3hh). | Upstream resolves a fixed compatible YAML version without the override. |
| `@vercel/frameworks` → `smol-toml@1.9.1` | Replace the old vulnerable 1.7.1 override with a same-major release fixing [GHSA-r4xh-jqrq-34v2](https://github.com/advisories/GHSA-r4xh-jqrq-34v2). | Upstream resolves a fixed compatible TOML version without the override. |

Re-run the audit when accepting updates; the lockfile is the reproducible installation baseline. Do not accept an audit suggestion to downgrade Sanity simply to remove reports from its toolchain.

The verified installation reports 16 affected package entries (7 high, 9 moderate), down from 46. These entries trace to three remaining upstream advisories in Sanity's CLI dependency tree:

- `@sanity/codegen` → glob/watcher tooling → `braces@3.0.3`: [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm). The registry's current latest braces release is still affected.
- `@vercel/frameworks` → patched `js-yaml` → `argparse` → `sprintf-js@1.0.3`: [GHSA-hp3w-g68c-fv3c](https://github.com/advisories/GHSA-hp3w-g68c-fv3c). The registry's current latest sprintf-js release is also affected.
- `typeid-js@1.2.0` → `uuid@10.0.0`: [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq). The parent still requires uuid 10; forcing another major is deferred pending an upstream update or separate compatibility review.

These packages are not imported by the contact Worker or shipped as its dependencies. The advisory count includes propagated parent reports and is not a count of validated website vulnerabilities. Recheck upstream fixes when Dependabot updates the toolchain.

## Client repositories

A generated repository is independent. Record the starter revision when creating it and apply relevant maintenance updates through a reviewed client pull request. Verify the client's content model, configured deployment modes and contact flow before adopting changes. Do not rerun provisioning or overwrite its design brief.
