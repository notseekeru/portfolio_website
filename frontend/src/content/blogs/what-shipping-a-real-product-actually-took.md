---
title: What Shipping A Real Product Actually Took
date: 2026-09-23
description: Seven weeks building Maxterview, from an empty repo to a voiced interviewer on its own domain, including the payment rail that needed a trip to the barangay hall and the three things I deleted on the way.
---

# Summary

Maxterview is an AI interview simulator I built from an empty repo in August and still run today. A candidate creates a run, answers over a streamed chat, and gets back a graded review: an annotation per answer, ten scored dimensions, a verdict and tips.

I deleted three things along the way. Staging, Sentry and the browser speech engines. I kept them in this post because the decision to remove each one is the part that made the product better.

---

## The prologue

I had been mostly infra, and I wanted to test myself on the other half: product and full stack, where the decisions are mine and the polish is the point instead of whatever is left over. Not a startup, I am not that guy. One real product, taken as far as I could take it.

An interview simulator, because it forces the hard parts: voice in both directions, grading that has to be held to something true, runs that carry state, and money at the end. Any wrapper would have worked as an excuse. This one would not stay a wrapper.

The bar was that it looks and feels shipped. That is taller than it sounds when every layer under it is yours too.

## The Floor, And Deciding Not To Have An ORM

The first week was chore work and I wanted it that way. Three compose files, one shared plus a dev and a prod overlay, a digest-pinned Postgres, and CI running ruff and pytest against a Postgres service next to biome, TypeScript and a production build. Renovate owns the dependency PRs. None of it is interesting. All of it is why the later weeks could move.

Migrations went to [yoyo](https://pypi.org/project/yoyo-migrations/), the Python analogue of node-pg-migrate. My first instinct was to put the rollback inline, under a `-- migrate:down` block in the same file. Then I watched yoyo read that block as part of the up step and cheerfully create my tables and drop them again. Every migration since keeps its rollback in a separate `<name>.rollback.sql`. It is uglier and honest.

I did not add an ORM. I would rather read the SQL I ship than learn another mapping layer's opinions about joins, and the schema is small enough that the trade is obvious.

Postgres itself is Neon, not a pod holding a volume. A PVC means volume sizing and a restore I would have had to rehearse. Neon is one I did not build, on a free tier that covered the whole build. The cost is latency, since every query crosses the network to us-east-1, plus a second vendor in the critical path. For one database with no users, owning the storage was the more expensive kind of free.

![Paper diagram of the floor: one base compose file with dev and prod overlays, a digest-pinned Postgres, CI running ruff, pytest, biome and tsc, and Renovate on dependency PRs. yoyo migrations keep each rollback in a separate file because the inline down block was read as part of the up step. No ORM, just the SQL as written, against Neon on the free tier in us-east-1.](/shipping-floor.png)

## The Tooling Tax, Or Why The Runner Stops Being The Test

Checking any of this in a browser meant plumbing, and the plumbing fought back.

Three MCP servers ended up in `.mcp.json`: the Playwright browser server, Neon over HTTP with its API key read from the git-ignored `.env` at connect time, and Grafana from its container image with the transport forced to stdio because it would not stay on the wire otherwise.

The browser server taught me the most. It comes from nixpkgs through the repo flake instead of npx, wrapped with its own browser path, so the command only resolves when the agent starts inside the dev shell. The committed scripts have the same problem in reverse: they need `playwright-core` and a chromium out of `/nix/store`, and a hardcoded store path dies the next time something is garbage collected or the flake moves. A small resolver finds them at runtime instead. Nothing assumes a hash is stable.

Drift wore me down. The scripts were written against the app as it was: a call to action that has since been reworded, an `/app` prefix that no longer exists, a Complete step that got renamed. Each one turns a run into script maintenance before it can say anything about the product, and some weeks the script was the thing I was debugging.

The fix was not a better script. It was a decision order, written into the skill and left there. Driving the real browser and reading the accessibility tree gives a verdict, so that is the default. A canned runner runs as-is, for its PASS/FAIL line and nothing else. A runner that fails, misses a selector or lacks the leg I need is a dead end, not a task. Editing one needs an explicit ask. I had already demoted the interactive path to a footnote once and promoted it back a day later, which is why the order is written down now instead of remembered.

![Paper chart of the runner decision order: three MCP servers (Playwright, Neon over HTTP, Grafana on stdio) and the decision order. A real browser and the accessibility tree give the verdict by default, a canned runner runs as-is for its PASS/FAIL line, a failing runner is a dead end, and editing one needs an explicit ask.](/shipping-runner-order.png)

## The Payment Rail

I started on Stripe. It is not available to a Philippine individual the way I needed, and it carried fees I did not want to absorb. I looked into Xendit, then moved the provider seam to PayMongo.

Then I found out Subscriptions and Card Vaulting are support-enabled capabilities, and even plan creation answers 403 on this account. The rail I wanted, a recurring subscription with a saved card, was not available to me. What was available needed verification, and verification needed documents I did not have. So I went out and got them.

After I got the documents the account got verified, and that cleared the bar for real money. Live mode on an individual account is still narrower than the feature list implies. The app asks PayMongo for `paymaya` and `card`, but only the QR and e-wallet rails can go live without a registered business type. So the rail I shipped renders an InstaPay QR in the app, I scanned it with GCash, and 99 pesos moved. The signed webhook landed, the `subscriptions` row wrote, and the switch in the app flipped to paid. Not a direct GCash charge. A QR gateway any InstaPay bank or e-wallet can scan, which is wider than the rail I originally asked for. The rail works end to end against delivered webhooks now. It took my money.

![Paper path through the payment rail: Stripe screened out for a Philippine individual and its fees, Xendit researched and passed over, PayMongo verified and live. Three gates: Subscriptions support-enabled, Card Vaulting support-enabled, and plan creation returning 403. Live methods: `paymaya` and `card` refused without a registered business type, InstaPay QR and e-wallet shipped.](/shipping-rail-path.png)

### Designing Around A Capability I Cannot Buy

The swap stayed cheap because the entitlement was always mine. One `subscriptions` row, one `resolve_tier` function that reads it, and provider-specific code confined to one module. When I left Stripe, the migration renamed its columns to provider-agnostic names instead of rewriting the schema, because the schema was never about Stripe.

The recurring rail is blocked, so I put 30 days of premium on the same `current_period_end` field the recurring path would write when it exists. The capability block stopped being a blocker and became a gap in the automation. When PayMongo lifts it, the write path already has somewhere to put the answer.

![Paper flow chart of the period-mode upgrade. Upgrade starts a PayMongo payment intent for QR Ph; the signed payment.paid webhook writes a premium subscription row with current_period_end plus 30 days; resolve_tier reads it, and the daily cap stays for free or lifts for premium. Two constraints: cards need a registered business type, and subscriptions and Card Vaulting are support-gated.](/shipping-payment-rail.png)

Bring-your-own-key is the other half of the same reasoning. If someone brings their own provider credentials, they skip the free cap without changing their tier, though usage is still limited to high caps. The keys are Fernet-encrypted at rest, with only a last-four hint readable back.

## Production, And The Moment It Was Real

Prod is one Neon project reached over its direct host, not the pooler. The pooler is PgBouncer in transaction mode, and asyncpg's implicit prepared statements do not survive it. The app runs in its own namespace, and an Argo PreSync Job runs the migrations from the app image before the pods roll. A broken migration stops the sync instead of half-deploying.

Promotion is continuous and has no ceremony. Green CI builds both images, Trivy scans them, and a job bumps the pinned tag in the gitops repo.

![Paper snake flow of the deploy. A green commit on main runs CI (ruff, pytest, biome, tsc, build), builds both images and scans them with Trivy, bumps the pinned tag in the gitops repo, then hands off to ArgoCD with prune and selfHeal. The PreSync Job runs the yoyo migrations from the app image, the pods roll in their namespace, and Neon is reached on its direct host, never the pooler.](/shipping-deploy-pipeline.png)

The click moment of the whole build was not the first payment. It was watching the app answer on its own domain for the first time, knowing the migration job in front of it had run inside the same image the pods were about to start. I had verified everything before that in pieces. That was the first time they were live at once.

## Staging, Built And Then Deleted

Two days after I finished staging I deleted it, and the deletion is the decision I defend.

Staging was a real second environment: its own Neon project, its own Infisical environment, its own Terraform root module and state key, its own namespace, its own ArgoCD Application, and a second frontend image. The SPA inlines the Clerk publishable key at build time, so a different Clerk instance needs a different artifact.

Inheritance was the trap I cared about most. A prod database value inherited into staging would have pointed the pods at the production database and let the PreSync migration job run there, so while staging existed both modules carried a guard refusing the other environment's endpoint. Money had the same shape. Prod's payment key is live, so an inherited value would have put live billing credentials in a rehearsal environment. Typos are not the dangerous part. Silence is. A guard that refuses beats a checklist that reminds.

It existed for two reasons, and ADR 0003 only records one. The record says migration rehearsal and load testing, which is true but smaller than the motive. What I actually wanted was the deployment itself: a second environment to practise a production rollout in, hands on, where the decisions were mine and a wrong one was cheap. It was never a release gate, since every green commit on main already ships straight to production, and that is the part that did not survive. Practising a rollout you have no users for is still practising. A migration-promotion job for CI/CD was on the list too, and it went with the environment. With one namespace and the migration running inside the app image before the pods roll, there is nothing left to promote between.

What staging actually cost was a mirrored set of about 30 secrets kept in sync by hand, a second consumer of a per-project Neon quota, and a class of `MOD` typo that needed endpoint guards refusing each other in both modules.

There are no users to protect from a bad deploy and no team to review against a rehearsal target. So it went.

The discipline was in how it went. ADR 0003 records the full rebuild path in order: database and secrets first, then cluster objects, then GitOps, then the image build. It marks the exact mistakes too. A missing Infisical folder 404s the write pre-check, environment inheritance in the dashboard does not reach the CLI, and the API actually reads `.` dot-form references. Deleting the machinery took an afternoon. Writing down why I deleted it and exactly how to rebuild it took longer, and that document is the difference between a decision and a thing I have to remember. Reversal cost is a day.

The namespace work from the same week stayed because it had a real fault underneath. Pull secrets never cross namespaces, so every new namespace needs its own `imagePullSecret`. Without one, every pod, including the migration Job that gates the Argo sync, sits in ImagePullBackOff while I blame the image. Portfolio and diagram each got a namespace and a pull secret, and the DigitalOcean module is gone because a third cloud for one static site was never justified.

## Sentry In And Out

I wired Sentry, watched a real production bundle deliver, and deleted it in the same session. Its own gap list killed it. Without sourcemaps the stack traces are decoration, and at my traffic an issue feed, grouping and an email channel is a lot of weight. The number that ended it was **146 kB gz on every signed-in load**, paid by users, for a dashboard nobody reads yet.

The one leg it held alone became mine. A render crash swallowed by the error boundary never reaches `window.onerror`, so the boundary reports a browser error by hand, message and component stack, through the backend route everything else uses. That beacon is the whole frontend observability story, and it holds no third-party credential.

Sentry comes back the day there are real users and a decision to publish sourcemaps. Symbolication is what it is actually for.

## A Pipeline With No Metrics SDK

Logs are the only signal. Every number on the dashboard is derived from them at query time.

The app emits structured JSON to stdout through structlog, with a `ProcessorFormatter` bridge so my events and stdlib records, uvicorn tracebacks included, come out as one shape. `request_id` is bound per request and echoed as `X-Request-ID`. Identity comes from `scope["state"]`, because the rate limiter's `BaseHTTPMiddleware` blocks contextvars from travelling back up the stack. Health checks are filtered at the source. The log shaping is the filter.

Shipping is one Grafana Alloy Deployment, not a DaemonSet, tailing pod logs through the Kubernetes API. No hostPath, no privileged container, no node filesystem. A namespaced Role sets the scope, and `own_namespace = true` is mandatory because discovery lists cluster-wide by default. A namespaced Role without it yields zero targets and a 403 in the Alloy log. The second trap shows up at 2am pace. The migration Job finishes, its pod sits in `Succeeded`, and Alloy reopens the closed log stream about twice a second, forever, until the relabel rule drops finished phases.

Alloy reads its config at startup, and Argo updating a ConfigMap restarts nothing. The Deployment carries a config hash annotation that has to be bumped with any edit. I wrote that footgun down next to the thing it breaks.

Grafana Cloud Loki holds 14 days of unparsed JSON. Parsing happens at query time, which keeps the label set small. Every panel is a LogQL aggregate:

```logql
sum(count_over_time({app="$app"} | json | status >= 500 [$__auto]))

quantile_over_time(0.95, {app="$app"} | json | event="http.request"
  | keep status, duration_ms | unwrap duration_ms [$__auto])

sum(count_over_time({app="$app"} | json | event=~"llm[a-z._]*(unavailable|failed|transport_error)" [$__auto]))
```

Four alert rules live in a `maxterview` folder and route to a Slack contact point. All of them are `noDataState: OK`, which keeps a quiet stack quiet. It also means a rule whose field names do not match my logger never fires and never complains. A quiet stack and a dead rule look identical, and that is the failure mode I care about most. So the bootstrap script ends with a live query against the `app` label and refuses to report success if it returns nothing.

That script is the other thing this work produced. The whole stack is portable now. One Python file recreates the folder, the rule group and the dashboard against any Grafana Cloud organization. It is idempotent, it preserves rule UIDs, and it refuses to write outside a slug pattern. A dashboard assembled by clicking is not infrastructure, and the next project should get most of this from one command.

Two bugs earned their keep during the install. Every panel went red with no data because the `app` template variable had no value, which you cannot see until you read Grafana's own UI instead of your own code. One rule's regex could never match the log line it was written against, found the same way. No test would have caught either one. I caught both by looking at the screen I was claiming to monitor.

![Paper log pipeline. The browser error beacon hits FastAPI, which writes one JSON line to stdout. Alloy tails pod logs through the Kubernetes API and ships them to Grafana Cloud Loki with 14 days of retention, which feeds the six-panel dashboard and the four rules in the `maxterview` folder, all with `noDataState: OK`, and the rules route to Slack. A bootstrap script on the side recreates the folder, rule group and dashboard and ends with a live query. Three traps: a namespaced Role needs `own_namespace`, a ConfigMap edit restarts nothing without the config hash, and a `Succeeded` pod reopens its stream twice a second.](/shipping-log-pipeline.png)

## Interview Loop Wiring

One run is the whole loop. A candidate creates it, the interviewer's opener streams into the page, and they answer turn by turn. When the run closes, the graded review comes back: ten scored dimensions, a verdict, tips and an annotation per answer. The run carries state, and the transcript holds one reply per user turn, so each annotation has exactly one answer under it.

Voice is not a second pipeline. A typed answer and a spoken one go through the same SSE chat route, which is the point: one path to keep working. Speech-to-text is whisper-large-v3-turbo, and its transcript lands in the answer box.

The other direction is Aura-1, one line at a time. A sentence chunker splits at 140 characters, then at 320, and the playback queue fetches the next line while the current one plays. Waiting on a full synthesis between sentences is where the dead air comes from.

Both directions pass one gate. GET /api/voice answers whether voice is on, and it governs the mic and the speaker together, not one side at a time. Whisper and Aura also draw from a shared 10,000 neuron daily budget, so a long voice session spends one pool in both directions.

![Paper voice path. The mic records one take with a 180 second cap and live meter; POST /api/voice/stt sends it to whisper-large-v3-turbo; the transcript lands in the answer box and goes through the same SSE chat route as typed text. A sentence chunker splits at 140 then 320 characters, POST /api/voice/tts asks Aura-1 for one request per line, and the playback queue fetches the next line while the current one plays; the caption reveals up to the spoken line. Two constraints: the voice gate at GET /api/voice controls both, and a shared 10,000 neuron daily budget caps Whisper and Aura.](/shipping-voice-path.png)

---

# Conclusion

Staging went because a one-man project with no users does not need a rehearsal target. Sentry went because its own gap list killed it. The browser speech engines went because a generic voice is worse than no voice when the interviewer is the product.

Here is what is still open, in the order I intend to hit it. A registered business type, the only thing left between here and cards on the live rail. The InstaPay QR takes money today from any bank or e-wallet that can scan it, and every other method the app asks for is still refused. An evaluation suite over the stored interviews I already have, frozen as fixtures and asserted before every prompt edit, because prompt changes currently ship unmeasured. Caching and a job queue, mostly so a retry survives a page change. That is overengineered for a product with no users, and it is also the part I want to build. And provider-managed recurring, waiting on PayMongo lifting the Subscriptions and Card Vaulting capability, with 30 days of premium standing in until it does.

---

## Update (October 24, 2026)

OTLP metrics and traces shipped two days after this post, so the pipeline is not log-only anymore. The dashboard reads request duration, pool wait and query time from Prometheus, and a trace id in every log line joins the two.

The browser part is not a test suite I run. It is a skill the agent runs. It opens the real app, clicks through it the way a person would, and reads back what the page actually shows, and in one session it loaded and re-read that page 47 times. That is how it found duplicate date labels on the analytics chart, four ticks for fifteen runs, and a checkout bug that had been there since the payment rail shipped. Every earlier test took a stand-in path and never touched the real checkout. It also withdrew two of its own reports that turned out to be wrong, which is the part I trust most.
