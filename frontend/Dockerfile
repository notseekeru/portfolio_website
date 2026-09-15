FROM node:lts-alpine3.24@sha256:50c8e8ca1d27439048670df5883f32d57cf81cff6233222c893fd0d9884cbd81 AS base

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

FROM nginxinc/nginx-unprivileged:1.31.5@sha256:9d689e987337916e713a2d5fa84966550d9532e4cb512e7d6ad99df87ffe1ec8 AS prod

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

