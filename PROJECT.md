# Project state

Update this file when setup completes, the project phase changes, or an infrastructure decision changes. Keep it concise and safe for a public repository. Store credentials and private ownership/recovery records elsewhere.

| Field | Current value |
| --- | --- |
| Project kind | template |
| Phase | template-maintenance |
| Purpose | Design-neutral Astro/React + Sanity + Cloudflare Workers starter |
| Client brief | Not applicable to the public template; use `docs/design-brief.md` in generated sites |
| Runtime | Node 24, npm 11; static Astro plus a contact Worker |
| Sanity | Not provisioned; project/dataset are per-client |
| Cloudflare | Not provisioned; replace `website-starter` and `website-starter-review` in `wrangler.jsonc` |
| Review origin / Studio URL | Not configured |
| Live origin | Not configured |
| Build mode | Account-free `demo`; review/live require CMS identifiers and an HTTPS origin |
| Mail | Resend adapter available; sending disabled until client delivery is verified |
| Analytics | Undecided; no provider or tracking installed |

## When generating a client repository

1. Set kind to `client`, phase to `setup`, and replace template facts with client-specific facts. Record the chosen repository/branch, non-secret Sanity IDs, Worker names, URLs and brief link.
2. Track setup evidence: local checks/builds, deployed Studio, editor access, published CMS edit, corresponding review deployment and observed page. Record dates and links without secret deploy-hook URLs.
3. Move phase to `design-implementation` once setup is verified. Record the next design task and unresolved external blockers. Do not rerun completed setup.
4. Later move to `launch`, then `handoff`, with references to the completed checklists and the private operations record.

## Completed setup / evidence

- Public template only. No client services have been created.

## Next task / blockers

- In a generated site: fill the client brief and configure the client's services.
- Domain, mail, legal approval and analytics selection are later client decisions.
