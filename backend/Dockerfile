#BASE IMAGE FOR DEV AND PRUNE STAGE
FROM node:24-alpine AS base

WORKDIR /app

COPY package*.json ./
RUN npm install

#DEV // RUN AS NODE USER
FROM base AS dev

USER node

COPY --chown=node:node . . 

EXPOSE 5000

CMD ["node", "--watch", "./src/server.js"]

#PRUNE // STAY AS ROOT USER
FROM base AS prune

COPY . .

RUN npm prune --omit=dev

#PROD // RUN AS NODE USER
FROM node:24-alpine AS prod

USER node

#SET ANOTHER WORKDIR BECAUSE YOU HAVE STARTED A NEW IMAGE
WORKDIR /app

COPY --from=prune --chown=node:node /app .

CMD ["node", "./src/server.js"]