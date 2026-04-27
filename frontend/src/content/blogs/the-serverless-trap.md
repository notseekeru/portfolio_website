---
title: The Serverless Trap
date: 2026-03-12
description: How I managed Infrastructure using Containerized Cloudflare and Raw Nginx Configuration
image: "https://cdn-icons-png.flaticon.com/512/18146/18146428.png"
---

---

# Summary

Migrated a fragmented, Vercel-dependent frontend and local backend into a hardened, self-hosted, proxy-chained infrastructure. The system now centralizes traffic management at a single L7 gateway while isolating application services into distinct networks.

---

## Docker Production

- **Problem:** My Windows machine was running out of space when my standard image(dockerfiles you get from your first docker tutorial video) was taking up around 1GB per image. This was quite worrisome for me since I was migrating this to my Raspberry Pi.

- **Docker Layers:** Separated layers for base, dev, prune, and prod. This allows for better caching and smaller final images. The base layer contains all dependencies, the dev layer is for development, the prune layer builds the app and removes dev dependencies, and the prod layer creates a clean image with only production dependencies.

- **Docker Multi-stage:** Now using a multistage Dockerfile to separate base, dev, build, and prod builds, addresses bloated images, separates unused dependencies between dev and prod, and helps with setting up root and non-root users. This is crucial for optimizing the image size and improving security by running the application as a non-root user in production. Here’s an example of a multistage Dockerfile:

```dockerfile
# --- BASE IMAGE FOR BACKEND
FROM node:lts-alpine3.23 AS base
WORKDIR /app
COPY --chown=node:node package*.json ./
RUN chown node:node /app
USER node
RUN npm ci
COPY --chown=node:node . .

# --- DEV // RUN AS NODE USER
FROM base AS dev
EXPOSE 5000
CMD ["npm", "run", "dev"]

# --- PRUNE // RUN AS NODE USER
FROM base AS prune
RUN npm run build && npm prune --omit=dev

# --- PROD NEW IMAGE // RUN AS NODE USER
FROM node:lts-alpine3.23 AS prod
RUN apk add --no-cache --upgrade musl musl-utils zlib
ENV NODE_ENV=production

#SET ANOTHER WORKDIR BECAUSE YOU HAVE STARTED A NEW IMAGE
RUN mkdir /app && chown node:node /app
WORKDIR /app
COPY --from=prune /app .
USER node
CMD ["node", "./dist/server.js"]
```

- **Reward:** The final production image is now around 70% smaller, which is a significant improvement from the initial 1GB+. This optimization is crucial for running the application on resource-constrained devices like Raspberry Pi.

- **Docker Compose:** Shifted from using a single compose file for both dev and production to separate, well-defined compose files. This allows for more flexible and maintainable configurations. For example:

```yml
compose.yml; // Base stage and inherits
compose.dev.yml; // Dev stage, inherits from base, adds dev-specific services and configurations
compose.prod.yml; // Prod stage, inherits from base, adds prod-specific services and configurations
```

## Docker Security

- **Problem:** My initial Docker images were bloated and had a large attack surface, which was not ideal for production, especially on a resource-constrained device like a Raspberry Pi.

- **Non-root User:** Using `chown` to set the correct ownership of files and directories in the Docker image. This is important for security and proper functioning of the application, especially when running as a non-root user. In the example above, `chown node:node` (node user is already created by nodejs) is used to change the ownership of the application files to the `node` user and group, which is the default non-root user in the Node.js Alpine image. This ensures that the application runs with the least privileges necessary, reducing the risk of security vulnerabilities.

- **Docker Scout:** Conducted CVSS security scans using Docker Scout to identify image vulnerabilities and applied feasible fixes. Used smaller distro images(like alpine) and locked image versions to reduce the attack surface. (Noted that not all vulnerabilities are fixable or worth fixing.) `Why is this important?` It’s crucial to maintain a secure and efficient production environment, especially when hosting on resource-constrained devices like Raspberry Pi. When you have a bloated image, it not only takes up more disk space but also increases the attack surface for potential vulnerabilities. By using smaller base images and locking versions, you can mitigate security risks and optimize performance.

---

## Nginx Shift

- **Problem:** Vercel commercial uptime and for its infrastructure control is quite expensive. I planned to mitigate future headaches and costs by self-hosting my projects. This required a shift in infrastructure to manage my own server and traffic.
- **Nginx Raw Conf:** Made the decision to eliminate nginx proxy manager as a solution and introduced raw nginx conf to the server project to handle traffic of my websites.
- **Control and uptime:** I now manage server uptime, control, and configuration in my very own workspace.

---

## Infastructure Debugging && Troubleshooting

- **Problem:** I faced a ton of problems I had to debug myself, this involved a lot of things since I second-guessed and used AI and Github repos to just essentially copy-paste my nginx raw conf. This introduced a lot of networking issues for connection networks inside my dockerized container and some internal project code flaws.
- **Nginx AI File:** This one was probably one of the hardest things to solve since it was my first time using nginx. It really troubled me specially when I told an AI who was on dangerously-on-skip-permissions to WRITE me some boilerplate code on my raw conf files in nginx. The prompt was quite vague and I didn't tell them to test the code to work. The AI wrote the code but tested it and ran PowerShell commands and made the file UTF-16 (which is supposed to be UTF-8). This confused me, had a hard time trying to debug just one file.
- **Internal Project Code:** Code inside projects itself needs to be added and manipulated for sustaining nginx. This code usually involves adding raw nginx.conf in the project folder and some backend server code and environment variables for connecting the project all together.

---

## Networking Architecture

- **Tunnel:** Cloudflare Tunnel (Zero Trust), to satiate CGNAT bypass and security measures (eg. removing the need to port forward).
- **Reverse Proxy:** Nginx Gateway (L7 Dispatcher)
- **Isolation and Connection:** Isolated Docker Networks (`portfolio_website`)
- **Strategy:** All Cloudflare traffic hits `gateway:80`. Nginx handles the "Smart" routing to internal services. This eliminates the need to connect a ton of cloudflare connectors. This also reduces cloudflared instance and reduces use of resources which are crucial for low-end computers such as Raspberry Pi that I plan to host it on.

---

## AI Assisted Fixes

- **Problem:** Nginx crash on boot if upstreams were down.
- **Solution:** Dynamic resolution via `set $variable`, `set $upstream` and `resolver 127.0.0.11` (docker dns).
- **Architectural Value:** Ensures Gateway high availability.

- **Problem:** Rate-limiter blocking Gateway IP due to missing trust.
- **Solution:** `app.set('trust proxy', 1)` (only for proxy chain) in Express + `X-Forwarded-For` propagation in Nginx.
- **Architectural Value:** Accurate user identification and security.

---

# Conclusion

This project was a significant learning experience in managing infrastructure, debugging complex issues, and leveraging AI for solutions. The shift from a serverless platform to a self-hosted environment has given me greater control and understanding of the underlying technologies. The challenges faced along the way have been invaluable in honing my skills as a developer and my path to become a Systems Architect.

---

## Update (April 25, 2026)

You can check the others blogs I wrote about the follow up iterations and updates related to this current project. Link at [Love Hate Perfectionism](https://portfolio.seekeru.tech/blog/love-hate-perfectionism).
