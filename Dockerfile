FROM node:18-alpine

WORKDIR /app

ENV PORT 8080

RUN npm install

RUN npm install sequelize-cli

COPY sa-key.json /app/sa-key.json

COPY . .

EXPOSE 8080

CMD npm run start
