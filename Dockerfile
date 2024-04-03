FROM node:lts-alpine3.18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3003

CMD ["node", "server.js"]
