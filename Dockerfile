FROM node:24

LABEL authors="kttrez"
LABEL name="symfi-api"

EXPOSE 5000

WORKDIR /usr/src/app

COPY src ./src
COPY package*.json ./
COPY tsconfig.json ./

RUN npm ci
RUN echo "" > .env

CMD ["npm", "run", "start"]
