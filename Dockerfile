FROM node:16-slim AS build

WORKDIR /app

COPY package.json ./package.json
COPY pnpm-lock.yaml ./pnpm-lock.yaml
RUN npm install -g pnpm && pnpm install

COPY . .
RUN npm run build

FROM ghcr.io/puppeteer/puppeteer:19.6.2

USER root
RUN npm install -g pnpm

USER pptruser

COPY --chown=pptruser --from=build /app/dist/package.json ./package.json
COPY --chown=pptruser --from=build /app/dist/pnpm-lock.yaml ./pnpm-lock.yaml

RUN pnpm install --production

COPY --chown=pptruser --from=build /app/dist .

EXPOSE 8080

CMD ["npm", "run", "start:docker"]
