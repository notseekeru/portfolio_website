---
title: The Production Image
date: 2026-03-12
description: How I managed Infrastructure using Containerized Cloudflare and Raw Nginx Conf
image: /blog/prodscreenshot.png
---

# Summary

Migrated a fragmented, Vercel-dependent frontend and local backend into a hardened, self-hosted, proxy-chained infrastructure. The system now centralizes traffic management at a single L7 gateway while isolating application services into distinct networks.

## Docker Production

- **Problem:** My Windows machine was running out of space when my non-multistage image was taking up around 1GB per image. This was quite worrisome for me since I was migrating this to my Raspberry Pi.
- **Docker Scout:** Conducted CVSS security scans using Docker Scout to identify image vulnerabilities and applied feasible fixes. Used smaller distro images and locked image versions to reduce the attack surface. (Noted that not all vulnerabilities are fixable or worth fixing.)
- **Docker Files:** Used a multistage Dockerfile to separate base, dev, build, and prod builds. This addresses bloated images, separates unused dependencies between dev and prod, and helps with setting up root and non-root users.

```dockerfile
# Example of a multistage Dockerfile
FROM node:24-alpine AS base
WORKDIR /app
RUN chown node:node /app
USER node
COPY --chown=node:node package*.json ./
RUN npm install

# DEV
FROM base AS dev
COPY --chown=node:node . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]

# BUILDER
FROM base AS builder
COPY --chown=node:node . .
RUN npm run build

# PROD
FROM nginx:1.29.5-alpine AS prod
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

- **Docker Compose:** Shifted from using a single compose file for both dev and production to separate, well-defined compose files. For example:

```javascript
compose.yml; // Base stage and inherits
compose.dev.yml;
compose.prod.yml;
```

## Nginx Shift

- **Problem:** Vercel commercial uptime and for its control is overpriced.
- **Nginx Raw Conf:** Made the decision to eliminate nginx proxy manager as a solution and introduced raw nginx conf to the server project to handle traffic of my websites.
- **Control and uptime:** I now manage server uptime, control, and configuration in my very own workspace.

## Infastructure Debugging && Troubleshooting

- **Problem:** I faced a ton of problems I had to debug myself, this involved a lot of things since I second-guessed and used AI and Github repos to just essentially copy-paste my nginx raw conf. This introduced a lot of networking issues for connection networks inside my dockerized container and some internal project code flaws.
- **Docker Network:** Very difficult to understand but I managed to apply solutions to these problems that were essential in building this infrastructure.
- **Nginx AI File:** This one was probably one of the hardest things to solve since it was my first time using nginx. It really troubled me specially when I told an AI who was on dangerously-on-skip-permissions to WRITE me some boilerplate code on my raw conf files in nginx. The prompt was quite vague and I didn't tell them to test the code to work. The AI wrote the code but tested it and ran PowerShell commands and made the file UTF-16 (which is supposed to be UTF-8). This confused me, had a hard time trying to debug just one file.
- **Internal Project Code:** Code inside projects itself needs to be added and manipulated for sustaining nginx. This code usually involves adding raw nginx.conf in the project folder and some backend server code and environment variables for connecting the project all together.

## Networking Wiring

- **Tunnel:** Cloudflare Tunnel (Zero Trust), to satiate CGNAT bypass and security measures (eg. removing the need to port forward).
- **Reverse Proxy:** Nginx Gateway (L7 Dispatcher)
- **Isolation and Connection:** Isolated Docker Networks (`portfolio_website`)
- **Strategy:** All Cloudflare traffic hits `gateway:80`. Nginx handles the "Smart" routing to internal services. This eliminates the need to connect a ton of cloudflare connectors. This also reduces cloudflared instance and reduces use of resources which are crucial for low-end computers such as Raspberry Pi that I plan to host it on.
- **Architectural Value:** Centralized logging, SSL/TLS termination, and security header injection.

## AI Assisted Fixes

- **Problem:** Nginx crash on boot if upstreams were down.
- **Solution:** Dynamic resolution via `set $variable` and `resolver 127.0.0.11` (docker dns).
- **Architectural Value:** Ensures Gateway high availability.

- **Problem:** Rate-limiter blocking Gateway IP due to missing trust.
- **Solution:** `app.set('trust proxy', 1)` (only for proxy chain) in Express + `X-Forwarded-For` propagation in Nginx.
- **Architectural Value:** Accurate user identification and security.
