# New client site checklist

Keep non-sensitive progress in `PROJECT.md`. Put credentials, recovery arrangements, private evidence and detailed ownership records in the client's restricted working notes.

## Setup

- [ ] Generate an independent repository; record its starter revision, repository owner and visibility. Set `PROJECT.md` kind to `client` and phase to `setup`.
- [ ] Collect the purpose, audience, pages, interactions, language(s), deadline, content owner and design references in `docs/design-brief.md`.
- [ ] Record named owners and backup access for GitHub, Sanity, Cloudflare, domain/DNS and existing mail. Do not create substitute accounts or inboxes without a decision.
- [ ] Run Node 24/npm 11, `npm ci`, checks, tests, both builds and Worker dry runs. The default demo needs no accounts.
- [ ] Follow [Sanity setup](quickstart.md#sanity-project-and-studio). Set matching site/Studio project IDs and dataset. Publish the singleton `home`, deploy Studio and verify agreed user access. Record Sanity Free's Administrator/Viewer role limitation.
- [ ] Follow [Workers setup](quickstart.md#cloudflare-workers-setup). Set distinct live/review Worker names; connect the review repository/branch, build variables and deploy command with `--env review`.
- [ ] Confirm review mode, noindex, canonical origin, deployed commit and API route at the generated `workers.dev` hostname. Keep final domain and live mail untouched.
- [ ] Configure the [review deploy hook](quickstart.md#sanity-publish-to-workers). Publish an identifiable CMS edit, inspect Sanity Attempts, the matching Worker deployment and changed review page. Record evidence without the hook URL.
- [ ] Mark setup complete in `PROJECT.md`; move to `design-implementation`. If access is pending, record it and continue independent work in demo mode.

## Design and implementation

- [ ] Implement the client's approved design and copy. Replace the demo layout/style; reuse or adapt the shared metadata and contact behavior.
- [ ] Adapt the Sanity schema and query to actual editorial needs; update webhook filters when adding document types. Keep required singleton protection or define a deliberate removal behavior.
- [ ] Keep review mode/noindex while iterating. Do not remove indexing protection when replacing the demo.
- [ ] Verify responsive layout, keyboard access, headings, links, metadata and interactions against the actual brief. Record design decisions and remaining feedback.
- [ ] Keep sensitive or uncleared source material out of public Git, static assets and Sanity. Confirm licences/credits for approved assets.

## Contact and launch

- [ ] Move phase to `launch` when the implementation is ready for final acceptance. Inventory current inbox and MX records; choose recipient, sender and provider separately.
- [ ] Follow [hosted contact acceptance](quickstart.md#contact-setup-and-hosted-delivery). Configure isolated review secrets, verified sender, Turnstile hostname and review enable switches.
- [ ] Submit a hosted enquiry, confirm actual inbox receipt and Reply-To, and test invalid fields, failed verification and failure messaging. API acceptance alone is insufficient.
- [ ] Add final live secrets separately; enable the live public form and runtime switch only after verified delivery and launch approval. Test again on the live hostname.
- [ ] Adapt the [privacy](templates/privacy-policy.md) and [cookie](templates/cookie-policy.md) working templates to the client's actual controller, form, logs, processors, retention and deployed technologies. Resolve every marker, verify behavior and obtain the client's approval before publication.
- [ ] Analytics remains undecided. If a provider is selected later, explicitly configure it, review its data/consent requirements and exclude review traffic.
- [ ] Verify a monitored [build-failure notification path](quickstart.md#build-failure-monitoring), including a CMS-triggered failure. Record the owner and how to inspect Sanity attempts when no build starts.
- [ ] Review final content, accessibility, mobile layout, links and metadata. Obtain the agreed domain/DNS launch authorization; inspect existing MX before changes.
- [ ] Set the live build's `PUBLIC_SITE_MODE=live`, correct `SITE_URL` and production branch. Connect the domain and verify HTTPS, canonical/robots metadata, CMS publishing and real mail delivery. Keep the review Worker in review mode.
- [ ] Complete [operations handoff](operations-handoff.md), then set phase to `handoff`.
