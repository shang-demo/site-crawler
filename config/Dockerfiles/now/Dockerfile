FROM node:8.9-alpine

WORKDIR /app

RUN apk add --no-cache git
# cache npm install
COPY package.json .
RUN npm install --production

# copy project
ADD . .

EXPOSE 3000

CMD ["npm", "run", "start"]
