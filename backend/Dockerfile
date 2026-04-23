#BASE IMAGE FOR DEV AND PRUNE STAGE
FROM node:24-alpine AS base

WORKDIR /app

COPY package*.json ./

RUN npm ci

#DEV // RUN AS NODE USER
FROM base AS dev

USER node

COPY --chown=node:node . . 

EXPOSE 5000

CMD ["npm", "run", "dev"]

#PRUNE // STAY AS ROOT USER
FROM base AS prune

COPY . .

RUN npm run build && npm prune --omit=dev

#PROD // RUN AS NODE USER
FROM node:24-alpine AS prod

ENV NODE_ENV=production

USER node

#SET ANOTHER WORKDIR BECAUSE YOU HAVE STARTED A NEW IMAGE
WORKDIR /app

COPY --from=prune --chown=node:node /app .

CMD ["node", "./dist/server.js"]