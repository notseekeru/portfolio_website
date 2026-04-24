# --- BASE IMAGE
FROM node:lts-alpine3.22 AS base

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . . 

USER node

# --- DEV
FROM base AS dev

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

# --- BUILDER
FROM base AS builder

RUN npm run build

# --- PROD
FROM nginxinc/nginx-unprivileged:1.29.5-alpine AS prod

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
