# Portfolio Website

[![License](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)
[![CI Status](https://github.com/notseekeru/portfolio_website/actions/workflows/ci-pipeline.yml/badge.svg)](https://github.com/notseekeru/portfolio_website/actions)
[![CD Status](https://github.com/notseekeru/portfolio_website/actions/workflows/cd-pipeline.yml/badge.svg)](https://github.com/notseekeru/portfolio_website/actions)

## TechStack

- TypeScript (for frontend and backend development)
- Node.js (for backend application)
- React (for frontend application)

## System Stack

- Cloudflare Tunnel (cloudflared)
- Nginx (for reverse proxying)
- Tailscale (for secure encrypted bridge between Raspberry Pi and local desktop)
- Docker (for containerizing the backend application)

## Website Features

- Single Page Application (SPA) for smooth navigation and fast loading times.
- Hover interactive project and tool overview in the Infrastructure, Projects, Languages, Tools & Framework sections.
- Interactive Mermaid Diagrams for infrastructure and CI/CD pipelines at blogposts.
- Contact form with N8N integration using webhooks and secure headers.

## Testing and Security:

- SSLLabs for testing SSL configuration and security headers.
- To test the SSL configuration and security headers of your website, you can use the following command:

```bash
  curl -I https://portfolio.seekeru.tech
  curl -IL http://portfolio.seekeru.tech
  curl -IL --http3 https://portfolio.seekeru.tech
  curl -o /dev/null -s -w "DNS: %{time_namelookup}s\nConnect: %{time_connect}s\nTLS: %{time_appconnect}s\nTTFB: %{time_starttransfer}s\nTotal: %{time_total}s\n" https://portfolio.seekeru.tech



  curl -I -H "Accept-Encoding: gzip, deflate, br" https://portfolio.seekeru.tech

  curl -A "Googlebot" -I https://portfolio.seekeru.tech
  curl -A "Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15" -I https://portfolio.seekeru.tech


  curl -I -X OPTIONS https://portfolio.seekeru.tech \
  -H "Origin: https://malicious-example.com" \
  -H "Access-Control-Request-Method: GET"


```

Todos:

<!--
- N8N integration for contact form submissions using webhooks and secure headers.
- Dependabot in GitHub for automated dependency updates and security patches.
- Project section with actual good projects to show
- Implementing a live monitoring solution to track the performance and health of the application and the overall system infrastructure.
-->
