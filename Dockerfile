FROM node:18-alpine

WORKDIR /app

ENV PORT 3000

RUN npm install

RUN npm install sequelize-cli

COPY sa-key.json /app/sa-key.json

COPY . .

EXPOSE 3000

CMD npm run start
