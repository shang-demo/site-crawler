#
# 构建环境
#
FROM node:16-slim AS build

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
RUN npm install
COPY . .
RUN npm run build

#
# 运行环境
#
FROM zenika/alpine-chrome:with-node

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser

WORKDIR /usr/src/app

COPY --chown=chrome --from=build /app/dist/package.json /app/dist/package-lock.json ./
RUN npm install --production

COPY --chown=chrome --from=build /app/dist ./

ENTRYPOINT ["tini", "--"]

EXPOSE 8080
CMD ["npm", "run", "start:docker"]
