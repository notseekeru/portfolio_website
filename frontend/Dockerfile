FROM node:24-alpine AS base

WORKDIR /app

RUN chown node:node /app

USER node

COPY --chown=node:node package*.json ./

RUN npm install

#DEV
FROM base AS dev

COPY --chown=node:node . . 

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]


#BUILDER
FROM base AS builder

COPY --chown=node:node . .

RUN npm run build

#PROD
FROM nginx:1.29.5-alpine AS prod

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
