---
title: What Shipping A Real Product Actually Took
date: 2026-09-23
description: Seven weeks building Maxterview, from an empty repo to a voiced interviewer on its own domain.
github: https://github.com/notseekeru/maxterview_website
---

# Summary

Maxterview is an AI interview simulator I built from an empty repo in August and still run. A candidate creates a run, answers over a streamed chat, and gets a graded review: an annotation per answer, ten scored dimensions, a verdict and tips.
I deleted three things on the way: staging, Sentry and the browser speech engines. Each deletion made the product better, so each one is in this post.

---

## The App I Built

I had been mostly infra and wanted the other half: product and full stack, where the decisions are mine and the polish is the point. Not a startup, I am not that guy. One real product, taken as far as I could take it.
An interview simulator forces the hard parts: voice both ways, grading held to something true, runs that carry state, and money at the end. Any wrapper would have worked as an excuse. This one refused to stay one.
The bar was that it looks and feels shipped. That is taller than it sounds when every layer under it is yours.

## The Floor

The first week was chore work: three compose files, one shared plus dev and prod overlays, a digest-pinned Postgres, CI running ruff and pytest against a Postgres service next to biome, TypeScript and a production build, and Renovate on the dependency PRs. None of it is interesting. All of it is why the later weeks could move.

Migrations went to [yoyo](https://pypi.org/project/yoyo-migrations/), the Python analogue of node-pg-migrate. My first instinct was to put the rollback inline under a `-- migrate:down` block. Then I watched yoyo read that block as part of the up step and cheerfully create my tables and drop them again. Every migration since keeps its rollback in a separate `<name>.rollback.sql`.

I did not add an ORM. I would rather read the SQL I ship than learn another mapping layer's opinions about joins, and the schema is small enough that the trade is obvious.

The database runs on neon, I thought about running it on a PVC since I already have some of my apps running on a k3s stack on a Pi, but ultimately I just something like Neon for reaching out my comfort zone and stuff. The cost is latency, since every query crosses the network to a data center, plus a second vendor in the critical path.

![Paper diagram of the floor: one base compose file with dev and prod overlays, a digest-pinned Postgres, CI running ruff, pytest, biome and tsc, and Renovate on dependency PRs. yoyo migrations keep each rollback in a separate file because the inline down block was read as part of the up step. No ORM, just the SQL as written, against Neon on the free tier in us-east-1.](/shipping-floor.png)

## How It Is Wired

Prod is one Neon project reached over its direct host, not the pooler. The pooler is PgBouncer in transaction mode, and asyncpg's implicit prepared statements do not survive it. The app runs in its own namespace, and an Argo PreSync Job runs the migrations from the app image before the pods roll. A broken migration stops the sync instead of half-deploying.

Promotion has no ceremony. Green CI builds both images, Trivy scans them, and a job bumps the pinned tag in the gitops repo. The click moment was not the first payment. It was the app answering on its own domain for the first time, with the migration job in front of it running from the same image.

![Paper snake flow of the deploy. A green commit on main runs CI (ruff, pytest, biome, tsc, build), builds both images and scans them with Trivy, bumps the pinned tag in the gitops repo, then hands off to ArgoCD with prune and selfHeal. GitHub Actions runs those first four steps, and the Pi 5 cluster, k3s, runs ArgoCD, the PreSync Job and the pods. The PreSync Job runs the yoyo migrations from the app image. A failed migration stops the sync before the pods roll; a good one lets the pods roll in their namespace. Neon is reached on its direct host, never the pooler.](/shipping-deploy-pipeline.png)

The pipeline started log-only, with every number on the dashboard derived from the logs at query time. The app emits structured JSON through structlog with a `ProcessorFormatter` bridge, so my events and stdlib records, uvicorn tracebacks included, come out as one shape. Identity comes from `scope["state"]`, because the rate limiter's `BaseHTTPMiddleware` blocks contextvars from travelling back up the stack.

Shipping is one Grafana Alloy Deployment, not a DaemonSet, tailing pod logs through the API. A namespaced Role sets the scope, and `own_namespace = true` is mandatory because discovery lists cluster-wide by default; without the flag a namespaced Role yields zero targets and a 403. The migration Job's pod sits in `Succeeded` and Alloy reopens the closed stream about twice a second until a relabel rule drops finished phases. Alloy reads its config at startup, so the Deployment carries a config hash annotation that has to be bumped with every edit.

Grafana Cloud Loki holds 14 days of unparsed JSON, parsed at query time to keep the label set small. The log panels are LogQL aggregates:

```logql
sum(count_over_time({app="$app"} | json | status >= 500 [$__auto]))
quantile_over_time(0.95, {app="$app"} | json | event="http.request"
  | keep status, duration_ms | unwrap duration_ms [$__auto])
sum(count_over_time({app="$app"} | json | event=~"llm[a-z._]*(unavailable|failed|transport_error)" [$__auto]))
```

OTLP metrics and traces shipped after this. The dashboard reads request duration, pool wait and query time from Prometheus, and a trace id in every log line joins the two.

![Paper log pipeline. The browser error beacon hits FastAPI, which writes one JSON line to stdout. Alloy tails pod logs through the Kubernetes API and ships them to Grafana Cloud Loki with 14 days of retention, which feeds the dashboard and the four rules in the `maxterview` folder, all with `noDataState: OK`, and the rules route to Slack. A bootstrap script on the side recreates the folder, rule group and dashboard and ends with a live query. Three traps: a namespaced Role needs `own_namespace`, a ConfigMap edit restarts nothing without the config hash, and a `Succeeded` pod reopens its stream twice a second.](/shipping-log-pipeline.png)

## The Payment Rail

I started on Stripe, which is not available to a Philippine individual the way I needed and carried fees I did not want to absorb. I looked at Xendit, then moved the provider seam to PayMongo. Alot of back and forth plus research when to this and ultimately I landed on PayMongo.

![Paper path through the payment rail: Stripe screened out for a Philippine individual and its fees, Xendit researched and passed over, PayMongo verified and live. Three gates: Subscriptions support-enabled, Card Vaulting support-enabled, and plan creation returning 403. Live methods: `paymaya` and `card` refused without a registered business type, InstaPay QR and e-wallet shipped.](/shipping-rail-path.png)

The app asks only QR rails because other payment method can only go live with a registered business type. So the rail I shipped renders an InstaPay QR then after that I scanned it with GCash, and 99 pesos moved. The signed webhook landed, the `subscriptions` row wrote, and the app flipped to paid and it confirmed that it worked.

## What The Tooling Cost

Checking any of this in a browser meant plumbing. Three MCP servers ended up in `.mcp.json`: the Playwright browser server, Neon over HTTP with its key read from `.env` at connect, and Grafana from its image with stdio forced because it would not stay on the wire otherwise.

The Playwright server comes from nixpkgs through the flake instead of npx, wrapped with its own browser path, so the command only resolves inside the dev shell. The committed scripts have the mirror problem: they need `playwright-core` and a chromium out of `/nix/store`, and a hardcoded path dies the next time something is garbage collected. A small resolver finds both at runtime.

The browser part is not a test suite I run. It is a skill the agent runs. It opens the real app, clicks through it the way a person would, and reads back what the page actually shows, and in one session it loaded and re-read that page 47 times. That is how it found duplicate date labels on the analytics chart, four ticks for fifteen runs, and a checkout bug that had been there since the payment rail shipped. Every earlier test took a stand-in path and never touched the real checkout. It also withdrew two of its own reports that turned out to be wrong, which is the part I trust most.
The order is written into the skill: the real browser and the accessibility tree give the verdict, a canned runner runs as-is for its PASS/FAIL line, a failing runner is a dead end, and editing one needs an explicit ask.

## What I Deleted

Staging was a real second environment: its own Neon project, Infisical environment, Terraform root and state key, namespace, ArgoCD Application and frontend image. The SPA inlines the Clerk publishable key at build time, so a second Clerk instance needs a second artifact. I deleted staging two days after I finished it.

The trap was inheritance. A prod database endpoint inherited into staging would point the pods at production and let the PreSync migration job run there, and an inherited payment key would put live billing credentials in a rehearsal environment. Both modules carried guards refusing the other environment's endpoint. What staging actually cost was about 30 secrets kept in sync by hand, a second consumer of a per-project Neon quota, and a class of typo that needed those guards. There were no users to protect and no team to review against, so it went. ADR 0003 records the rebuild path in order and the mistakes. That document is the difference between a decision and a thing I have to remember.

Sentry went in the same session I wired it. Without sourcemaps the stack traces are decoration, and 146 kB gz on every signed-in load is a lot of weight for an issue feed nobody reads yet. The one leg Sentry held alone is mine now: a render crash swallowed by the error boundary never reaches `window.onerror`, so the boundary reports the error by hand through the backend route. Sentry comes back when there are real users and a decision to publish sourcemaps.

The browser speech engines went because a generic voice is worse than no voice when the interviewer is the product.

![Paper comparison of the three deletions. Staging was a second environment that cost about 30 secrets, went because there were no users and no team, and left ADR 0003 behind as the rebuild path. Sentry was the error feed that cost 146 kB gz on every signed-in load, went because there were no sourcemaps, and the error boundary beacon remains. Browser speech was the fallback voice, cost a generic voice, went because a generic voice is worse than no voice when the interviewer is the product, and Whisper and Aura remain.](/shipping-deleted.png)

## The Interview Loop

One run is the whole loop. A candidate creates it, the interviewer's opener streams in, and they answer turn by turn. The run carries state, and the transcript holds one reply per user turn, so each annotation in the review has exactly one answer under it. The review comes back with ten scored dimensions, a verdict, tips and an annotation per answer.

Voice is not a second pipeline. A typed answer and a spoken one go through the same SSE chat route, which is the point. Speech-to-text is whisper-large-v3-turbo, and its transcript lands in the answer box. The other direction is Aura-1, one line at a time, with a sentence chunker at 140 then 320 characters and a playback queue that fetches the next line while the current one plays. Both directions pass one gate at `GET /api/voice` and draw from a shared 10,000 neuron daily budget.

![Paper voice path. The mic records one take with a 180 second cap and live meter; POST /api/voice/stt sends it to whisper-large-v3-turbo; the transcript lands in the answer box and goes through the same SSE chat route as typed text. A sentence chunker splits at 140 then 320 characters, POST /api/voice/tts asks Aura-1 for one request per line, and the playback queue fetches the next line while the current one plays; the caption reveals up to the spoken line. Two constraints: the voice gate at GET /api/voice controls both, and a shared 10,000 neuron daily budget caps Whisper and Aura.](/shipping-voice-path.png)

---

# Conclusion

Staging went because a one-man project with no users does not need a rehearsal target. Sentry went because its own gap list killed it. The browser speech engines went because a generic voice is worse than no voice.

What is still open: a registered business type, the only thing left between here and cards on the live rail; an evaluation suite over the stored interviews, frozen as fixtures and asserted before every prompt edit; caching and a job queue, overengineered for a product with no users and also the part I want to build; and provider-managed recurring, waiting on PayMongo.
