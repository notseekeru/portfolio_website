# --- BASE IMAGE
FROM node:lts-alpine3.22 AS base

WORKDIR /app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . . 

USER node

# --- DEV // RUN AS NODE USER
FROM base AS dev

EXPOSE 5000

CMD ["npm", "run", "dev"]

# --- PRUNE // RUN AS NODE USER
FROM base AS prune

RUN npm run build && npm prune --omit=dev

# --- PROD NEW IMAGE // RUN AS NODE USER
FROM node:lts-alpine3.22 AS prod

ENV NODE_ENV=production

#SET ANOTHER WORKDIR BECAUSE YOU HAVE STARTED A NEW IMAGE
RUN mkdir /app && chown node:node /app

WORKDIR /app

COPY --from=prune --chown=node:node /app .

USER node

CMD ["node", "./dist/server.js"]