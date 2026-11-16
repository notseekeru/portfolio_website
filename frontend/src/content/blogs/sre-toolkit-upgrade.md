---
title: SRE Toolkit Upgrade
date: 2026-10-24
description: Second pass at the SRE toolkit, and the load test I promised in June done with the tools I should have started with.
github: https://github.com/notseekeru/maxterview_website
---

# Summary

Maxterview, my personal project I benchmarked to have those juicy numbers.

It runs on one Raspberry Pi 5 with one replica, no autoscaler, and a Neon database in another region. I did not know what load that holds, and I had no honest way of finding out, so I wrote the experiment down first and ran it afterwards to fix it.

![Paper stack diagram in five zones. Driver: k6 on the laptop with its SLO gates at p95 under 1s, p99 under 5s and errors under 1%, and a per-level readout in CSV and Grafana. Reach: Tailscale is the only hop, then the backend NodePort, which bypasses ingress and the edge. Pi 5 running k3s: one maxterview API pod with one worker, one replica, a 256Mi limit, pool 10 to 40 and the model stubbed; Prometheus scrapes it for the dashboards; ArgoCD applies the pool value from gitops; two notes hold the scope: one replica with no autoscaler and no failover, and one identity so cleanup has a single owner. Database: Neon Postgres on the prod branch in another region, reached on its direct host and not the pooler, compute 0.25 to 1 CU, two or three queries per request, and a warm SELECT 1 at 37ms inside the pod. Edge: Cloudflare, the tunnel and ingress NGINX on the production path, not measured.](/sre-sweep-stack.png)

---

## The Sequel I Owe From June

[SRE Steps](https://portfolio.seekeru.tech/blog/sre-steps) ended with a promising part 2 of my observability experiment: the same outage experiment under load, "concurrent user load profiles using Locust", published once it was done and I was satisfied with my learning and result. I used Locust quite a bit after, and it was a decent experience: easy, customizable, and it just works. But this is that part three of this experiment and now it's a different repo and a lil bit more sophisticated tooling. This is gonna be a blast and I am here ready for it even if that blog or work was months ago.

The gap between the two posts is the thing to admit first. Back then I generated traffic with curl or locust loops and called it a load test. It did what I needed it to do, which was prove that a dashboard moves when traffic moves, and it left me with no idea what my own machine holds. Worse, I could not defend those numbers months later, because nothing in an improvised script records what it measured and what it meant.

So the specification, order, and knowledge came before any run this time. How do I actually benchmark and measure an application, at what load does prod stop behaving acceptably, and which resource runs out first. Three questions, and every table below exists to answer one of them.

![Paper comparison of June and October. June was SRE Steps: curl and locust loops, a dashboard that moves, no record and no ceiling. October is this sweep: the spec and its refusals, gates stated first, the boundary read off the CSV at 55 VUs and 70 rps. The footer names the three questions.](/sre-then-now.png)

## Planning of Specifications

The spec took a week, and it was a lot of thinking. I ran the plan past ChatGPT, Gemini and DeepSeek in parallel(all webui), off the same inspiration that started this thread, Arjay McCandless's $12 VPS load testing series, and then had each one audit what the others produced.

That is how the things that do not belong in a capacity test got removed before they could cost me a sweep. A seed script that would have written rows the test then measured. A latency swing against the real model, where the ceiling becomes a cloud provider quota instead of my own box. Which endpoint should stand for the product without contaminating the rows the next window measures.

The week was not spent deciding whether to load test. It was spent on questions with no cheap answer: measure through localhost, through Tailscale, or let Cloudflare into the path and then explain how much of the number is edge latency and how much is bot fight mode. Whether NvidiaNIM's quota or Workers AI's neurons would stop the run before my pod did. How much Neon compute the sweep would spend, since it runs against prod's own branch. Which endpoint actually stands for the product. Which numbers were worth capturing at all. The spec that came out of it reads more like a list of refusals than a plan, and that is the compliment I would pay it.

The useful part was not the agreement. Where two of them contradicted each other I had to open the app and read the code, and that is the moment the spec stopped being a model's answer. By the time I ran anything, three other models had already tried to grill my plan and architecture.

I set the SLO myself, because the number is only meaningful against a stated bar.

| Indicator   | Gate                    |
| ----------- | ----------------------- |
| p50 latency | reported, none          |
| p95 latency | under 1s                |
| p99 latency | under 5s                |
| error rate  | under 1%                |
| throughput  | reported, none          |
| correctness | whole session completes |

Correctness is the half I would not drop. Latency says nothing about whether an interview actually finished, so every iteration walks a session end to end: the run was created, the opener streamed to the browser, the transcript holds one reply per user turn, the run closed cleanly, and the graded review came back. A fast reply with a dead stream is a failed request, and p95 will never tell you.

Throughput is reported and never gated, because a level fixes the VUs and the RPS falls out of the app's own latency. A gate there would fail a level for answering slowly, which p95 already does.

The model routes sit outside the latency gates for the same reason the alert rules exclude them. With the model stubbed, the ceiling there is a vendor's quota, not my Raspberry Pi.

![Paper map of the spec paths: three candidates, localhost, Tailscale marked as the one used, and the Cloudflare edge that adds edge latency and bot fight mode. Three refusals: a seed script that writes the rows, the real model that turns the ceiling into a vendor quota, and a wrong endpoint that contaminates the next window. The footer says the models audited each other, disagreements sent me to the code, and the spec reads like a list of refusals.](/sre-spec-paths.png)

## The Sweep

A sweep is the whole experiment, and it walks levels: 10 VUs, then 20, then 100. A level is a stage at one VU target: a 30 second ramp, a 60 second hold, then a 3 minute measurement window. Only the window counts. Gating a ramp measures the ramp.

![Paper flow chart of the sweep. Open the perf window in gitops, clean up the sweep identity's rows, then a 10 VU smoke. A failed smoke aborts. The ladder runs 100 VUs and doubles; a failed SLO goes to a binary search, then three 5 minute confirmation windows, then the boundary read off the CSV and Grafana, then the window closes. A failed confirmation returns to the search. When no levels are left, the ladder stops and raises the VU ceiling.](/sre-sweep-flow.png)

The smoke is the rig's own check and it is not optional. Ten VUs for ten seconds, before any ladder, and a failure there aborts the sweep because the app or the generator is broken and no number after it means anything.

The one time I skipped it, I turned a sixteen second check into a five minute failed level and spent the rest of the night reasoning about a capacity result that was really a broken run. It is the cheapest lesson in the post.

Between levels the sweep waits 60 seconds: fifteen of silence, up to thirty of cleanup, fifteen more. That gap stays inside the driver's idle timeout and inside Neon's scale to zero, so the gap costs neither the pool nor the compute wake. The cleanup runs under the sweep's own account, which is why every level starts from the same one.

## Local Benchmark

Before touching prod I ran the whole workload on my laptop against the docker containers, and it passed at 100 VUs, a run I did not record, so it is not in the table. So I went in expecting a number in the hundreds, on hardware far worse than the machine I deploy on, and prod failed the very first 100 VUs.

| Target | VUs | Window | p50   | p95    | max   | rps  | Verdict |
| ------ | --- | ------ | ----- | ------ | ----- | ---- | ------- |
| laptop | 10  | 10s    | 2.4ms | 11.6ms | 288ms | 54.0 | pass    |
| prod   | 10  | 3m     | 155ms | 654ms  | 2.80s | 16.7 | pass    |
| prod   | 20  | 3m     | 205ms | 1.25s  | 17.6s | 21.6 | fail    |
| prod   | 100 | 3m     | 1.17s | 3.44s  | 8.54s | 38.3 | fail    |

Three of my instincts were wrong in the same direction. I blamed my own setup, maybe there something wrong with k6, or could be somethign wrong with my configuration wiring.

## Some optimization decisions

I went looking for a slow query and there was none. The slowest statement stayed under 2.12s at p99, which cannot explain a 17.6s max at 20 VUs.

The slow end was routes paying several round trips in a row, each one its own checkout from a pool of ten. Analytics at 4.8s p95 across five sequential queries. Templates at 3.8s with a seed write before its read. Usage at 2.9s across two.

So the fix was never the queries. Six changes, all of them on round trips, read size or the pool:

| Change          | Before                    | After                          |
| --------------- | ------------------------- | ------------------------------ |
| Analytics page  | five checkouts            | one statement                  |
| Templates page  | a seed write, then a read | the read, seeded only if empty |
| Usage page      | two checkouts             | one                            |
| Interview list  | every run the owner had   | 50 per page, archived filtered |
| Home counters   | derived in the browser    | one statement                  |
| Connection pool | 10                        | now a setting                  |

The list read is the one I want to be honest about. It grew inside every window, 159 rows at 10 VUs, 241 at 20, 415 at 100, and it was never the slowest route in the report. Pagination shipped because the code was wrong, not because a measurement earned it. The N-sweep that would have settled it never ran.
The order between those two was deliberate. A `LIMIT` and an `OFFSET` is a change to a query I was already making. I thought about Redis, but Redis is a second compute to keep alive and a cache to invalidate, and it never appears in the same step as a missing `LIMIT`.

There is a second reason it stayed out. If I had added a cache before the first run, I would never have known what the app costs without it, and every number after that would be a number about my cache instead of my product.

Not having it also gave the pool something to reveal, which is the next section.

## The Pool Changes

After that, the bottleneck moved to the one place the app could not fix: the pool configurations

At 20 connections and 100 VUs, 505ms of a 719ms p50 was spent waiting for a connection, while the mean query time stayed flat between 97 and 116ms across every window at 10 and 20 connections. The database never slowed. The queue formed because a request's two or three queries arrive in a burst, and ten or twenty checkouts cannot absorb a burst.

Raising the pool to 40 turned 55 VUs from a failure into a pass and cut the wait at 100 VUs from 505ms to 209ms. Raising it to 80 made the app slower at the slow end while removing the wait entirely.

| Pool | VUs | Verdict | p95    | rps  | Wait p50 | Query mean | Memory |
| ---- | --- | ------- | ------ | ---- | -------- | ---------- | ------ |
| 20   | 55  | fail    | 1.096s | 50.0 | 170ms    | 112ms      | 50%    |
| 40   | 55  | pass    | 832ms  | 70.3 | 5ms      | 150ms      | 52%    |
| 40   | 100 | fail    | 1.64s  | 66.7 | 209ms    | 163ms      | 56%    |
| 80   | 100 | fail    | 1.87s  | 75.0 | 6ms      | 248ms      | 74%    |

![Paper comparison of the pool, one row per measurement with a capacity bar scaled to queries a second. Pool 20 at 55 VUs gives 172 queries a second and fails. Pool 40 at 55 VUs gives 245 and passes. Pool 40 at 100 VUs fails with a 209ms wait. Pool 80 at 100 VUs gives 323 and fails, with the wait gone and the mean query up to 248ms. Each doubling buys less, 43 percent then 32 percent.](/sre-pool-tradeoff.png)

Read the two 100 VU rows next to each other. At 80 connections nothing waits for a connection, and the request p95 gets worse anyway, because every query now runs against a busier Neon. The mean query goes from 163ms to 248ms and the pod's memory from 56 to 74 percent of its limit.

Pool capacity is connections over mean query time, so 20 gives 172 queries a second, 40 gives 245, and 80 gives 323. Each doubling buys less than the one before, 43 percent then 32 percent, and the swing and the memory pay for it. A warm `SELECT 1` from inside the pod is 37ms at the median, so co-location could save that floor and could never save the inflation.

Forty ships. The pod's memory is what caps the pool, and Neon's compute is what inflates as it grows.

## What The Boundary Is Worth

| When       | Config                      | Passed once | rps there | First fail |
| ---------- | --------------------------- | ----------- | --------- | ---------- |
| 2026-10-22 | pool 10, before the changes | 10          | 17        | 20         |
| 2026-10-23 | optimized changes (pool 20) | 32          | 50        | 55         |
| 2026-10-23 | pool 40                     | 55          | 70        | 100        |

![Paper ladder on a 0 to 110 virtual user axis. Pool 10 before the changes passed once at 10 VUs and first failed at 20, at 17 requests a second. The optimized changes at pool 20 passed once at 32 and first failed at 55, at 50 requests a second. Pool 40 passed once at 55 and first failed at 100, at 70 requests a second. The note reads 55 is the SLO boundary, not the product ceiling.](/sre-boundary-ladder.png)

55 is the SLO boundary and not the product ceiling. At 100 VUs the error rate stays under one percent and p99 is inside its gate, while p95 and the session check fail. The app keeps serving past the number, it just stops being acceptable by my own definition of acceptable.

A VU is a whole interview compressed into about 21 seconds, which is why the rps number is the one to keep. 70 requests a second is real enough for one Pi with no autoscaler, holding full interviews with a database in another region.

## What This Number Does Not Cover

Every measurement here went through the NodePort on the backend Service, which bypasses ingress, the tunnel and Cloudflare. That answers what my pod and its database can do, and it says nothing about what a real user pays at the edge. The edge sweep is the next run and it will not be comparable to these numbers, which is the point of running it.

One pod, one node, no failover, one fixed traffic shape, and no unit economics anywhere in it. What I have is where it stops, not what an interview costs me to serve.

# Conclusion

What changed is method, not heroics. A spec written before the runs. Gates that fail a level instead of a chart I form an opinion about. A smoke that refuses to let a broken rig become a capacity result. Recording what the number excludes, since the edge, the model and real users are all outside this one.

The three fights I enjoyed were the same three that hurt: keeping the document honest when the evidence moved, reading what the pool numbers actually meant, and building a setup I could trust enough to blame the app and improve it.
