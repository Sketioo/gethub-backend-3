FROM node:18-alpine

WORKDIR /app

ENV PORT 3000

RUN npm install

RUN npm install sequelize-cli

COPY . .

EXPOSE 3000

CMD npm run rollback-all && npm run migrate && npm run start
