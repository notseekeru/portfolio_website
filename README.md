# Portfolio Website

[![License](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)
[![CI](https://github.com/notseekeru/portfolio_website/actions/workflows/ci-pipeline.yml/badge.svg)](https://github.com/notseekeru/portfolio_website/actions)
[![CD](https://github.com/notseekeru/portfolio_website/actions/workflows/cd-pipeline.yml/badge.svg)](https://github.com/notseekeru/portfolio_website/actions)

Single-page portfolio website: React 19 + TypeScript + Vite + Tailwind 4, containerized with Docker and deployed via a GitOps pipeline.

## Features

- SPA with client-side routing.
- Interactive project & tool overview (Infrastructure, Projects, Languages, Tools & Frameworks).
- Mermaid diagrams for infrastructure and CI/CD pipeline visuals.
- Syntax highlighting with PrismJS; zoomable diagrams.
- Contact form wired to N8N webhooks with secure headers.

## Tech Stack

| Layer         | Stack                                                          |
| ------------- | -------------------------------------------------------------- |
| Frontend      | React 19, TypeScript, Vite, Tailwind CSS 4, Mermaid, PrismJS   |
| Container     | Docker (multi-stage dev/prod targets in `frontend/Dockerfile`) |
| Orchestration | Docker Compose, Nginx ingress                                  |
| Networking    | Cloudflare Tunnel (cloudflared), Tailscale                     |
| CI/CD         | GitHub Actions → GHCR (multi-arch) → GitOps repo               |

## Local Development

Start the dev container (lints and typechecks on `make up`; source mounts in `/app`):

```bash
make up        # builds + starts dev stack on :5173
```

The `Makefile` wraps Docker Compose. Useful targets:

```bash
make lint      # biome lint
make exec      # lint + typecheck + audit inside container
make build     # build dev image
make logs      # tail dev logs
make down      # stop dev stack
```

Prod variants use `make prod-up`, `make prod-build`, `make prod-down`.

## CI/CD

- **CI** (`ci-pipeline.yml`): lint, typecheck, build, `npm audit`, Trivy filesystem scan on push/PR.
- **CD** (`cd-pipeline.yml`): on successful CI on `main` → build + multi-arch image (`linux/amd64`, `linux/arm64`), Trivy image scan, smoke test, push to GHCR, then kustomize the image tag in the GitOps repo to trigger deploy.
- **Dependabot** (`dependabot.yml`): weekly updates for npm and Docker dependencies.

## Deployment Architecture

```
Clusters
   │                                          │
   └── Nginx Ingress ── Docker (frontend) ── Cloudflare Tunnel ── internet
```

Requests route: Cloudflare Tunnel → Nginx ingress → Docker container → static assets.

## Verification

Check SSL config, security headers and response timing:

```bash
H=https://portfolio.seekeru.tech
curl -IL $H                                  # headers + redirects
curl -IL --http3 $H                          # HTTP/3
curl -o /dev/null -s -w "\
DNS: %{time_namelookup}s\nConnect: %{time_connect}s\nTLS: %{time_appconnect}s\nTTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" $H
curl -A "Googlebot" -I $H                    # bot view
curl -I -X OPTIONS $H \
  -H "Origin: https://malicious-example.com" \
  -H "Access-Control-Request-Method: GET"    # CORS check
curl -I --compressed $H                      # gzip/br
```

Full HTTPS/security scoring via [SSL Labs](https://www.ssllabs.com/ssltest/).

## Project Structure

```
├── frontend/          # React app (src, Dockerfile, nginx.conf, vite.config)
├── scripts/           # port-claimer.sh
├── .github/workflows/ # CI + CD pipelines
├── Makefile           # compose wrapper (dev/prod)
├── compose*.yml       # docker compose dev/prod overlays
└── html-css-parser.py # tooling helper
```
