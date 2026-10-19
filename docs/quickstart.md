# Quickstart and configuration

Astro produces static HTML. Sanity supplies published editorial content during each build. Cloudflare Workers serves static assets directly and runs `worker/index.ts` for `/api/*`. The contact handler lives in `worker/contact.ts`; `worker/mail.ts` selects Resend or the optional Cloudflare adapter. No Astro server adapter is required.

## Local development

Use Node 24 and npm 11, pinned by the version files and package engines. Docker and service accounts are unnecessary for the demo.

```bash
npm ci
npm run dev
npm run check
npm test
npm run build
npm run studio:build
npm run worker:check
```

Astro dev is [localhost:4321](http://localhost:4321). `npm run preview` serves the built frontend only. For the complete local static site and API:

```bash
cp .dev.vars.example .dev.vars
npm run dev:worker
```

Worker dev builds Astro first, then serves [localhost:8787](http://localhost:8787). Rerun it after static-page changes; use Astro dev for frontend hot reload. The form starts disabled. To verify the API's account-free simulation:

```bash
curl http://localhost:8787/api/contact \
  -F 'name=Local test' \
  -F 'email=visitor@example.invalid' \
  -F 'message=This is a local simulation only.'
```

Expect `{"ok":true,"mode":"local_mock"}`. Localhost never sends mail, even when hosted credentials exist. Automated tests mock hosted verification and sending; they do not contact mail services.

## Deployment modes

Copy `.env.example` to `.env` when configuring a client. `config/site.mjs` validates the same settings used by Astro configuration and page rendering.

| Mode | Required configuration | Behavior |
| --- | --- | --- |
| `demo` (default) | None | Labelled demo when Sanity is unset; always `noindex`. Allows design work while external access is pending. |
| `review` | Sanity project ID and real HTTPS `SITE_URL` | Published CMS content; always `noindex`. |
| `live` | Same as review, with the approved live origin | Indexing allowed after launch approval. |

Set `PUBLIC_SITE_MODE` explicitly in each hosted build. Setting a Sanity ID always activates CMS fetching, even in demo mode: a missing published `home` document or invalid required field fails the build. Review/live never fall back to demo content. Only missing CMS configuration in demo permits placeholders.

Workers Builds sets `WORKERS_CI_BRANCH`. A branch different from `SITE_PRODUCTION_BRANCH` (default `main`) is rendered as review even if it inherits live settings. For local/manual preview builds without that metadata, explicitly set `PUBLIC_SITE_MODE=review`. Keep the review Worker configured as review even when its branch is `main`. `noindex` is indexing guidance, not access control; use Cloudflare Access or another agreed restriction for confidential review work.

`BaseLayout.astro` supplies language, title, description, canonical URL, Open Graph and robots metadata. Reuse it in each client page and provide actual page-specific metadata. `ContactForm.astro` can move into the client's design; retain its behavior while replacing its styling. The default contact form ID is `contact-form`; provide unique IDs if rendering more than one.

## Sanity project and Studio

1. Create the project and public dataset in the client's durable Sanity account. Record public IDs in `PROJECT.md`, and private ownership/recovery details in the client's restricted operations record.
2. Set root `.env` values `PUBLIC_SANITY_PROJECT_ID` and `PUBLIC_SANITY_DATASET`. Copy `studio/.env.example` to `studio/.env`; set matching `SANITY_STUDIO_PROJECT_ID` and `SANITY_STUDIO_DATASET`. These are public identifiers, not write tokens.
3. Run `npm run studio:dev`. Home is a native singleton with document ID `home` and schema type `homePage`. Fill and publish it. Adapt this small schema to actual editorial requirements during implementation, updating the query and webhook scope together.
4. Run checks and build. Confirm `dist/index.html` contains the published text. The client uses the published perspective, `useCdn: false` and a pinned API date to fetch current published content at build time.
5. From `studio/`, run `npx sanity deploy` to select a client-specific Studio hostname. Invite the agreed users and verify access in the deployed Studio.

Sanity Free currently offers Administrator and Viewer roles, not the narrower Editor role. Editing users on Free therefore receive broad administrator privileges. Record that decision explicitly; use Growth when restricted editorial permissions are required. Public datasets are for publishable content, and uploaded assets may remain reachable by URL. Contact messages and private evidence do not belong there. See [pricing](https://www.sanity.io/pricing) and [Studio deployment](https://www.sanity.io/docs/studio/deployment).

Native singletons prevent duplicate creation. Home's unpublish/delete actions are also hidden because it is required by the build. These Studio controls are not API authorization. Direct API deletion or invalid content still fails the next build; an earlier successful deployment can remain live. Decide a deliberate removal behavior when adding other content types.

## Configuration boundaries

| Setting | Location | Purpose |
| --- | --- | --- |
| `PUBLIC_SITE_MODE`, `PUBLIC_SITE_LANGUAGE`, `SITE_URL`, `SITE_PRODUCTION_BRANCH` | `.env` locally; Workers Builds variables | Mode, language, canonical origin and production branch. |
| `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET` | Site build variables | Public content source; no read token needed for a public dataset. |
| `SANITY_STUDIO_PROJECT_ID`, `SANITY_STUDIO_DATASET` | `studio/.env`; Studio deployment settings | Same public project/dataset. |
| `PUBLIC_CONTACT_FORM_READY`, `PUBLIC_TURNSTILE_SITE_KEY`, `PUBLIC_CONTACT_EMAIL` | Site build variables | Public form visibility, widget key and optional direct email link. |
| `CONTACT_FORM_ENABLED`, `CONTACT_DEV_MODE`, `CONTACT_PROVIDER` | `wrangler.jsonc` `vars`, separately in `env.review.vars` | Runtime switches and provider. Hosted dev mode stays `0`. Keep sending disabled until the hosted test. |
| `CONTACT_RECIPIENT`, `CONTACT_SENDER` | Worker secrets, separately for review and live | Actual inbox and fixed authenticated sender; Resend also accepts `Site Name <address>`. |
| `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY` | Worker secrets | Bot verification and default sending credentials. |
| `CF_EMAIL_ACCOUNT_ID`, `CF_EMAIL_API_TOKEN` | Worker secrets, optional | Cloudflare verified-destination adapter only. |
| Deploy-hook URL | Sanity webhook URL field / private secret store | Secret build trigger. Never commit it or put it in CMS content. |

Build settings and Worker runtime secrets are separate. Adding a runtime secret does not rebuild static HTML. Changing a public build value requires a new Astro build and deployment. Configure switches in Wrangler, not only as dashboard variables that a later deployment could overwrite. Keep secrets out of `.env` examples and command arguments; use the dashboard secret controls or interactive `npx wrangler secret put NAME`, adding `--env review` for review secrets.

`npm run worker:types` generates declarations from Wrangler and the public `.dev.vars.example`. Regenerate and commit `worker/env.d.ts` after changing bindings or variable names. `worker:check` checks those declarations and bundles without deploying.

## Cloudflare Workers setup

For a generated client repository:

1. Replace `name` and `env.review.name` in `wrangler.jsonc` with distinct client-specific Worker names. Keep static assets in `dist`, `run_worker_first: ["/api/*"]` and `not_found_handling: "404-page"`. Ordinary assets bypass Worker execution; unknown API paths return 404 and non-POST contact requests return 405.
2. In the client's Cloudflare account, use **Workers & Pages → Create application** to connect the intended GitHub repository to a Worker. Match its name to the Wrangler name. Configure Node 24, repository root, build command `npm run build` and deploy command `npx wrangler deploy`. Inspect the install/build log and deployed commit. There is no Pages output-directory field to configure; Wrangler declares assets.
3. Create/connect the review Worker with deploy command `npx wrangler deploy --env review`. It may track a trusted design branch or `main`. Configure its build variables with `PUBLIC_SITE_MODE=review`, matching Sanity IDs, a stable review `SITE_URL` and `PUBLIC_CONTACT_FORM_READY=0`. Each connected Worker has its own build settings.
4. Use the generated `*.workers.dev` review hostname first. For manual setup/deployment, `npm run deploy -- --env review` builds and deploys review, using the build variables from your local `.env`/shell. Explicitly set review mode. Record the observed URL in `PROJECT.md` and verify the page, metadata and API route.
5. Keep non-production branch builds disabled on the live Worker unless their credential exposure has been deliberately reviewed. Use the isolated review Worker for design branches and review mail secrets. Do not let arbitrary pull-request code use live mail credentials. Preview versions are not a substitute for runtime secret isolation.
6. Add the live Worker and approved custom domain during the launch milestone. Use `PUBLIC_SITE_MODE=live`, the live `SITE_URL`, the correct production branch and separately configured runtime secrets. Inspect rendered robots/canonical metadata after deployment.

`npm run deploy` builds before deployment. Workers Builds already has a separate build step, so use `npx wrangler deploy` there. Do not upload `dist` alone: the Worker must accompany it for the contact API. See [Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/), [Static Assets](https://developers.cloudflare.com/workers/static-assets/) and [configuration](https://developers.cloudflare.com/workers/wrangler/configuration/).

## Sanity publish to Workers

1. In the review Worker's **Settings → Builds → Deploy Hooks**, create a named hook for its intended branch. Copy the secret URL directly into a Sanity webhook for the intended dataset. Workers Builds supports CMS hooks; no custom rebuild relay is needed.
2. Configure `POST`, published create/update/delete, with drafts and versions excluded. For the untouched starter, use `_type == "homePage" && _id == "home"`. Expand this filter as the client's content model grows.
3. Publish an identifiable edit. Inspect Sanity's Attempts log, the matching successful Worker build/deployment and the changed review page. Record evidence without the hook URL. A successful hook HTTP request alone does not prove a deployed content change.
4. At launch, configure a separate hook for the live Worker. Decide whether the review hook should stay enabled. A failed build leaves the earlier version live; publishing is not instantaneous.

See [Workers deploy hooks](https://developers.cloudflare.com/workers/ci-cd/builds/deploy-hooks/) and [Sanity webhooks](https://www.sanity.io/docs/content-lake/webhooks).

## Build failure monitoring

Assign a monitored inbox and an owner who responds to failures. The old Pages project-update alert does not apply to Workers. Workers Builds supports `build.failed` events through [Event Subscriptions](https://developers.cloudflare.com/queues/event-subscriptions/) and a Queue consumer; route that event to the client's existing monitoring/email system or an explicitly configured notifier. This is an additional integration, not a notifier shipped by this starter. Record and test it before operations handoff, including a failed CMS-triggered build. GitHub checks show build status but do not replace a verified notification path for CMS-triggered failures. A webhook that never starts a build must still be investigated in Sanity Attempts.

## Contact setup and hosted delivery

Sending starts disabled in both Wrangler environments and the public build. First choose the existing business inbox and a fixed authenticated sender. Resend is an outbound sender, not a mailbox service.

1. Create/use the client-owned Resend account, verify the sending domain and create a site-named Sending-access API key. Store it as `RESEND_API_KEY` on the review Worker. Add `CONTACT_SENDER`, `CONTACT_RECIPIENT` and `TURNSTILE_SECRET_KEY` as separate secrets. A restricted key must cover the sender domain.
2. Configure Turnstile's allowed hostname for the stable review Worker and set its public build key. The handler verifies both the token and returned hostname. A token for another hostname is rejected.
3. For the hosted acceptance test, change only `env.review.vars.CONTACT_FORM_ENABLED` to `1`, and build review with `PUBLIC_CONTACT_FORM_READY=1`. Deploy the review environment and submit through its form. Keep live sending disabled while testing.
4. Check Resend delivery status, actual inbox receipt and Reply-To. Test invalid fields, a bad Turnstile token and the failure message. The endpoint's success means provider acceptance, not inbox delivery. Disable the review form while correcting a failed test.
5. Configure the final sender/recipient and separately add live secrets. Repeat the review test with the final mail settings. At approved launch enable the top-level runtime switch and live public form, rebuild/deploy and confirm live inbox receipt and Reply-To.

The `onboarding@resend.dev` sender is restricted testing infrastructure, not a launch sender. Use a verified client domain for final delivery. The optional Cloudflare adapter requires its configured sending domain and account-verified destination; confirm current plan requirements. Inspect existing MX records before any Email Routing change, particularly on Google Workspace or another mail host. Do not provision or replace an inbox without a client decision.

See [Resend API](https://resend.com/docs/api-reference/emails/send-email), [Resend pricing](https://resend.com/pricing), [Turnstile validation](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/) and [Cloudflare Email Service](https://developers.cloudflare.com/email-service/).

## Transition to design and launch

After local checks/builds and a CMS edit reaching review are verified, update `PROJECT.md` to `design-implementation`. Work from `docs/design-brief.md`; keep setup evidence so later sessions do not repeat it. Pending access should be recorded as a blocker while independent design work continues in demo mode. Complete mail, final policy wording, live indexing, domain/DNS approval and handoff later using the linked checklists. Analytics remains undecided; this starter installs no tracking.
