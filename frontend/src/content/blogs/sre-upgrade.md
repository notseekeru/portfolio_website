---
title: SRE Upgrade
date: 2026-10-24
description: The full sweep, end to end. Gates written before the runs, a boundary that moved from 10 virtual users to 650 as the app and the harness changed under it.
github: https://github.com/notseekeru/maxterview_website
---

# Summary

Maxterview runs on one Raspberry Pi 5 with one replica, no autoscaler, and a Neon database in another region. I did not know what load that holds and I had no honest way of finding out, so I wrote the experiment down first and ran it afterwards.

The boundary moved four times, and the Pi never ran out of anything during any of them. Ten virtual users on the app as it was. Fifty-five after six round-trip fixes. A hundred and seventy-five once the harness stopped putting every virtual user on one account. Six hundred and fifty on the TypeScript backend that replaced the Python one. What moved it was the pool, the size of a read and the shape of the harness.

![Paper stack diagram in five zones. The driver is k6 on the laptop with its SLO gates at p95 under 1s, p99 under 5s and errors under 1%, and a per-level readout in CSV and Grafana. The reach is Tailscale as the only hop, then the backend NodePort, which bypasses ingress and the edge. On the Pi 5 running k3s there is one maxterview API pod with one worker, one replica, a 256Mi limit, pool 10 to 40 and the model stubbed; Prometheus scrapes it for the dashboards; ArgoCD applies the pool value from gitops; two notes hold the scope, one replica with no autoscaler and no failover, and one identity so cleanup has a single owner. The database is Neon Postgres on the prod branch in another region, reached on its direct host and not the pooler, compute 0.25 to 1 CU, two or three queries per request, and a warm SELECT 1 at 37ms inside the pod. The edge is Cloudflare, the tunnel and ingress NGINX on the production path, not measured.](/sre-sweep-stack.png)

## The Question

This started from three questions. How do I even benchmark an application, what is the methodology of this kind of experiment, and how much traffic can my Pi hold under a simulated user workload.

## The SLO

| Indicator   | Gate           |
| ----------- | -------------- |
| p50 latency | none, reported |
| throughput  | none, reported |
| p95 latency | <1s            |
| p99 latency | <5s            |
| error rate  | <1%            |
| correctness | check pass     |

I set the pass bar for this architecture and you can use whatever you want. Latency depends on the language and the framework, so the bar is per app and not per machine. A Rust backend and a NodeJS backend aren't comparable runs.

I am not an SRE and I have no professional experience, so keep that in mind. I cannot confirm that what I did is right, not even for my own spec and my own methodology. I present this as documentation of a learning process with verified numbers.

Correctness is the half I would not drop. Latency says nothing about whether an interview actually finished, so every iteration walks a session end to end. The run gets created, the opener streams, the transcript holds one reply per user turn, the run closes cleanly, and the graded review comes back. A fast reply with a dead stream is a failed request.

Throughput is reported and never gated, because a level fixes the VUs and the requests a second fall out of the app's own latency. A gate there would fail a level for answering slowly, which p95 already does.

## Architecture

```
Capacity path, as run
  k6 (desktop or laptop) -> Tailscale -> NodePort 30090 -> pod
  pod -> Neon (direct host, TLS)
  pod -> Alloy (in-cluster) -> Grafana Cloud
```

One path, and it ends in the same pod. No Nginx, no Cloudflare, no tunnel, so the request lands on the pod's socket directly.

Tailscale is the hop because of CGNAT. I can't forward traffic to my box on an IP address, so the load machine joins the tailnet and the Service is reachable on a NodePort over it.

Cloudflare was the first option and I dropped it. Bot fight mode on the free plan reads a sudden spike as someone DDoSing me, and the only lever is an IP Access rule, which disables bot fight mode zone-wide, not just for the runner. Cloudflare would measure production-like latency, and that is a separate experiment, since this one is about SRE principles rather than what a real user feels.

![Paper map of the spec paths, k6 on the laptop through Tailscale into NodePort 30090, then the maxterview pod on the Pi 5 with k3s, then Neon on its direct host, not the pooler, TLS, in another region, with localhost beside it as the app alone, no network, no deploy. Cloudflare edge sits above on a refused over-the-top route that lands on the same pod, because it adds edge latency and bot fight mode to the number, and the only lever, an IP Access rule, disables bot fight mode zone-wide. Three refusals follow, a seed script that writes the rows the test then measures, the real model that turns the ceiling into a vendor quota, and a wrong endpoint that contaminates the rows the next window measures.](/sre-spec-paths.png)

## The Harness

One test sweep. Each measurement writes one CSV row.

![Paper flow chart of the sweep in three zones. The run opens the perf window on the overlay in gitops, reachable on NodePort 30090, cleans up the sweep identity's rows recorded as `deleted_before`, then runs a 10 VU smoke for 10 seconds, where a failed smoke aborts the sweep. The climb ramps 30 seconds and holds 60 seconds ungated, then takes a 3 minute measurement window at phase ladder behind the gates, p95 under 1s, p99 under 5s, errors under 1%, correctness passing. A pass doubles the VUs. A failure goes to a binary search between the last pass and the failure, with a 25 VU floor at phase search. The highest pass is confirmed three times at 5 minutes at phase confirm, and a failed confirmation returns to the search for at most three rounds. Between levels the sweep waits 60 seconds, fifteen of silence, up to thirty of cleanup, fifteen more. The outcome reads the boundary off the CSV and Grafana, then the window closes and cleanup runs.](/sre-sweep-flow.png)

The harness is `~/k6-load-testing`. `main.js` is the workload and `sweep.py` is the ladder, the cleanup and the gates.

The smoke is the rig's own check and it isn't optional. Ten VUs for ten seconds before any ladder, and a failure there aborts the sweep, because the app or the generator is broken and no number after it means anything. The one time I skipped it, a sixteen second check became a five minute failed level and I spent the rest of the night reasoning about a capacity result that was really a broken run.

## Configuration

![Paper rig diagram, the laptop as load generator, k6 on it, with the i7-10610U at 4 cores / 8 threads, 15 W and 16 GB RAM, then the Pi 5 box with 8 GB RAM, four Cortex-A76 cores and k3s, holding the maxterview pod at replicas 1 with no autoscaler, no HPA, no KEDA, a 256Mi memory limit and OTLP to the in-cluster Alloy receiver, and Neon on its direct host, not the pooler, TLS required. The perf window is a switch strip, LLM_BASE_URL unset (stub), RATE_LIMIT off, CLERK_ENABLED false, APP_ENV test, limit-rps and limit-burst raised to 1000000 from the normal 30 rps and 20 burst.](/sre-config.png)

I use k3s because I deploy my sites on my cluster and I prefer the push model. It gives me a commit and a rollback, and a cleaner pipeline than a webhook on Docker. You could use whatever, a compose file or the host itself, which has less overhead since you aren't paying the tax of a scheduler on a four core board.

The perf window is a Kustomize overlay over the base manifests, so switching those values on and off is a light switch. The overlay lives in the gitops repo and ArgoCD reconciles it when my pipeline pushes an image.

This isn't what you should do, especially if you have users on your prod machine. Spin up another namespace, node or cluster, or test on another machine, because testing on prod is not best practice. I do it because my so-called prod site has no users to begin with, and I can afford to run the experiment on the prod pod directly.

## The Tools

![Paper request path, k6 on the desktop or the laptop over Tailscale onto NodePort 30090 of the backend Service, which bypasses ingress and lands on the pod, with ingress-nginx sitting in the k3s zone on the production path, Argo CD applying the Kustomize overlay from git, and out to Neon on prod's default branch, direct host. A telemetry rail runs from the pod through the in-cluster Alloy shipper to Grafana Cloud outside the cluster. The pod is Python 3.14-slim with FastAPI and 1 uvicorn worker, the Dockerfile passing no workers flag, asyncpg to Postgres with yoyo migrations, limits with in-process memory and no redis, structlog writing one JSON access line per request, OpenTelemetry over OTLP HTTP to the in-cluster collector. The side cards are the frontend at React 19 with Vite, TypeScript, Tailwind, Clerk React, axios and recharts, and the harness in ~/k6-load-testing with main.js the workload and sweep.py the ladder and the cleanup.](/sre-tools.png)

I considered running this against a Postgres pod on a PVC in the cluster. That isn't equivalent to production, because the round trip from my backend to Neon disappears, though at my scale that isn't significant. The other worry was the Neon free tier. I did the numbers and it is generous enough for this test without hitting a storage or compute cap.

The sweep runs against prod's default branch, so it spends prod's own budget and the test rows land in a throwaway database on that branch, not in prod's application data. The cleanup between levels keeps that bounded, though it is best effort.

A branch is a different machine, with its own cold start, its own compute size and copy-on-write storage. If the goal is to measure how prod behaves, running on prod's actual compute is more representative than running on a fresh branch, and the alternative is a Secret swap and a second compute for a test that runs occasionally. Every VU is one identity either way. Prod has no users, so there is nothing to isolate, which is a lazy reason and I will call it that.

## What Each VU Does

A virtual user is one person doing one whole interview, plus everything else a signed-in person can reach.

![Paper diagram of what one virtual user does. The totals band runs four numbers across the top, 28 requests, one interview, about 20 seconds, and at a hundred virtual users sixty-something requests a second and about 125 queries a second. The run in order is six step cards, each with one endpoint pill and count badges. The cards are create `POST /api/interviews` at 1 row, start `POST /interviews/{id}/start` at 1 update, opener `POST /interviews/{id}/chat/opening` at 2 stmts, turns `POST /interviews/{id}/chat/send` at 3 stmts per turn and 4 in prod, two to eight turns with one to three seconds of think, finish `POST /interviews/{id}/finish` at 11 stmts, and read back `GET /interviews/{id}/feedback` at 2 stmts. Two chips under the cards say one identity for cleanup, and model stubbed with voice off. The rest of the surface card lists 14 endpoints behind one badge. The two charts count the whole run, HTTP read 6,230 at 46 percent against write 7,405 at 54 percent over 13,635 requests, and SQL read 17,210 at 55 percent, write 12,804 at 41 percent, either WITH 1,558 at 5 percent over 31,572 queries.](/sre-vu.png)

It starts with a create, `POST /api/interviews`, with a role, a topic, a level and the dials. Nothing is authenticated in the perf window, so there is no token to verify and no Clerk round trip.

Then start does one update to `in_progress`, because every chat route refuses a run that is not in progress. The opener comes back as a stream. On the server that call reads the interview, the resume attached to it and the whole transcript in one statement, then asks for a reply and stores it. In the perf window the reply is the stub. It echoes the answer back word by word, with no network and nothing billed.

Then the turns, two to eight of them drawn at random, with one to three seconds of think time between each so the shape looks like a person typing rather than a loop. Each turn is the same `chat/send` with a few hundred characters. On the server that is three statements. Read the interview and the transcript again in one, spend the credit and store the message in one, store the reply once the stub has echoed it. Four in production, where the tier lookup is not skipped. The transcript is re-read every turn and grows every turn, which is why the same route costs more at turn six than at turn one.

Finish does the most work in the run. It flips the status and runs the whole feedback pipeline inside the request, which the harness counts at eleven statements. The grading is the stub too, so the cost of that request is the statements. It isn't a background job, so the virtual user waits for it.

After that the run is read back, feedback then transcript, and then the surface, the part people forget. The interview list, the stats, usage, templates, resumes, settings, the offer, an archive toggle and back, a resume created and deleted, a template created and deleted, and one browser error beacon.

Twenty-eight requests, one interview, about twenty seconds. At a hundred virtual users that is sixty-something requests a second and about a hundred and twenty-five queries a second.

Every virtual user is the same identity and they all share one account. One identity is the first cut because it is one candidate moving through the app, and the cleanup has one owner to delete. A real deployment gives accounts to users, many people at once, so a later stage gives each VU its own identity.

The endpoints that carry generation are outside the run. NvidiaNIM for the model and Cloudflare Workers AI for voice both spend credit, and a vendor quota failing the experiment is a number about the vendor. The model is stubbed and the voice path is off, so a slow model cannot swing the latency I am trying to read.

## What The Reads Cost

I already knew where the gaps in the app were. A GET with no row limit keeps re-scanning the full history, and it grows every window.

Pagination with `LIMIT` and `OFFSET`, and keyset behind it, is the obvious fix, and I left it out on purpose so the baseline shows what the scan costs. Redis was on the list too, and it stays last because it's a different tier, with a second compute, a cache to invalidate and a class of bugs that a missing `LIMIT` doesn't have. So when something is slow, a cache can't be the reflex while a GET with no row limit is still re-scanning the full history.

The cache waited for a second reason. If I had shipped it before the first run, I would never have known what the app costs without it, and every later number would be a number about my cache.

## Between Levels

The sweep warms the database, climbs the ladder, brackets the failure, binary searches, confirms, and records the data. It's automated end to end, so there are no human gaps between levels. Leave the app idle long enough and the asyncpg pool closes its idle connections while Neon returns to scale to zero, then the next level pays to warm both before it takes a single number.

A level is a 30 second ramp to the target VUs, a 60 second hold at them, then a 3 minute measurement window. Only the window counts and only the window is gated. Gating a ramp measures the ramp.

Between levels the sweep waits 60 seconds, fifteen of silence, up to thirty of cleanup, fifteen more. That gap stays inside the driver's idle timeout and inside Neon's scale to zero, so the gap costs neither the pool nor the compute wake. The cleanup runs for thirty seconds under the sweep's own account, which is why every level starts from the same empty footing.

The ladder starts at 100 VUs and doubles. A pass goes up, a failed SLO stops the climb and that failure becomes the top of the range. Then it splits the gap between the last pass and the failure. If 200 passes and 400 fails, it tries 300, then 350. It is a binary search, and what I need is the estimate between pass and fail.

Confirmation re-runs the highest passing level three times at five minutes each and all three must pass, because the last recorded pass can move about 10% and one pass isn't proof. That was the harness for these runs. It changed later.

## The First Run

Before any optimization the app ran with the pool at 10 on the NodePort path. Latency, rps and errors come from the harness. CPU, memory, pool wait and the per-route numbers are Grafana readings over the same windows. The laptop row is compose against the stub. `max` is the measurement window's max latency, because k6's summary did not export p(99) for these runs while the gate evaluated a real p99 inside k6. It exports both now.

| Pod    | Phase   | VUs | Window | p50   | p95    | p99 | max   | rps  | errors | verdict | queries/req | wait p50 | wait p95 | query mean | query p95 | CPU (of 4) | memory (256Mi) |
| ------ | ------- | --- | ------ | ----- | ------ | --- | ----- | ---- | ------ | ------- | ----------- | -------- | -------- | ---------- | --------- | ---------- | -------------- |
| laptop | only    | 10  | 10s    | 2.4ms | 11.6ms | n/r | 288ms | 54.0 | 0      | pass    | n/r         | n/r      | n/r      | n/r        | n/r       | n/r        | n/r            |
| laptop | only    | 100 | 3m     | n/r   | n/r    | n/r | n/r   | n/r  | n/r    | pass    | n/r         | n/r      | n/r      | n/r        | n/r       | n/r        | n/r            |
| prod   | only    | 10  | 10s    | 155ms | 705ms  | n/r | 933ms | 25.6 | 0      | pass    | n/r         | n/r      | n/r      | n/r        | n/r       | n/r        | n/r            |
| prod   | ladder  | 100 | 3m     | 1.17s | 3.44s  | n/r | 8.54s | 38.3 | 0      | fail    | n/r         | 940ms    | 2.40s    | n/r        | n/r       | 0.27       | 52%            |
| prod   | ladder  | 10  | 3m     | 155ms | 654ms  | n/r | 2.80s | 16.7 | 0      | pass    | n/r         | n/r      | n/r      | n/r        | n/r       | n/r        | n/r            |
| prod   | ladder  | 20  | 3m     | 205ms | 1.25s  | n/r | 17.6s | 21.6 | 0      | fail    | n/r         | 35ms     | n/r      | n/r        | n/r       | 0.21       | 39%            |
| prod   | confirm | 10  | 5m     | 149ms | 587ms  | n/r | 3.00s | 16.9 | 0      | pass    | n/r         | n/r      | n/r      | n/r        | n/r       | n/r        | n/r            |
| prod   | confirm | 10  | 5m     | 149ms | 569ms  | n/r | 1.38s | 16.7 | 0      | pass    | n/r         | n/r      | n/r      | n/r        | n/r       | n/r        | n/r            |
| prod   | confirm | 10  | 5m     | 147ms | 496ms  | n/r | 2.01s | 17.4 | 0      | pass    | n/r         | n/r      | n/r      | n/r        | n/r       | n/r        | n/r            |

All those `n/r` are the first harness not recording it. The gate evaluated a p99 inside k6 and the summary did not export it, so the column stayed empty until I fixed it. The next harness fills it.

The laptop passed at 100 VUs, on hardware far worse than the machine I deploy on, so I went into the prod run expecting a number in the hundreds. Prod failed the very first level instead. At 100 VUs the p95 was 3.44s with an 8.54s max, and the error rate was zero.

What surprised me was the machine sitting idle while it failed, at 0.27 of 4 cores and 134Mi of 256Mi.

I skipped the smoke that time and went straight to the ladder, which turned a sixteen second check into a five minute failed level. From then on the sweep smokes 10 VUs first, so a broken rig is caught before the 100 VU ladder starts.

Dropping to 10 VUs passed, so the harness was clean and the app was the problem. The 100 VU run had already finished 348 iterations with every check passing, which I did not read that way at the time. The next level up failed at 20 VUs with a 17.6s max.

One endpoint read every run the owner had, with no limit, and the account grew inside every window. 159 rows at 10 VUs, 241 at 20, 415 at 100. That is a code gap, and it is also a harness gap, because a single identity made one account carry the whole window.

I went looking for a slow query and there was none. The slowest statement stayed under 2.12s at p99, which can't explain a 17.6s max at 20 VUs. The slow end was routes paying several round trips in a row, each one its own checkout from a pool of ten. Analytics at 4.8s p95 across five sequential queries. Templates at 3.8s with a seed write ahead of its read. Usage at 2.9s across two.

## What Changed After The First Runs

Six fixes went in, all of them on round trips, read size or the pool.

| Change                 | What changed                                                                      | Counts   | Layer             |
| ---------------------- | --------------------------------------------------------------------------------- | -------- | ----------------- |
| `GET /stats/analytics` | five checkouts become one statement                                               | 5 -> 1   | Aggregate Queries |
| `GET /templates`       | the read, seeded only when the endpoint is empty                                  | n/r      | Aggregate Queries |
| `GET /billing/usage`   | two checkouts in the window, three to four in prod, become one                    | 2 -> 1   | Aggregate Queries |
| `GET /interviews`      | every run the owner had becomes 50 per page, archived filtered in the query       | n/r      | Aggregate Queries |
| Home counters          | derived in the browser from that list becomes one statement over the full history | n/r      | Request Batching  |
| pool                   | 10 connections becomes 20                                                         | 10 -> 20 | config            |

| Phase   | VUs | Window | p50   | p95   | p99   | max   | rps  | errors | verdict | queries/req | wait p50 | wait p95 | query mean | query p95 | CPU (of 4) | memory (of 256Mi) |
| ------- | --- | ------ | ----- | ----- | ----- | ----- | ---- | ------ | ------- | ----------- | -------- | -------- | ---------- | --------- | ---------- | ----------------- |
| smoke   | 10  | 10s    | 145ms | 239ms | 750ms | 769ms | 29.5 | 0      | pass    | n/r         | n/r      | n/r      | n/r        | n/r       | n/r        | n/r               |
| ladder  | 100 | 3m     | 719ms | 1.90s | 3.26s | 27.0s | 54.9 | 0.08%  | fail    | n/r         | 505ms    | 1.31s    | 116ms      | n/r       | 0.38       | 44%               |
| search  | 55  | 3m     | 353ms | 1.10s | 2.48s | 28.6s | 50.0 | 0.36%  | fail    | n/r         | 170ms    | 491ms    | 112ms      | n/r       | 0.41       | 48%               |
| search  | 32  | 3m     | 163ms | 499ms | 879ms | 2.23s | 50.2 | 0      | pass    | 2.3         | 6ms      | 45ms     | 97ms       | n/r       | 0.39       | 48%               |
| confirm | 32  | 5m     | 173ms | 600ms | 1.14s | 8.99s | 45.4 | 0.08%  | fail    | n/r         | n/r      | n/r      | n/r        | n/r       | n/r        | n/r               |
| confirm | 10  | 5m     | 146ms | 289ms | 427ms | 577ms | 18.5 | 0      | pass    | n/r         | n/r      | n/r      | n/r        | n/r       | n/r        | n/r               |
| confirm | 10  | 5m     | 145ms | 287ms | 416ms | 864ms | 18.5 | 0      | pass    | n/r         | n/r      | n/r      | n/r        | n/r       | n/r        | n/r               |
| confirm | 10  | 5m     | 161ms | 800ms | 2.86s | 19.6s | 12.8 | 0      | pass    | n/r         | n/r      | n/r      | n/r        | n/r       | n/r        | n/r               |
| probe   | 32  | 3m     | 166ms | 558ms | 888ms | 1.75s | 50.1 | 0      | pass    | n/r         | n/r      | n/r      | n/r        | n/r       | n/r        | n/r               |

The list read grew inside every window and it was never the slowest route in the report. Pagination shipped because the code was wrong, not because a measurement earned it.

The order between the list fix and the cache was deliberate. A `LIMIT` is a change to a query I was already making, and Redis is a second compute to keep alive and a cache to invalidate, so the two never ship in the same step.

## What The Bottleneck Was

The sweep above ran with the pool at 20, and at 20 the pool was the wall.

| Pool 20           | 32 VUs | 55 VUs | 100 VUs |
| ----------------- | ------ | ------ | ------- |
| p50               | 163ms  | 353ms  | 719ms   |
| p95               | 499ms  | 1.10s  | 1.90s   |
| p99               | 879ms  | 2.48s  | 3.26s   |
| max               | 2.23s  | 28.6s  | 27.0s   |
| rps               | 50.2   | 50.0   | 54.9    |
| errors            | 0      | 0.36%  | 0.08%   |
| verdict           | pass   | fail   | fail    |
| queries/req       | 2.3    | n/r    | n/r     |
| wait p50          | 6ms    | 170ms  | 505ms   |
| wait p95          | 45ms   | 491ms  | 1.31s   |
| query mean        | 97ms   | 112ms  | 116ms   |
| query p95         | n/r    | 276ms  | 360ms   |
| CPU (of 4)        | 0.39   | 0.41   | 0.38    |
| memory (of 256Mi) | 48%    | 48%    | 44%     |
| queries/s         | 114    | 121    | 116     |
| in flight         | 11.1   | 13.6   | 13.5    |

At 20 connections and 100 VUs, 505ms of a 719ms p50 went to waiting for a connection while the mean query stayed flat between 97 and 116ms across every window at 10 and 20 connections. The database never slowed. The queue formed because a request's two or three queries arrive in a burst, and ten or twenty checkouts cannot absorb a burst.

## The Pool Probes

So I was wondering why I had 1.31s of pool queue wait at p95 at 100 VUs, and raised the pool to see what the wait was worth.

| Pool / VUs        | 20 / 55 | 20 / 100 | 40 / 55 | 40 / 100 | 80 / 55       | 80 / 100 |
| ----------------- | ------- | -------- | ------- | -------- | ------------- | -------- |
| p50               | 353ms   | 719ms    | 218ms   | 498ms    | 216ms         | 482ms    |
| p95               | 1.10s   | 1.90s    | 832ms   | 1.64s    | 820ms         | 1.87s    |
| p99               | 2.48s   | 3.26s    | 1.62s   | 3.43s    | 1.71s         | 4.30s    |
| max               | 28.6s   | 27.0s    | 3.62s   | 59.0s    | 3.87s         | 8.15s    |
| rps               | 50.0    | 54.9     | 70.3    | 66.7     | 71.1          | 75.0     |
| errors            | 0.36%   | 0.08%    | 0       | 0.16%    | 0.008%        | 0        |
| verdict           | fail    | fail     | pass    | fail     | fail (checks) | fail     |
| queries/req       | n/r     | n/r      | n/r     | n/r      | n/r           | n/r      |
| wait p50          | 170ms   | 505ms    | 5ms     | 209ms    | 5ms           | 6ms      |
| wait p95          | 491ms   | 1.31s    | 10ms    | 838ms    | 10ms          | 162ms    |
| query mean        | 112ms   | 116ms    | 150ms   | 163ms    | 124ms         | 248ms    |
| query p95         | 276ms   | 360ms    | 451ms   | 433ms    | 336ms         | 797ms    |
| CPU (of 4)        | 0.40    | 0.39     | 0.54    | 0.52     | 0.59          | 0.64     |
| memory (of 256Mi) | 50%     | 46%      | 52%     | 56%      | 64%           | 74%      |

![Paper chart of six configurations, pool 20, 40 and 80 at 55 and at 100 virtual users, each row a pool wait p95 bar in amber and a query p95 bar in green, both drawn from a zero origin, with the request p95 as its own dashed tick judged against a dashed gate line at 1s. At pool 20 the wait runs 491 to 1310ms while the query stays in the 276 to 360 band. At pool 80 the wait falls to 10 and 162 while the query climbs to 797. The three values are separate percentiles, not parts of a whole, so the bars do not add up to the request p95.](/sre-pool-tradeoff.png)

Read the two 100 VU rows next to each other. At 80 connections nothing waits for a connection, and the request p95 gets worse anyway, because every query now runs against a busier Neon. The mean query goes from 163ms to 248ms and the pod's memory from 56 to 74 percent of its limit.

Pool capacity is connections over mean query time, so 20 gives 172 queries a second, 40 gives 245, and 80 gives 323. Each doubling buys less than the one before, 43 percent then 32 percent, and the swing and the memory pay for it. A warm `SELECT 1` from inside the pod is 37ms at the median, so co-location could save that floor and could never save the inflation.

The boundary after each change, in the order the runs happened.

| When       | Config                      | Passed once  | rps there | First fail |
| ---------- | --------------------------- | ------------ | --------- | ---------- |
| 2026-10-22 | pool 10, before the changes | 10           | 17        | 20         |
| 2026-10-23 | optimized changes (pool 20) | 32           | 50        | 55         |
| 2026-10-23 | pool 40                     | 55           | 70        | 100        |
| 2026-10-23 | pool 80                     | 55 (latency) | 71        | 100        |

![Paper ladder of the whole record on a log axis from 10 to 700 virtual users, seven rungs in run order, each drawn from the last level that passed to the first that failed, with its rps at the right edge. The proven rungs are solid. The two that failed one of their confirmation windows are dashed and labelled with the reason, pool 60, three workers, 512Mi, one of two failed at 250 to 300 and about 220 rps, and pool 40 with per-VU identity failed one at 175 to 187. Pool 80 stands on the same 55 to 100 span as pool 40, 71 rps against 70, so the gain is visibly nothing. The top rung is the TypeScript backend at 650, proven by both confirmations, with 700 as its first fail.](/sre-boundary-ladder.png)

55 is the SLO boundary and not the ceiling of the app or the machine. The app keeps serving past it, because machines do not care about your gates, they answer the request. It just stops being acceptable by my own definition of acceptable. And the pool is not out of the story. In this workload it stopped being the wall, and if the boundary moves again the pool becomes the wall again.

## The Harness Change

| Setting             | The run in this record            | Current harness                               |
| ------------------- | --------------------------------- | --------------------------------------------- |
| Ladder measurement  | 3 min                             | 2 min                                         |
| Confirmation        | 3 runs of 5 min, repeated 3 times | two 5 min windows, both must pass             |
| Failed confirmation | Search below, up to 3 times       | Abort; boundary unproven                      |
| Search resolution   | 25 VU floor                       | 5 VU floor                                    |
| Floor window        | none                              | 2 min of `/health` at 70 rps before the smoke |

![Paper diagram of the current harness in three zones. The run-up is a floor of 2 minutes of /health at 70 rps, then a 10 VU smoke for 10 seconds, and a failed smoke aborts. The climb starts at 100 VUs and doubles behind a 2 minute measurement window and four gates, p95 under 1s, p99 under 5s, errors under 1%, correctness passing. A pass doubles the VUs. A failure drops to a binary search down to a 5 VU floor, and the highest pass is confirmed in two 5 minute windows that both must pass. A failed confirmation aborts with the boundary unproven, a pass reads the boundary off the CSV and Grafana, then the window closes and cleanup runs. The amber strip names the settings that moved. The floor was added at 2 minutes of /health at 70 rps, the ladder window went from 3 minutes to 2, the confirmation from three windows to two, a failed confirmation aborts instead of returning to the search, and the search floor went from 25 VUs to 5.](/sre-harness.png)

I changed the measurement window to two minutes and the confirmation to two five minute runs because the sweep was taking too much of my time, and I'm fine losing some of that data. The shorter windows spend less Neon compute too, and that mattered because the full sweep was paused near the free tier limit. Fewer samples make p95 and p99 noisier, and two runs are weaker proof than three of three, but at my scale I took that trade.

## Batching

To keep track of what I was actually doing when I cut queries, I made my own four layers of batching. They sit at different points between the client and the database, and naming them told me which one a slow route was paying for.

Request batching is one request where several used to go out. Aggregate queries merge several reads into one statement. Bulk write merges several writes into one statement, like spending the turn credit and storing the message together. Group commits group several database writes into one round trip, and I did not use that fourth layer here, because sqlite needs it handled by hand while Postgres writes the log itself and optimizes group commit in the engine.

| Layer             | What gets fewer    | Where it sits      | Generic software example                              |
| ----------------- | ------------------ | ------------------ | ----------------------------------------------------- |
| Request Batching  | HTTP requests      | client to server   | one call for a batch of records, not one per record   |
| Aggregate Queries | SQL reads          | server to database | one query for five reads, not five queries            |
| Bulk Write        | SQL writes         | server to database | one statement for several writes, not one per write   |
| Group Commits     | commit round trips | database writes    | one transaction for several writes, not one per write |

Parallel requests are a separate technique and I would not file them under batching. Two calls run at the same time, and it is not one call carrying both. Nothing about the count goes down, the full network tax is paid for both, and they just stop waiting in line.

## What the Batches Bought

![Paper chart of the three builds at 100 virtual users, pre-batching at pool 40, the batched build and the round-trip build, with five slope charts above nine value rows. In build order the p50 is 498ms, 494ms and 586ms, the p95 is 1.64s, 1.87s and 1.76s, the p99 is 3.43s, 3.78s and 3.04s, the max is 59.0s, 6.45s and 4.17s, throughput is 66.7, 62.8 and 68.5 requests a second, and errors are 0.16%, 0 and 0. Wait p50 runs 209ms, 123ms and 180ms, wait p95 runs 838ms, 570ms and 742ms, the query mean runs 163ms, 150ms and 212ms, query p95 runs 433ms, 462ms and 649ms, CPU of 4 cores runs 0.52, 0.47 and 0.59, and memory of 256Mi runs 56%, 62% and 65%. They're all marked as failures. The first failed on p95 and on the checks, and the other two failed on p95. Queries per request was not recorded for the first build, so that chart draws two points and the other two values are 2.43 and 1.89. Each of the five slope charts is its own scale, so compare direction and not size, and the columns are the three runs in build order, not elapsed time.](/sre-batches.png)

### The batched build

| Change                            | What changed                             | Counts          | Layer                               |
| --------------------------------- | ---------------------------------------- | --------------- | ----------------------------------- |
| `POST /interviews/{id}/chat/send` | one atomic upsert                        | 2 -> 1          | Atomic write                        |
| `GET /stats/dashboard`            | one statement carries both reads         | 2 requests -> 1 | Request Batching, Aggregate Queries |
| `GET /resumes/{resume_id}`        | usage read beside the resume read        | no change       | Parallel requests                   |
| `POST /interviews/{id}/start`     | transcript read beside the start request | no change       | Parallel requests                   |

### The round-trip build

| Change                                    | What changed                                                                                                   | Counts   | Layer                         |
| ----------------------------------------- | -------------------------------------------------------------------------------------------------------------- | -------- | ----------------------------- |
| `POST /interviews/{id}/chat/send`         | duplicate tier read removed, transcript folded into the interview read, spend and user insert in one statement | 8 -> 5   | Aggregate Queries, Bulk Write |
| `POST /interviews/{id}/chat/opening`      | duplicate tier read removed, transcript folded into the interview read                                         | 7 -> 5   | Aggregate Queries             |
| `GET /interviews/{id}/chat`               | ownership check folded into the read                                                                           | 2 -> 1   | Aggregate Queries             |
| `GET /interviews/{id}/feedback`           | ownership check folded into the read                                                                           | 2 -> 1   | Aggregate Queries             |
| `POST /interviews/{id}/feedback/generate` | four guard reads into one SELECT                                                                               | 14 -> 11 | Aggregate Queries             |
| `POST /resumes/{id}/review`               | duplicate tier read removed                                                                                    | 6 -> 5   | Aggregate Queries             |
| `POST /resumes/{id}/review/rewrite`       | duplicate tier read removed, resume and review in one read                                                     | 7 -> 5   | Aggregate Queries             |
| `GET /templates`, cold account            | seed returns the rows it inserted                                                                              | 3 -> 2   | Aggregate Queries             |

I focused on the heavy queries and parallelized where I could, and the latency barely moved. The queries per request fell from nothing recorded to 2.43 and then to 1.89, and the slow end stayed failed. I expected a bigger shift. It did not come because the endpoints I batched are not the endpoints the harness hits most, and the pool was still the wall.

## Per-VU Identity

Every VU sharing one account left one owner holding a lot of rows, and the rows grew every window, which made the queries slower every window. The cleanup window exists, but the window where VUs generate writes is still one person, which is not how a real app and a real user interact.

| Per-VU identity   | 55 VUs | 100 VUs |
| ----------------- | ------ | ------- |
| verdict           | pass   | pass    |
| p50               | 161ms  | 260ms   |
| p95               | 205ms  | 439ms   |
| p99               | 257ms  | 570ms   |
| max               | 707ms  | 1.02s   |
| rps               | 104.9  | 134.5   |
| errors            | 0      | 0       |
| queries/req       | 1.78   | 1.83    |
| wait p50          | 5ms    | 56ms    |
| wait p95          | 10ms   | 217ms   |
| query mean        | 82ms   | 106ms   |
| query p95         | 236ms  | 239ms   |
| CPU (of 4)        | 0.58   | 0.74    |
| memory (of 256Mi) | 40%    | 43%     |
| rows per account  | 15.7   | 11.7    |

The scan-heavy routes stopped being the wall, and 100 VUs passed for the first time in this record.

| Phase   | VUs | Window | p50   | p95   | p99   | max   | rps   | errors | verdict | wait p50 | wait p95 | query mean | query p95 | CPU (of 4) | memory (of 256Mi) | in flight | queries/s |
| ------- | --- | ------ | ----- | ----- | ----- | ----- | ----- | ------ | ------- | -------- | -------- | ---------- | --------- | ---------- | ----------------- | --------- | --------- |
| floor   | 0   | 2m     | 3.5ms | 6.2ms | 44ms  | 131ms | 70    | 0      | n/a     | n/r      | n/r      | n/r        | n/r       | n/r        | n/r               | n/r       | n/r       |
| smoke   | 10  | 10s    | 124ms | 149ms | 149ms | 149ms | 6.8   | 0      | pass    | n/r      | n/r      | n/r        | n/r       | n/r        | n/r               | n/r       | n/r       |
| ladder  | 100 | 2m     | 237ms | 395ms | 608ms | 1.46s | 142.1 | 0      | pass    | 45ms     | 155ms    | 100ms      | 236ms     | 0.76       | 43%               | 26.6      | 266       |
| ladder  | 200 | 2m     | 598ms | 1.08s | 1.42s | 2.38s | 146.9 | 0      | fail    | 377ms    | 913ms    | 94ms       | 235ms     | 0.83       | 49%               | 26.1      | 278       |
| search  | 150 | 2m     | 410ms | 716ms | 914ms | 1.55s | 146.8 | 0      | pass    | 203ms    | 493ms    | 98ms       | 238ms     | 0.80       | 47%               | 26.4      | 270       |
| search  | 175 | 2m     | 510ms | 896ms | 1.15s | 2.00s | 147.5 | 0      | pass    | 353ms    | 792ms    | 99ms       | 236ms     | 0.82       | 48%               | 26.4      | 267       |
| search  | 187 | 2m     | 673ms | 1.12s | 1.39s | 2.62s | 127.0 | 0      | fail    | 425ms    | 963ms    | 117ms      | 242ms     | 0.71       | 48%               | 26.6      | 227       |
| confirm | 175 | 5m     | 474ms | 825ms | 1.09s | 2.27s | 156.2 | 0      | pass    | 338ms    | 793ms    | 93ms       | 236ms     | 0.88       | 48%               | 26.2      | 283       |
| confirm | 175 | 5m     | 561ms | 1.09s | 1.74s | 6.81s | 127.7 | 0      | fail    | 395ms    | 958ms    | 116ms      | 246ms     | 0.70       | 49%               | 26.4      | 228       |

The first confirmation passed and the second failed, so 175 is not proven. The pool came back as the bound at 175, and that is where the next change came from.

## Pool 60, Three Workers

Pool 40 was tuned for 175 VUs and the wall moved again, so 60 went in.

| Pool / VUs | Window | p95          | wait p95     | query p95    | in flight  | CPU (of 4) |
| ---------- | ------ | ------------ | ------------ | ------------ | ---------- | ---------- |
| 40 / 175   | 5m     | 825ms, 1.09s | 793ms, 958ms | 236ms, 246ms | 26.2, 26.4 | 0.88, 0.70 |
| 60 / 175   | 5m     | 796ms, 743ms | 442ms, 434ms | 250ms, 253ms | 36.8, 36.4 | 0.91, 0.91 |
| 40 / 200   | 2m     | 1.08s        | 913ms        | 235ms        | 26.1       | 0.83       |
| 60 / 200   | 5m     | 914ms, 945ms | 646ms, 696ms | 286ms, 292ms | 37.4, 37.9 | 0.91, 0.91 |
| 60 / 250   | 2m     | 1.52s        | 1.63s        | 376ms        | 38.9       | 0.88       |

Then the worker count. Three Uvicorn workers with 20 connections each is not one worker with 60 connections. The scheduler gets three of them to place work in, and it's a config line. The pod limit went to 512Mi so three workers do not OOM the node.

| Phase | VUs | Window | p50   | p95   | p99   | max   | rps   | errors | verdict | wait p50 | wait p95 | query mean | query p95 | CPU (of 4) | memory       | in flight | queries/s |
| ----- | --- | ------ | ----- | ----- | ----- | ----- | ----- | ------ | ------- | -------- | -------- | ---------- | --------- | ---------- | ------------ | --------- | --------- |
| only  | 100 | 5m     | 205ms | 420ms | 549ms | 881ms | 153.1 | 0      | pass    | 6ms      | 54ms     | 120ms      | 282ms     | 0.98       | 65% of 512Mi | 31.9      | 267       |
| only  | 200 | 5m     | 374ms | 763ms | 995ms | 2.34s | 204.6 | 0      | pass    | 182ms    | 528ms    | 109ms      | 241ms     | 1.45       | 64% of 512Mi | 39.3      | 360       |
| only  | 250 | 5m     | 478ms | 796ms | 1.05s | 1.92s | 220.6 | 0      | pass    | 317ms    | 690ms    | 100ms      | 236ms     | 1.61       | 67% of 512Mi | 39.7      | 397       |
| only  | 250 | 5m     | 632ms | 1.09s | 1.38s | 2.87s | 173.6 | 0      | fail    | 397ms    | 906ms    | 124ms      | 281ms     | 1.18       | 66% of 512Mi | 39.9      | 322       |
| only  | 300 | 5m     | 998ms | 1.73s | 2.08s | 3.88s | 144.4 | 0      | fail    | 702ms    | 1.80s    | 154ms      | 431ms     | 0.92       | 67% of 512Mi | 39.7      | 259       |

300 VUs on the Python app failed at p95 1.73s with 431ms query p95 and a 3.88s max. That is the last Python number in this record.

## Neon From The Local Postgres

Neon usage kept running out, so I compared a local Postgres against Neon at the same levels to get a factor I could multiply by.

| VUs | Neon | local p95 | Neon p95 | factor | local wait p95 | Neon wait p95 | local query p95 | Neon query p95 | local verdict | Neon verdict |
| --- | ---- | --------- | -------- | ------ | -------------- | ------------- | --------------- | -------------- | ------------- | ------------ |
| 100 | 1 CU | 203ms     | 420ms    | 2.07x  | 9.5ms          | 54ms          | 48ms            | 282ms          | pass          | pass         |
| 200 | 1 CU | 550ms     | 763ms    | 1.39x  | 9.8ms          | 528ms         | 100ms           | 241ms          | pass          | pass         |
| 250 | 1 CU | 981ms     | 796ms    | 0.81x  | 123ms          | 690ms         | 167ms           | 236ms          | fail          | pass         |
| 300 | 1 CU | 1.42s     | 1.73s    | 1.22x  | 297ms          | 1.80s         | 172ms           | 431ms          | fail          | fail         |
| 300 | 2 CU | 1.42s     | 1.30s    | 0.91x  | 297ms          | 1.03s         | 172ms           | 248ms          | fail          | fail         |

The factor is not a constant. Co-location removes the round trip, and past 200 VUs the wait for a connection on Neon is what the local box does not pay, 528ms against 9.8ms at 200. Doubling Neon's compute did not move the gate at 300 either.

## The TypeScript Run

The migration went smoothly, and it felt like the previous application.

![Paper diagram of the port, two stacks facing each other with the python backend on the left and the typescript backend on the right, ten rows each, and a seam of five pills down the middle, each sitting on the row it serves and joined to both stacks by one solid line, holding the five things that crossed unchanged. Those are the pool ceiling of 20 per process, the Postgres database and its schema, yoyo's tables and hashes, the OTLP trace and metric endpoints with the 60s interval, and the 120 per minute limit. Every row on the right is a replacement. Python 3.14 slim to node 24 slim, FastAPI and uvicorn on port 8000 to Hono 4.13 on the config port, three uvicorn workers at a pool of 20 each, 60 connections in all, to one node process at 20, asyncpg to postgres.js, yoyo-migrations to a hand-written runner, structlog to pino, the OpenTelemetry SDK to sdk-node, limits to a fixed window in a Map, pydantic 2 to zod 4.6, and a uv venv with pytest to a tsc build with vitest.](/sre-port.png)

| Phase   | VUs | Window | p50    | p95   | p99   | max   | rps   | errors | verdict | wait p50 | wait p95 | query mean | query p95 | CPU (of 4) | memory |
| ------- | --- | ------ | ------ | ----- | ----- | ----- | ----- | ------ | ------- | -------- | -------- | ---------- | --------- | ---------- | ------ |
| ladder  | 100 | 2m     | 12.9ms | 47ms  | 184ms | 2.18s | 316.0 | 0      | pass    | 5ms      | 9.5ms    | 4.6ms      | 30ms      | 0.71       | 82MiB  |
| ladder  | 200 | 2m     | 72ms   | 138ms | 209ms | 1.15s | 497.2 | 0      | pass    | 5ms      | 9.6ms    | 28ms       | 77ms      | 1.08       | 98MiB  |
| ladder  | 400 | 2m     | 263ms  | 463ms | 1.22s | 5.64s | 570.3 | 0      | pass    | 10ms     | 148ms    | 91ms       | 226ms     | 1.10       | 114MiB |
| search  | 600 | 2m     | 384ms  | 525ms | 694ms | 18.4s | 620.7 | 0      | pass    | 170ms    | 253ms    | 99ms       | 228ms     | 0.73       | 233MiB |
| search  | 650 | 2m     | 424ms  | 700ms | 1.64s | 16.2s | 617.7 | 0      | pass    | 192ms    | 443ms    | 100ms      | 230ms     | 1.11       | 147MiB |
| search  | 700 | 2m     | 464ms  | 973ms | 2.69s | 17.9s | 605.5 | 0.007% | fail    | 175ms    | 451ms    | 90ms       | 227ms     | 1.15       | 145MiB |
| confirm | 650 | 5m     | 425ms  | 571ms | 690ms | 17.9s | 630.2 | 0      | pass    | 190ms    | 435ms    | 101ms      | 230ms     | 1.12       | 157MiB |
| confirm | 650 | 5m     | 454ms  | 632ms | 844ms | 10.9s | 604.1 | 0      | pass    | 199ms    | 456ms    | 105ms      | 232ms     | 1.10       | 169MiB |

650 VUs passed twice at five minutes, and 700 failed on p95 at 973ms with 0.007% errors. That is two to three times the 250 I had on the Python app, on the same board, with the same database in another region. Both confirmations passed, so 650 is proven by my gates, unlike 175.

## What This Number Does Not Cover

Every measurement here went through the NodePort on the backend Service, which bypasses ingress, the tunnel and Cloudflare. That answers what my pod and its database can do, and it says nothing about what a real user pays at the edge. The edge sweep is the next run and it will not be comparable to these numbers, which is the point of running it.

One pod, one node, no failover, one fixed traffic shape, and no unit economics anywhere in it. What I have is where it stops, not what an interview costs me to serve.

# Conclusion

This is probably where I would end it. Neon is hitting my wall on the production database since it caps its compute and stuff, so I'm already having a hard time passing it. So that quite means that my capacity is limited on Free-tier cloud compute. And honestly, I don't have a problem with that since it's quite expected that if you're gonna hit a wall with the cloud, it will probably be the free-tier limits if you're in one. I could've optimized it more on reads and writes and stuff, but I'm quite satisfied with the results, and all I wanted was to see how far my app and benchmarking got me. If I hadn't done this, I wouldn't even know whether the pool was the bottleneck, whether the app was the bottleneck, whether the rewrite actually moved the capacity, or whether the batching actually worked or what. I learned a lot along the way, and that's why I definitely messed up on some parts during the process. But the point was never making it perfect; shaping me into a better engineer was one of the leading goals.
