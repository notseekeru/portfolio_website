FROM node:lts-alpine3.24@sha256:44fce696f38ba8c987c4db89954051000bbd05ffd8d8659ba15ed4a8602e937f AS base

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN chown node:node /app

USER node

RUN npm ci

COPY --chown=node:node . .

FROM base AS dev

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

FROM base AS builder

# No ARG: Vite reads frontend/.env.production (committed, public value) during `npm run build`.
# The publishable key is not a secret — it ships in dist/assets/*.js by design.
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.31.7@sha256:94193d5c4c5df716f412bb08eb97956d98fe6b59886f0bc57d6d3a3402a88a02 AS prod

# Base image snapshots lag Debian point releases (deb13uN); patch OS packages at build.
# nginx itself is a local .deb at prio 100, so `upgrade` cannot un-pin the tag.
USER root
RUN apt-get update \
    && DEBIAN_FRONTEND=noninteractive apt-get -y -o Dpkg::Options::=--force-confold \
    upgrade --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*
USER 101

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

