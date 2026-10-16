FROM node:lts-alpine3.24@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS base

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

FROM nginxinc/nginx-unprivileged:1.31.6@sha256:929e1d5e610e8aa89a1715ba44dce5edb4d42c172a208c171233292f472560c5 AS prod

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

