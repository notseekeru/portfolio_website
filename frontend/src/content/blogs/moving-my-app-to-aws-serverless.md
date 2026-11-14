---
title: Moving My App to AWS Serverless
date: 2026-11-08
description: I moved a real app to AWS serverless to learn how it works. one EC2 box, Lambdas, and a queue for the slow work.
github: https://github.com/notseekeru/terraform
---

# Summary

I moved a real app to AWS serverless because I wanted to learn it, not because the old setup was broken. One small box holds the Cloudflare tunnel, nginx and the outbound NAT, and four Lambdas do the work. There is no ALB, no NAT gateway, no CloudFront and no ACM. Cost decided the design, and the trade is that one box is a single point of failure.

---

## The 3-Tier I Built In August

Earlier this year I built a 3-tier stack. An ALB in front of an ASG, a private RDS, S3 behind CloudFront, and a certificate I validated through a CNAME by hand. It ran, and the plan was clean every time I destroyed and re-applied it.

![The August three-tier stack: a browser resolves Cloudflare DNS to an ALB with an HTTPS listener and an ACM certificate, forwards to an ASG of one to three t4g.micro nginx instances, then to a private RDS PostgreSQL instance. A separate static path goes from the browser to CloudFront to a private S3 bucket through origin access control.](/aws-three-tier-legacy.png)

The problem was not that it failed. It was that two app instances behind an ALB, plus a CDN, plus a certificate, is a lot of infrastructure to keep alive for one app. It was a rehearsal, not a system I would run, so I stopped treating it like one. I so ditched it, didn't really feel proud of it mostly since it was hand-crafted with AI prose during the process held control most of it.

Now I just noticed that, the design it gave me was kinda lowkey trash and so discarded it since it didn't fit what I wanted which was something like a event-driven serverless architecture. And so I set the plan in motion it to design it myself, assesing tradeoffs and optimization, and just really honing in why that service fits into my stack that I run.

## What I Wanted To Learn

Two things. How AWS managed pieces behave when they are the actual product instead of boxes in a diagram. A Function URL instead of a load balancer, a queue that handles its own retries, a schedule that is one line of Terraform. And how event-driven work feels, since a queue means the request can finish before the work does, and a dead letter queue is where the work that failed sits so I can look at it later.

## How It Is Wired

![Paper-coloured architecture diagram. A browser reaches Cloudflare, which tunnels to one t4g.micro edge instance running cloudflared, nginx and NAT. The edge serves a static build synced from S3, runs no app containers, and proxies /api to the API Lambda's Function URL. Inside the VPC, the API writes to a private RDS PostgreSQL instance and enqueues work on an SQS review queue; a worker Lambda consumes the queue and writes to RDS, retrying three times before the dead letter queue. A migrate Lambda runs schema changes on apply. Outside the VPC, EventBridge fires a probe Lambda every five minutes against /api/healthz. CloudWatch alarms on Lambda errors, DLQ depth and EC2 status notify an SNS topic, which emails you; AWS Budgets notifies the same topic. Terraform holds the whole stack; SSM Parameter Store and ECR sit below the VPC for cold-start config and images; and a footer lists what the design leaves out, with icons for an ALB, a NAT gateway, CloudFront, ACM and warm standby.](/aws-serverless-flow.png)

The box takes traffic in and lets the private subnets reach the internet. Cloudflare's tunnel ends there, nginx answers, and the API Lambda is reached through its Function URL.

I had NAT filed as a detail in my first pass, then had to correct myself. The worker needs RDS, RDS is private, so the worker has to sit in the VPC, and once it is in the VPC something has to carry its outbound traffic. That something is the box, and it is why the cheapest version still has one piece I cannot remove.

## Workaround

If you guys don't know a ALB and NAT Gateway are, they are managed appliances AWS keeps running inside your VPC, and both bill the same way. A fee for existing every hour, then a fee for the work they do.

But what they do essentially is first NAT is like the outbound gateway which is like when you need to connect outside. So when your services needs to access somewhere public out of your VPC, for example your private vpc like inside a lambda needs to call another api then it will need an outbound connection to request for that api, and that becomes hard specially if your lamda is in a private vpc.

Second is the ALB which is the inbound gateway which is like the intake of your traffic. So when someone opens your app the request lands there first before it reaches anything inside the vpc, then it reads the host and the path so it knows which service is being asked for, checks if the targets behind it are healthy, and hands the request to one of them. And that is basically the whole job, and it does it the entire time it exists, so even with nobody using your app it is still there and still charging by the hour, and then it adds capacity units on top for the connections, the requests and the rule checks it had to do.

| Piece       | Per hour | Per month | What you get                                                                  |
| ----------- | -------- | --------- | ----------------------------------------------------------------------------- |
| ALB         | $0.0252  | $18.40    | inbound gateway, plus capacity units for the connections and rules it handles |
| NAT gateway | $0.059   | $43.07    | outbound translation, plus $0.059 for every gigabyte both ways                |
| t4g.micro   | $0.0106  | $7.74     | tunnel, nginx and NAT in one box                                              |

An ALB in Singapore is $0.0252 an hour before a single request arrives, which is around $18 a month for a load balancer doing nothing.

The NAT gateway is worse. Same region, $0.059 an hour, about $43 a month, plus $0.059 for every gigabyte that passes through it in either direction. It translates private addresses into one public address, and it charges more per month than the instance that replaced it.

So the comparison stopped being close. One t4g.micro is $0.0106 an hour, about $7.74 a month, and it holds the tunnel, answers nginx and routes the private subnets, which is three jobs for less than the NAT charges to do one.

![Paper cost comparison. An ALB at $18.40 a month and a NAT gateway at $43.07 a month total $61.47 for both jobs, against one t4g.micro edge instance at $7.74 a month that runs cloudflared, nginx and the NAT. Two bars scaled to the monthly cost put the edge at a small fraction of the pair.](/aws-cost-comparison.png)

No NAT gateway, no ALB, no CloudFront, no ACM, so the fixed cost is one EC2 instance and the Lambdas bill for what they use.

But ofcourse there is a tradeoff. A reboot is an outage for ingress and outbound traffic, nothing fails over because nothing can, and the probe had to live outside the VPC, because its whole job is noticing that the edge is the broken part and it cannot do that from inside the network the edge carries.

But here is the thing about a lambda, it only runs when something calls it, so it cannot keep a tunnel open, it cannot listen on a port, and it cannot be the next hop in a route table, which means the way into this stack needs a process that stays alive the whole time. That is the hybrid part, one box that never sleeps at the edge and then the event-driven functions behind it doing the actual work.

Keeping the app off that box is the other half of it, since a burst cannot take CPU away from nginx, and a worker that dies mid-job loses nothing because the queue still holds the message. This is important to separate compute because the EC2 might crash because it shared the same machine from the app. I mean it's not just that but I just wanted some decoupling since I feels cleaner that way and follows my pattern of like having a clean and understandable architecture.

## Why There Is No Failover

Currently the database is `multi_az = false`, the edge instance lives in one availability zone, and both private subnets share one route table whose default route points at that same box. So an AZ event or one bad reboot takes ingress and egress down together, and the second subnet does not help.

And that is a choice, not something I forgot. Failover is a monthly bill for something that sits idle basically all the time, because a multi az rds doubles the database, a second nat box doubles the edge, and then something has to sit in front and decide when to move traffic, which is the load balancer I already removed from this design.

So rebuild is my failover. The stack is in Terraform end to end, so and recovery from snapshots is a re-apply from terraform. The fresh boot is kinda like a cold start so instead of a warm standby running next to me for a year, I chose recovery time over uptime, and I would rather pay once during an incident than every month for capacity I never really use but this is just basic tradeoffs.

Multi-region is the same argument one level up. A second region is a second copy of the database, the images, the parameters and a tunnel pointed somewhere else, and none of it gets exercised until I start needing.

And beside, if I wanted I could just turn on some few buttons to turn on multi-az and failovers and vuala I can now write to my resume that seemingly "Architected Multi-az failover full stack application system" like dude that is something you don't even manage because you're on aws.

# Conclusion

What I got out of this is a stack I can read line by line. I know what each piece does, what it costs, and what happens first when it breaks. There was alot of details and thought process I didn't put out since I didn't wanna make this blog long but if you want to talk about it then you can contact me through my social media links, Thanks for reading!
