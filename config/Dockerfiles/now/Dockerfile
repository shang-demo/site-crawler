FROM node:8.9

WORKDIR /app

# cache npm install
COPY package.json /app
RUN npm install && npm i -g pm2

# copy project
ADD . /app

EXPOSE 3000

CMD ["npm", "run", "start"]
