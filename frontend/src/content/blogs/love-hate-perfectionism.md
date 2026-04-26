---
title: Love Hate Perfectionism
date: 2026-04-25
description: Escaping the AI-generated "blackbox" to build a deterministic, hardened proxy chain and segmented network on a Raspberry Pi 5.
image: /blog/images/04.png
---

# Summary

This article chronicles a pivotal refactoring of my portfolio website. What started as an abstracted, AI-"vibe-coded" application evolved into an opaque blackbox that I frankly didn't fully understand. Driven by perfectionism, QA paranoia, and performance anxiety, I tore it down and rebuilt it. This narrative covers dismantling complex logic to reconstruct the infrastructure from the bottom up—establishing strict Docker network segmentations, navigating Raspberry Pi 5 SSD storage limits, and mastering raw proxy chains from Cloudflare down to Nginx.

---

# Escaping the Blackbox

The architectural journey began a month prior when I migrated away from expensive, abstracted Vercel infrastructure to a self-hosted Raspberry Pi setup. To compensate for the new self-hosted learning curve, I relied heavily on AI to "vibe code" features and complex integrations—like Google APIs for a chatbot system—at breakneck speed.

At first, AI generation genuinely felt like a superpower. Features were shipping at lightspeed. But the abstraction had a hidden cost.

It started innocently—asking an AI to write a raw Nginx script via PowerShell. Hours later, I discovered it had saved the configuration in UTF-16 instead of UTF-8, breaking the entire gateway in a way I couldn't initially diagnose. When deeper state-recreation issues arose between my backend routing and Cloudflare tunnels, the illusion completely shattered. I looked at my own codebase and realized I was staring into a blackbox.

There is a profound, suffocating discomfort in not understanding your own work. The anxiety of taking a brittle, opaque system into production—especially one with open ports—forced me to stop. I had to rip out the complex, unnecessary layers, including my neat little chatbot, and start over from the conceptual bottom.

## The Paradox of Perfectionism

This teardown triggered my old nemesis: perfectionism. I wanted the network to be flawless. I wanted my Ansible playbooks and Pi deployments to be bulletproof. I spent days rigoring my QA process, manually testing rate limits, testing maximum payload sizes, and implementing UFW rules until I was paralyzed by the sheer volume of "what-ifs."

But perfectionism is a double-edged sword. On one hand, it kept me in maintenance mode, endlessly polishing configurations instead of shipping content. On the other hand, it was precisely that paranoia—that obsessive need to thoroughly understand the _why_ and _how_ behind Nginx configs and Docker segmentations—that broke open the blackbox. It forced me to learn the very networking foundations that AI had so conveniently abstracted away.

## Rebuilding the Foundation: The Proxy Chain

I abandoned abstracted, AI-generated proxying rules. Instead, I established a strict, linear proxy chain that I explicitly controlled. Public traffic now hits the Cloudflare Edge, tunnels securely into the internal network via `cloudflared`, lands on a dedicated `Nginx` reverse proxy acting as the edge gateway, and only then gets routed to the internal Vite/React website.

Configuring this manually built muscle memory. I enforced headers, real IPs, and strict network policies resulting in a flawless HTTP 200 health check and an SSL Labs 'A' (Because I didn't implement all security measures needed inside the cloudflare Dashboard, I think it was HSTS. Im not sure, not a Security Guy) rating on the first try.

```nginx
# nginx.conf
server {
    # This is just a snippet of the specific server block for the portfolio domain(./nginx/con.f/portfolio.conf). The full configuration(./nginx.conf) and some h5bp includes additional security hardening and optimizations.

    listen 80;
    server_name portfolio.seekeru.tech;

    # Limit request body size for uploads
    client_max_body_size 20M;

    location /api {
        resolver 127.0.0.11 valid=30s;
        set $upstream_backend portfolio-prod-backend;
        proxy_pass http://$upstream_backend:3000;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        # Allow only safe methods for static frontend
        limit_except GET HEAD {
            deny all;
        }
        resolver 127.0.0.11 valid=30s;
        set $upstream_frontend portfolio-prod-frontend;
        proxy_pass http://$upstream_frontend:8080;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    include h5bp/basic.conf;
    include h5bp/location/security_file_access.conf;
}
```

_Note: Propagating `X-Forwarded-For` explicitly allowed Express to apply `app.set('trust proxy', 1)`, preventing the internal rate limiter from mistakenly blocking the Nginx Gateway IP._

## Segmenting the Network boundaries

To enforce these new routing rules, the entire application stack was re-orchestrated into a unified Docker Compose file. We implemented discrete software-defined networks: `edge`, `frontend_net`, and `backend_net`. Containers can only communicate within their assigned lanes, effectively isolating potential blast radii.

```yaml
# compose.yml snippet
services:
  nginx:
    image: nginx:stable-alpine
    networks:
      - edge
      - frontend_net
      - backend_net
    ports:
      - "80:80"

  frontend:
    image: ghcr.io/my-portfolio/frontend:latest
    networks:
      - frontend_net # Cannot be reached directly from the host

networks:
  edge:
    driver: bridge
  frontend_net:
    driver: bridge
  backend_net:
    driver: bridge
```

## Overcoming Hardware Constraints

Running workloads on a Raspberry Pi 5 introduces hardware constraints, specifically concerning SSD storage capacity and IOPS exhaustion over time. Building natively on the Pi previously resulted in bloated 1GB images that choked my initial deployments.

Building upon my earlier multi-stage isolation strategies (separating base, dev, prune, and prod layers to run as `non-root`), I fully offloaded the continuous delivery process. I implemented GitHub Container Registry (GHCR) for remote image storage and Docker Buildx with QEMU to natively support cross-platform ARM and AMD64 deployments.

I also integrated Trivy into the CD pipeline for CVE and Secret scanning. Realizing that "zero vulnerabilities" is an unattainable ideal that blocks production, I implemented a blast-radius mitigation strategy, deliberately bypassing low-impact base-image CVEs (e.g., `musl`, `zlib`, `picomatch`) locally so we can deploy efficiently while remaining guarded against critical application-level threats.

```bash
# Push multi-arch to GHCR, saving Pi SSD space
docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/my-portfolio/app:latest --push .

# Trivy execution: High/Crit only, ignore unfixed system libs
trivy image --severity HIGH,CRITICAL --ignore-unfixed --skip-files "musl,zlib,picomatch" ghcr.io/my-portfolio/app:latest
```

The Pi now acts entirely as a lightweight pull-node using Watchtower.

## Lessons Learned: Fundamentals Beat Vibe Coding

At some point during the endless cycle of `docker compose down` and `docker compose up`, muscle memory took over. Staring at raw Nginx blocks and configuring the Cloudflare tunnel manually made me understand the flow of data across my infrastructure in a way that AI generation never could.

Accepting that AI output isn't a substitute for systemic comprehension was a hard lesson, but an essential one. Sometimes, avoiding complexity is just an excuse to stay in our comfort zones. AI forced me to generate code I couldn't comprehend, which in turn forced me to rip it out and learn it from the ground up.

I’m deliberately carving my path toward becoming a Systems Architect. To get there, I don't need to write flawless code on the first try, nor do I need an AI to magically solve my networking woes. I need the resilience to break things apart, the humility to embrace the boring fundamentals, and the wisdom to know that true security isn't just about firewall rules—it's about deeply understanding the blackbox until it isn't a blackbox anymore.
