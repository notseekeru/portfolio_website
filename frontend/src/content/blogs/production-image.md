---
title: The Production Image
date: 2026-03-12
description: How I managed Infastructure using Containerized Cloudflare and Raw Nginx Conf
image: /blog/prodscreenshot.png
---

# Summary
Migrated a fragmented, Vercel-dependent frontend and local backend into a Hardened, Self-Hosted Proxy-Chained Infrastructure. The system now utilizes centralizing traffic management at a single L7 Gateway while isolating application services into distinct Network.

## Docker Production
- **Problem:** My windows my quite running out of space when I had my non multistage image taking up my space(around 1GB per image). This was quite a worrysome for me since I was migrating this to my Rasberry Pi. 
- **Docker Scout:** Conducted CVSS security using docker scout to spot out vulnerabilities of images, and fixed doable easy fixes. Used a smaller image of distros and locked the version of images for lower attack surface. (noted that not all vulnerabilities are fixable and worth fixing)
- **Docker Files:** Used multistage dockerfile to seperate base, dev, build and prod docker builds. This asses bloated images, seperated unused dependencies from dev to prod and helps with setting up root and nonroot user.
- **Docker Compose:** Shifted from using one for all compose file for a dev and production compose file to a well defined seperated compose files utilizing seperation eg. base compose, dev and prod compose.

## Nginx Shift
- **Problem:** Vercel commercial uptime and for its control is overpriced.
- **Nginx Raw Conf:** Made the decision to eliminate nginx proxy manager as a solution and introduced raw nginx conf to the server project to handle traffic of my websites.
- **Control and uptime:** I now manage server uptime, control and configuration in my very own workspace.

## Infastructure Debugging && Troubleshooting
- **Problem:** I faced a ton of problems I had to debug myself, this involved alot of things since I second to and used AI and Github repos to just essentially kinda copy paste my nginx raw conf. This introduced alot of networking issues for connection networks inside my dockerize container and some internal project code flaws.
- **Docker Network:** Very diffucult to understand but I managed to apply solutions to these problems that were essential in building this infastructure.
- **Nginx AI File:** This one was probably one of the hardest thing to solve since it was my first time using nginx, It really troubled me specially when I told an AI who was on dangerously-on-skip-permissions to WRITE me some boilerplate code on my raw conf files in nginx, The prompt was quite vague and I didnt tell them to test the code to work. The AI wrote the code but tested it and ran powershell commands and made the file UTF-16 (which is supposed to be UTF-8). This confused me, had a hard time to debug.
- **Internal Project Code:** Code inside projects itself need to be added and manipulated for sustaining nginx, This code usually involves adding raw nginx.conf in the project folder and some backend server code and environment variables for connecting the project all together.

## Networking Wiring
- **Tunnel:** Cloudflare Tunnel (Zero Trust), to satiate CGNAT bypass and security measures (eg. removing the need to port forward).
- **Reverse Proxy:** Nginx Gateway (L7 Dispatcher)
- **Isolation and Connection:** Isolated Docker Networks (`n8n_network`, `portfolio_website`)
- **Strategy:** All Cloudflare traffic hits `gateway:80`. Nginx handles the "Smart" routing to internal services. This eliminates the need to connect a ton of cloudflare connectors. This also reduces cloudflared instance and reduces use of resources which are crucial for low end computers such as Rasberry pi that I plan to host it on.
- **Architectural Value:** Centralized logging, SSL/TLS termination, and security header injection.

## AI Assisted Fixes

- **Problem:** Nginx crash on boot if upstreams were down.
- **Solution:** Dynamic resolution via `set $variable` and `resolver 127.0.0.11` (docker dns).
- **Architectural Value:** Ensures Gateway high availability.

- **Problem:** Rate-limiter blocking Gateway IP due to missing trust.
- **Solution:** `app.set('trust proxy', 1)` (only for proxy chain) in Express + `X-Forwarded-For` propagation in Nginx.
- **Architectural Value:** Accurate user identification and security.