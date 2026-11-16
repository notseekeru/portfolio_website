FROM node:lts-alpine3.24@sha256:6bd9ab43c0ec0190ca7b2d193906cb8b7edf6e7f4afa43ddeccd6452710bffb5 AS base

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN chown node:node /app

USER node

RUN npm ci

COPY --chown=node:node . .

FROM base AS dev

EXPOSE 5174

CMD ["npm", "run", "dev", "--", "--host"]

FROM base AS builder

# No ARG: Vite reads frontend/.env.production (committed, public value) during `npm run build`.
# The publishable key is not a secret — it ships in dist/assets/*.js by design.
RUN npm run build

FROM nginxinc/nginx-unprivileged:1.31.7@sha256:09b0d3eda2aa592d2487f284519419015cab010d7df16cd0fe224b585fc60eb6 AS prod

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

