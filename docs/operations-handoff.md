# Operations and handoff checklist

Record detailed answers in a restricted client handoff document. Put only non-sensitive completion status and public URLs in `PROJECT.md`.

- [ ] Name owners and backup administrators for GitHub, Sanity, Cloudflare Workers, domain/DNS, mail inbox, sending provider and Turnstile. Record who monitors failures and handles incidents.
- [ ] Record repository URL, starter revision, production/review branches, both Worker names/URLs, Studio URL, dataset and registrar. Record actual Sanity roles, including Free's broad admin access for editing users.
- [ ] Record Node 24/npm 11, `npm run build`, Wrangler deploy commands, `dist` assets, runtime switches and generated-type commands. Keep build-time values separate from runtime secrets. Store secret locations and rotation owners, never values.
- [ ] Record deployment modes, production branch and canonical origins. Verify review and branch preview noindex, and approved live indexing. Record any review access restrictions separately.
- [ ] Record each Sanity webhook's location, dataset/filter/triggers and associated review/live deploy hook. Keep hook URLs secret. Explain manual rebuild and how to inspect Sanity Attempts and Worker build logs.
- [ ] Prove an identifiable CMS edit reached the live page: Sanity revision/time, matching successful Worker deployment and observed URL/text. A hook 2xx alone is insufficient.
- [ ] Record and test the build-failure notification path and monitored inbox, including a failed CMS-triggered build. The Pages project-update alert is not a Workers alert. Record how to notice a webhook that never starts a build.
- [ ] Explain that failed builds can leave an older version live. Document rebuild, rollback and CMS restoration; code rollback alone does not restore CMS content.
- [ ] Record contact recipient, fixed verified sender, provider, separate review/live secret locations and Turnstile allowed hostnames. Prove hosted inbox delivery and Reply-To on the live domain. API success means acceptance, not guaranteed delivery.
- [ ] Record custom domain/DNS and confirm existing MX records and mail flow after changes. List renewals, current free-tier limits, spending decisions and account recovery arrangements privately.
- [ ] Record privacy/legal owner, actual log retention, provider agreements, asset rights and analytics decision. No analytics provider is installed by this template.
- [ ] Export/back up Sanity documents and approved media separately from Git. Rehearse restoring a page and image. Keep private source evidence separate from public assets.
- [ ] Explain the editorial workflow: draft, review, publish, observe build, verify live. Required Home has no ordinary unpublish/delete action; API operations still require care.
- [ ] Transfer access and document an incident contact path. Generated client repos are independent; apply future maintenance through reviewed client pull requests without rerunning setup.
- [ ] Set `PROJECT.md` phase to `handoff` with the non-sensitive status and next owner/task.
